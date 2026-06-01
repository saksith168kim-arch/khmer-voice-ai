import { prisma } from '@/lib/db/prisma'
import { subDays, format, startOfDay, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'
import { AdminAnalyticsClient } from '@/components/admin/analytics-client'

async function getAnalytics() {
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)

  const [usageLogs, voiceStats, langStats] = await Promise.all([
    prisma.usageLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.generation.groupBy({
      by: ['voiceId'],
      _count: { id: true },
      _sum: { charactersUsed: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.generation.groupBy({
      by: ['language'],
      _count: { id: true },
    }),
  ])

  // Get voice names
  const voiceIds = voiceStats.map(v => v.voiceId)
  const voices = await prisma.voice.findMany({ where: { id: { in: voiceIds } } })
  const voiceMap = Object.fromEntries(voices.map(v => [v.id, v]))

  // Daily stats - last 30 days
  const dailyStats = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(now, 29 - i)
    const dayStart = startOfDay(date)
    const dayEnd = new Date(dayStart.getTime() + 86400000)
    const dayLogs = usageLogs.filter(l => l.createdAt >= dayStart && l.createdAt < dayEnd)
    return {
      date: format(date, 'MMM d'),
      generations: dayLogs.length,
      characters: dayLogs.reduce((s, l) => s + l.characters, 0),
    }
  })

  // Top voices
  const topVoices = voiceStats.map(vs => ({
    name: voiceMap[vs.voiceId]?.displayName || 'Unknown',
    language: voiceMap[vs.voiceId]?.language || 'UNKNOWN',
    count: vs._count.id,
    characters: vs._sum.charactersUsed || 0,
  }))

  // Language distribution
  const langDistribution = langStats.map(l => ({
    language: l.language || 'unknown',
    count: l._count.id,
  }))

  return { dailyStats, topVoices, langDistribution }
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-white">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Platform usage and performance metrics</p>
      </div>
      <AdminAnalyticsClient data={data} />
    </div>
  )
}
