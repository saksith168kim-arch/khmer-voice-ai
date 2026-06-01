import { prisma } from '@/lib/db/prisma'
import { VoiceLibraryClient } from '@/components/dashboard/voice-library'

export default async function VoicesPage() {
  const voices = await prisma.voice.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-white">Voice Library</h1>
        <p className="text-white/40 text-sm mt-1">Browse and preview all available AI voices</p>
      </div>
      <VoiceLibraryClient voices={voices} />
    </div>
  )
}
