import { prisma } from '@/lib/db/prisma'
import { TTSStudio } from '@/components/dashboard/tts-studio'

export default async function TTSPage() {
  const voices = await prisma.voice.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return <TTSStudio voices={voices} />
}
