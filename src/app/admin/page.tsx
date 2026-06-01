import { prisma } from '@/lib/db/prisma'
import { subDays, format, startOfDay } from 'date-fns'
import { AdminOverviewClient } from '@/components/admin/overview-client'

async function getAdminStats() {
  const [
    totalUsers,
    totalGenerations,
    totalApiKeys,
    usersByPlan,
    recentUsers,
    recentGenerations,
    usageLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.generation.count(),
    prisma.apiKey.count({ where: { status: 'ACTIVE' } }),
    prisma.user.groupBy({ by: ['subscriptionPlan'], _count: { id: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, name: true, email: true, subscriptionPlan: true, createdAt: true, charactersUsed: true },
    }),
    prisma.generation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { voice: true, user: { select: { name: true, email: true } } },
    }),
    prisma.usageLog.findMany({
      where: { createdAt: { gte: subDays(new Date(), 14) } },
    }),
  ])

  const totalCharacters = await prisma.generation.aggregate({ _sum: { charactersUsed: true } })

  // Daily generation stats for last 14 days
  const dailyStats = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i)
    const dayStart = startOfDay(date)
    const dayEnd = new Date(dayStart.getTime() + 86400000)
    const dayLogs = usageLogs.filter((l) => l.createdAt >= dayStart && l.createdAt < dayEnd)
    return {
      date: format(date, 'MMM d'),
      generations: dayLogs.length,
      characters: dayLogs.reduce((s, l) => s + l.characters, 0),
    }
  })

  return {
    totalUsers,
    totalGenerations,
    totalApiKeys,
    totalCharacters: totalCharacters._sum.charactersUsed || 0,
    usersByPlan: usersByPlan.map((p) => ({ plan: p.subscriptionPlan, count: p._count.id })),
    recentUsers,
    recentGenerations,
    dailyStats,
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats()
  return <AdminOverviewClient stats={stats} />
}
