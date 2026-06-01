import { prisma } from '@/lib/db/prisma'
import { AdminVoicesClient } from '@/components/admin/voices-client'

export default async function AdminVoicesPage() {
  const voices = await prisma.voice.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { generations: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-white">Voice Management</h1>
        <p className="text-white/40 text-sm mt-1">{voices.length} voices configured</p>
      </div>
      <AdminVoicesClient voices={voices} />
    </div>
  )
}
