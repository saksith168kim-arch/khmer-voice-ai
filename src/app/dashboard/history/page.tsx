import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { HistoryList } from '@/components/dashboard/history-list'

export default async function HistoryPage() {
  const session = await auth()

  const generations = await prisma.generation.findMany({
    where: { userId: session!.user!.id! },
    include: { voice: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-white">History</h1>
        <p className="text-white/40 text-sm mt-1">Your previously generated audio files</p>
      </div>
      <HistoryList initialGenerations={generations} />
    </div>
  )
}
