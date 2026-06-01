import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    // Mask the keys for display
    const maskedKeys = apiKeys.map((key) => ({
      ...key,
      key: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`,
    }))

    return NextResponse.json({ success: true, data: maskedKeys })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is on Pro+ plan
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || user.subscriptionPlan === 'FREE') {
      return NextResponse.json(
        { error: 'API access requires a Pro or Enterprise subscription' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const parsed = createKeySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Check key limit
    const existingKeys = await prisma.apiKey.count({
      where: { userId: session.user.id, status: 'ACTIVE' },
    })

    if (existingKeys >= 10) {
      return NextResponse.json({ error: 'Maximum 10 API keys allowed' }, { status: 400 })
    }

    // Generate unique API key
    const key = `kva_${nanoid(32)}`

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name: parsed.data.name,
        key,
      },
    })

    // Return full key only once at creation
    return NextResponse.json({
      success: true,
      data: apiKey,
      message: 'Save this key - it will not be shown again',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
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

    const apiKey = await prisma.apiKey.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    await prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 })
  }
}
