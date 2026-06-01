'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, Star, Building2, ArrowRight } from 'lucide-react'
import { PLAN_LIMITS } from '@/types'

const plans = [
  {
    key: 'FREE' as const,
    icon: Zap,
    badge: null,
    description: 'Perfect for trying out Khmer Voice AI',
    color: 'border-white/10',
    buttonVariant: 'secondary' as const,
    buttonText: 'Start Free',
    href: '/register',
  },
  {
    key: 'PRO' as const,
    icon: Star,
    badge: 'Most Popular',
    description: 'For creators and professionals',
    color: 'border-purple-500/50',
    buttonVariant: 'primary' as const,
    buttonText: 'Start Pro Trial',
    href: '/register?plan=pro',
  },
  {
    key: 'ENTERPRISE' as const,
    icon: Building2,
    badge: null,
    description: 'For teams and organizations',
    color: 'border-white/10',
    buttonVariant: 'secondary' as const,
    buttonText: 'Contact Sales',
    href: '/contact',
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-4">
            <Star className="w-3 h-3 text-purple-400" />
            PRICING
          </div>
          <h2 className="text-4xl sm:text-5xl font-display text-white mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">
            Start free, scale as you grow. No surprises.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-white/40'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isYearly ? 'bg-purple-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  isYearly ? 'left-7' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-white/40'}`}>
              Yearly{' '}
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                -20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const limits = PLAN_LIMITS[plan.key]
            const price = isYearly && limits.price
              ? Math.floor(limits.price * 0.8)
              : limits.price

            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl p-7 border ${plan.color} ${
                  plan.badge
                    ? 'bg-gradient-to-b from-purple-900/20 to-[#0D1117]'
                    : 'bg-white/[0.03]'
                } transition-all duration-300 hover:-translate-y-1`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 rounded-full text-xs text-white font-semibold whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    plan.badge ? 'bg-purple-600' : 'bg-white/10'
                  }`}>
                    <plan.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display text-white text-lg">{limits.name}</span>
                </div>

                <div className="mb-4">
                  {price === null ? (
                    <div className="text-3xl font-display text-white">Custom</div>
                  ) : price === 0 ? (
                    <div className="text-3xl font-display text-white">Free</div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-display text-white">${price}</span>
                      <span className="text-white/40 text-sm mb-1">/month</span>
                    </div>
                  )}
                  <p className="text-sm text-white/40 mt-1">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {limits.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-white/60">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.badge ? 'text-purple-400' : 'text-white/40'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-white/30 mt-8">
          All plans include SSL security, automatic backups, and 24/7 infrastructure monitoring.
        </p>
      </div>
    </section>
  )
}
