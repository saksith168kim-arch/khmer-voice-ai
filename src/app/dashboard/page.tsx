import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { subDays, format, startOfDay } from 'date-fns'
import { DashboardOverview } from '@/components/dashboard/overview'

async function getDashboardData(userId: string) {
  const [user, totalGenerations, activeApiKeys, recentGenerations, usageLogs] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { charactersUsed: true, charactersLimit: true, subscriptionPlan: true, name: true },
      }),
      prisma.generation.count({ where: { userId } }),
      prisma.apiKey.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.generation.findMany({
        where: { userId },
        include: { voice: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.usageLog.findMany({
        where: { userId, createdAt: { gte: subDays(new Date(), 7) } },
        orderBy: { createdAt: 'asc' },
      }),
    ])

  const usageByDay = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayStart = startOfDay(date)
    const dayEnd = new Date(dayStart.getTime() + 86400000)
    const dayLogs = usageLogs.filter((l) => l.createdAt >= dayStart && l.createdAt < dayEnd)
    return {
      date: format(date, 'MMM d'),
      count: dayLogs.length,
      characters: dayLogs.reduce((s, l) => s + l.characters, 0),
    }
  })

  return {
    user,
    totalGenerations,
    activeApiKeys,
    recentGenerations,
    usageByDay,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData(session!.user!.id!)

  return <DashboardOverview data={data} />
}
