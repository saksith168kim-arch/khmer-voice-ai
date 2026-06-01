import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { getSignedAudioUrl } from '@/lib/storage/s3'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where: { userId: session.user.id },
        include: { voice: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.generation.count({ where: { userId: session.user.id } }),
    ])

    // Refresh signed URLs if needed
    const generationsWithUrls = await Promise.all(
      generations.map(async (gen) => {
        let audioUrl = gen.audioUrl
        // If audio key exists, generate fresh signed URL
        if (gen.audioKey && process.env.AWS_S3_BUCKET) {
          try {
            audioUrl = await getSignedAudioUrl(gen.audioKey)
          } catch {
            // Keep original URL if signing fails
          }
        }
        return { ...gen, audioUrl }
      })
    )

    return NextResponse.json({
      success: true,
      data: generationsWithUrls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const generation = await prisma.generation.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!generation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.generation.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
