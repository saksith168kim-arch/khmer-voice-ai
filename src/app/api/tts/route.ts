import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { ttsService } from '@/lib/tts/service'
import { uploadAudio } from '@/lib/storage/s3'
import { z } from 'zod'

const ttsSchema = z.object({
  text: z.string().min(1).max(5000),
  voiceId: z.string(),
  language: z.string().optional().default('en'),
  speed: z.number().min(0.5).max(2.0).optional().default(1.0),
  pitch: z.number().min(0.5).max(2.0).optional().default(1.0),
  format: z.enum(['mp3', 'wav']).optional().default('mp3'),
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication - support both session and API key
    let userId: string | null = null

    const session = await auth()
    if (session?.user?.id) {
      userId = session.user.id
    } else {
      // Check API key authentication
      const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '')
      if (apiKey) {
        const keyRecord = await prisma.apiKey.findUnique({
          where: { key: apiKey, status: 'ACTIVE' },
          include: { user: true },
        })
        if (keyRecord) {
          userId = keyRecord.userId
          // Update last used
          await prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: { lastUsedAt: new Date(), usageCount: { increment: 1 } },
          })
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const parsed = ttsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { text, voiceId, language, speed, pitch, format } = parsed.data

    // Get user and check character limits
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const charactersUsed = text.length
    if (user.charactersUsed + charactersUsed > user.charactersLimit) {
      return NextResponse.json(
        {
          error: 'Character limit exceeded',
          limit: user.charactersLimit,
          used: user.charactersUsed,
          remaining: user.charactersLimit - user.charactersUsed,
        },
        { status: 429 }
      )
    }

    // Get voice from database
    const voice = await prisma.voice.findUnique({ where: { id: voiceId } })
    if (!voice || !voice.isActive) {
      return NextResponse.json({ error: 'Voice not found' }, { status: 404 })
    }

    // Generate speech
    const { buffer, provider } = await ttsService.generateSpeech(
      {
        text,
        voiceId: voice.providerId || voice.name,
        language,
        speed,
        pitch,
        format,
      },
      voice.provider
    )

    // Skip S3 - return audio directly as base64
    const base64Audio = buffer.toString('base64')
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`
    const key = `local-${Date.now()}`
    const url = audioUrl
    const size = buffer.length
    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId,
        voiceId,
        text,
        audioUrl: url,
        audioKey: key,
        charactersUsed: charactersUsed,
        fileSize: size,
        language,
        speed,
        pitch,
        provider,
        status: 'completed',
      },
    })

    // Update user character usage
    await prisma.user.update({
      where: { id: userId },
      data: { charactersUsed: { increment: charactersUsed } },
    })

    // Log usage
    await prisma.usageLog.create({
      data: {
        userId,
        characters: charactersUsed,
        provider,
        voiceId,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        generationId: generation.id,
        audioUrl: url,
        characters: charactersUsed,
        duration: null, // Would be calculated from actual audio
      },
    })
  } catch (error) {
    console.error('TTS generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech', details: (error as Error).message },
      { status: 500 }
    )
  }
}
