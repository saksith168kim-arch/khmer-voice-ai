'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  CreditCard, Crown, Zap, Building2,
  Check, ExternalLink, FileText, ArrowUpRight
} from 'lucide-react'
import { PLAN_LIMITS } from '@/types'

interface BillingManagerProps {
  user: {
    subscriptionPlan: string
    subscriptionStatus: string | null
    stripeCurrentPeriodEnd: Date | null
    stripeCustomerId: string | null
    charactersUsed: number
    charactersLimit: number
  } | null
  invoices: Array<{
    id: string
    amount: number
    currency: string
    status: string | null
    date: Date
    pdf: string | null
    hostedUrl: string | null
  }>
}

export function BillingManager({ user, invoices }: BillingManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const plan = (user?.subscriptionPlan || 'FREE') as keyof typeof PLAN_LIMITS
  const planInfo = PLAN_LIMITS[plan]

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout', priceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else throw new Error(data.error)
    } catch (err: any) {
      toast.error(err.message || 'Failed to open checkout')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManage = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'portal' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else throw new Error(data.error)
    } catch (err: any) {
      toast.error(err.message || 'Failed to open billing portal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Current plan */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <span className="text-sm font-medium text-white">Current Plan</span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className={`w-4 h-4 ${plan === 'PRO' ? 'text-amber-400' : 'text-white/30'}`} />
                <span className="font-display text-xl text-white">{planInfo.name}</span>
                {user?.subscriptionStatus && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    user.subscriptionStatus === 'ACTIVE' ? 'bg-green-500/15 text-green-400' :
                    'bg-red-500/15 text-red-400'
                  }`}>
                    {user.subscriptionStatus}
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm">
                {planInfo.price === null
                  ? 'Custom pricing'
                  : planInfo.price === 0
                  ? 'Free forever'
                  : `$${planInfo.price}/month`}
              </p>
              {user?.stripeCurrentPeriodEnd && (
                <p className="text-xs text-white/30 mt-1">
                  Renews {format(new Date(user.stripeCurrentPeriodEnd), 'MMMM d, yyyy')}
                </p>
              )}
            </div>

            {plan !== 'FREE' && user?.stripeCustomerId && (
              <button
                onClick={handleManage}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 text-sm transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Manage
              </button>
            )}
          </div>

          {/* Usage bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Characters used this month</span>
              <span>{user?.charactersUsed.toLocaleString()} / {user?.charactersLimit.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ width: `${Math.min(((user?.charactersUsed || 0) / (user?.charactersLimit || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade options */}
      {plan === 'FREE' && (
        <div className="rounded-xl bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display text-white text-lg">Upgrade to Pro</h3>
              <p className="text-white/50 text-sm mt-1">Unlock 50x more characters and API access</p>
            </div>
            <div>
              <span className="text-2xl font-display text-white">$29</span>
              <span className="text-white/40 text-sm">/mo</span>
            </div>
          </div>
          <ul className="space-y-2 mb-5">
            {PLAN_LIMITS.PRO.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '')}
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Upgrade to Pro
              </>
            )}
          </button>
        </div>
      )}

      {/* Invoices */}
      {invoices.length > 0 && (
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-white/40" />
              Invoices
            </span>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm text-white">
                    ${inv.amount.toFixed(2)} {inv.currency.toUpperCase()}
                  </p>
                  <p className="text-xs text-white/40">{format(new Date(inv.date), 'MMM d, yyyy')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    inv.status === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {inv.status}
                  </span>
                  {inv.pdf && (
                    <a
                      href={inv.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
