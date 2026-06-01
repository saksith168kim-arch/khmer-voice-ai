import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language')
    const gender = searchParams.get('gender')
    const featured = searchParams.get('featured')

    const where: any = { isActive: true }
    if (language) where.language = language.toUpperCase()
    if (gender) where.gender = gender.toUpperCase()
    if (featured === 'true') where.isFeatured = true

    const voices = await prisma.voice.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: voices })
  } catch (error) {
    console.error('Voices fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch voices' }, { status: 500 })
  }
}
