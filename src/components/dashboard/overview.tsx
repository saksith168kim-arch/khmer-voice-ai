'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import {
  Wand2, History, Key, TrendingUp, ArrowRight,
  Zap, BarChart3, AudioLines, Crown
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

interface OverviewData {
  user: {
    charactersUsed: number
    charactersLimit: number
    subscriptionPlan: string
    name: string | null
  } | null
  totalGenerations: number
  activeApiKeys: number
  recentGenerations: Array<{
    id: string
    text: string
    charactersUsed: number
    createdAt: Date
    voice: { displayName: string; language: string }
  }>
  usageByDay: Array<{ date: string; count: number; characters: number }>
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: any
  label: string
  value: string | number
  sub?: string
  color: string
  href?: string
}) {
  const content = (
    <div className={`relative p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 transition-all group ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {href && <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />}
      </div>
      <div className="text-2xl font-display text-white mb-0.5">{value}</div>
      <div className="text-sm text-white/40">{label}</div>
      {sub && <div className="text-xs text-white/25 mt-1">{sub}</div>}
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : content
}

export function DashboardOverview({ data }: { data: OverviewData }) {
  const { user, totalGenerations, activeApiKeys, recentGenerations, usageByDay } = data
  const usagePct = user ? Math.min((user.charactersUsed / user.charactersLimit) * 100, 100) : 0
  const remaining = user ? user.charactersLimit - user.charactersUsed : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">Here's what's happening with your account.</p>
        </div>
        <Link
          href="/dashboard/tts"
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate Speech
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={AudioLines}
          label="Total Generations"
          value={totalGenerations.toLocaleString()}
          color="bg-purple-600"
          href="/dashboard/history"
        />
        <StatCard
          icon={BarChart3}
          label="Characters Used"
          value={user?.charactersUsed.toLocaleString() || '0'}
          sub={`of ${user?.charactersLimit.toLocaleString()} limit`}
          color="bg-blue-600"
        />
        <StatCard
          icon={Key}
          label="Active API Keys"
          value={activeApiKeys}
          color="bg-green-600"
          href="/dashboard/api-keys"
        />
        <StatCard
          icon={Crown}
          label="Current Plan"
          value={user?.subscriptionPlan || 'FREE'}
          sub="Click to upgrade"
          color="bg-amber-600"
          href="/dashboard/billing"
        />
      </div>

      {/* Character usage bar */}
      <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-white">Monthly Character Usage</p>
            <p className="text-xs text-white/40 mt-0.5">
              {user?.charactersUsed.toLocaleString()} of {user?.charactersLimit.toLocaleString()} characters used
            </p>
          </div>
          <span className={`text-sm font-semibold ${usagePct > 80 ? 'text-red-400' : usagePct > 60 ? 'text-amber-400' : 'text-green-400'}`}>
            {usagePct.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              usagePct > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
              usagePct > 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2">{remaining.toLocaleString()} characters remaining this month</p>
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-medium text-white">Generation Activity</p>
              <p className="text-xs text-white/40">Last 7 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-white/30" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={usageByDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent generations */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white">Recent Generations</p>
            <Link href="/dashboard/history" className="text-xs text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentGenerations.length === 0 ? (
              <div className="text-center py-8">
                <AudioLines className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-xs text-white/30">No generations yet</p>
                <Link href="/dashboard/tts" className="text-xs text-purple-400 hover:text-purple-300 mt-1 inline-block">
                  Create your first →
                </Link>
              </div>
            ) : (
              recentGenerations.map((gen) => (
                <div key={gen.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AudioLines className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{gen.text.substring(0, 40)}...</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-purple-400">{gen.voice.displayName}</span>
                      <span className="text-xs text-white/20">•</span>
                      <span className="text-xs text-white/30">{gen.charactersUsed} chars</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Wand2, label: 'Generate Speech', desc: 'Convert text to audio', href: '/dashboard/tts', color: 'from-purple-600 to-blue-600' },
          { icon: History, label: 'View History', desc: 'Browse past generations', href: '/dashboard/history', color: 'from-blue-600 to-cyan-600' },
          { icon: Key, label: 'API Access', desc: 'Manage your API keys', href: '/dashboard/api-keys', color: 'from-green-600 to-emerald-600' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 hover:bg-white/[0.06] transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{action.label}</p>
              <p className="text-xs text-white/40">{action.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
