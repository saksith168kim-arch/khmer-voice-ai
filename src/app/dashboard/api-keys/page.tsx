import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { ApiKeysManager } from '@/components/dashboard/api-keys-manager'

export default async function ApiKeysPage() {
  const session = await auth()

  const [apiKeys, user] = await Promise.all([
    prisma.apiKey.findMany({
      where: { userId: session!.user!.id! },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: session!.user!.id! },
      select: { subscriptionPlan: true },
    }),
  ])

  // Mask keys
  const maskedKeys = apiKeys.map((k) => ({
    ...k,
    key: `${k.key.substring(0, 10)}...${k.key.substring(k.key.length - 4)}`,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-white">API Keys</h1>
        <p className="text-white/40 text-sm mt-1">Manage API keys to access Khmer Voice AI programmatically</p>
      </div>
      <ApiKeysManager initialKeys={maskedKeys} plan={user?.subscriptionPlan || 'FREE'} />
    </div>
  )
}
