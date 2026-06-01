import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { BillingManager } from '@/components/dashboard/billing-manager'
import { getInvoices } from '@/lib/stripe'

export default async function BillingPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionPlan: true,
      subscriptionStatus: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      charactersUsed: true,
      charactersLimit: true,
    },
  })

  let invoices: any[] = []
  try {
    if (user?.stripeCustomerId) {
      invoices = await getInvoices(userId)
    }
  } catch { /* no Stripe setup */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-white">Billing</h1>
        <p className="text-white/40 text-sm mt-1">Manage your subscription and payment details</p>
      </div>
      <BillingManager user={user} invoices={invoices} />
    </div>
  )
}
