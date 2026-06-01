import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { PLAN_LIMITS } from '@/types'
import { z } from 'zod'

const patchSchema = z.object({
  subscriptionPlan: z.enum(['FREE', 'PRO', 'ENTERPRISE']).optional(),
  role: z.enum(['user', 'admin']).optional(),
  charactersLimit: z.number().int().positive().optional(),
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

  const updateData: any = { ...parsed.data }

  // If changing plan, also update character limit
  if (parsed.data.subscriptionPlan) {
    updateData.charactersLimit = PLAN_LIMITS[parsed.data.subscriptionPlan].characters
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: updateData,
  })

  return NextResponse.json({ success: true, data: user })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  const currentUser = session?.user as any
  if (!session || currentUser?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Prevent self-deletion
  if (params.id === currentUser.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
