import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { subDays, format, startOfDay } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        charactersUsed: true,
        charactersLimit: true,
        subscriptionPlan: true,
      },
    })

    // Get totals
    const [totalGenerations, activeApiKeys] = await Promise.all([
      prisma.generation.count({ where: { userId } }),
      prisma.apiKey.count({ where: { userId, status: 'ACTIVE' } }),
    ])

    // Get recent generations (last 5)
    const recentGenerations = await prisma.generation.findMany({
      where: { userId },
      include: { voice: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get usage by day (last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7)
    const usageLogs = await prisma.usageLog.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group by day
    const usageByDay = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayStr = format(date, 'MMM d')
      const dayStart = startOfDay(date)
      const dayEnd = new Date(dayStart.getTime() + 86400000)

      const dayLogs = usageLogs.filter(
        (log) => log.createdAt >= dayStart && log.createdAt < dayEnd
      )

      usageByDay.push({
        date: dayStr,
        count: dayLogs.length,
        characters: dayLogs.reduce((sum, log) => sum + log.characters, 0),
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalGenerations,
        charactersUsed: user?.charactersUsed || 0,
        charactersLimit: user?.charactersLimit || 10000,
        activeApiKeys,
        recentGenerations,
        usageByDay,
        subscriptionPlan: user?.subscriptionPlan,
      },
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
