import { prisma } from '@/lib/db/prisma'
import { AdminUsersClient } from '@/components/admin/users-client'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      charactersUsed: true,
      charactersLimit: true,
      createdAt: true,
      _count: { select: { generations: true, apiKeys: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-white">User Management</h1>
        <p className="text-white/40 text-sm mt-1">{users.length} total users</p>
      </div>
      <AdminUsersClient users={users} />
    </div>
  )
}
