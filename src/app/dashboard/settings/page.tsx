import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { SettingsForm } from '@/components/dashboard/settings-form'

export default async function SettingsPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id! },
    select: { id: true, name: true, email: true, image: true, subscriptionPlan: true },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account preferences</p>
      </div>
      <SettingsForm user={user} />
    </div>
  )
}
