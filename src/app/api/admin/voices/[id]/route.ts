import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  const currentUser = session?.user as any
  if (!session || currentUser?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const voice = await prisma.voice.update({
    where: { id: params.id },
    data: parsed.data,
  })

  return NextResponse.json({ success: true, data: voice })
}
