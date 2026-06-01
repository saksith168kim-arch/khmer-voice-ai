'use client'

import { format } from 'date-fns'
import {
  Users, AudioLines, Key, BarChart3,
  TrendingUp, Crown, Zap, Building2
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const PLAN_COLORS: Record<string, string> = {
  FREE: '#6b7280',
  PRO: '#a855f7',
  ENTERPRISE: '#f59e0b',
}

const PLAN_ICONS: Record<string, any> = {
  FREE: Zap,
  PRO: Crown,
  ENTERPRISE: Building2,
}

interface AdminStats {
  totalUsers: number
  totalGenerations: number
  totalApiKeys: number
  totalCharacters: number
  usersByPlan: { plan: string; count: number }[]
  recentUsers: any[]
  recentGenerations: any[]
  dailyStats: { date: string; generations: number; characters: number }[]
}

function StatCard({ icon: Icon, label, value, color, sub }: any) {
  return (
    <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="text-2xl font-display text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-sm text-white/40 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-white/25 mt-1">{sub}</div>}
    </div>
  )
}

export function AdminOverviewClient({ stats }: { stats: AdminStats }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display text-white">Admin Overview</h1>
        <p className="text-white/40 text-sm mt-1">Platform-wide statistics and management</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-600" />
        <StatCard icon={AudioLines} label="Total Generations" value={stats.totalGenerations} color="bg-purple-600" />
        <StatCard icon={Key} label="Active API Keys" value={stats.totalApiKeys} color="bg-green-600" />
        <StatCard
          icon={BarChart3}
          label="Characters Processed"
          value={stats.totalCharacters > 1_000_000 ? `${(stats.totalCharacters / 1_000_000).toFixed(1)}M` : stats.totalCharacters.toLocaleString()}
          color="bg-amber-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily generations chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-medium text-white">Daily Generations</p>
              <p className="text-xs text-white/40">Last 14 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-white/30" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.dailyStats}>
              <defs>
                <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="generations" stroke="#a855f7" strokeWidth={2} fill="url(#genGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan distribution */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-sm font-medium text-white mb-5">Users by Plan</p>
          <div className="space-y-3">
            {stats.usersByPlan.map((p) => {
              const Icon = PLAN_ICONS[p.plan] || Zap
              const pct = stats.totalUsers > 0 ? (p.count / stats.totalUsers) * 100 : 0
              return (
                <div key={p.plan}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: PLAN_COLORS[p.plan] }} />
                      <span className="text-xs text-white/60">{p.plan}</span>
                    </div>
                    <span className="text-xs text-white/40">{p.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: PLAN_COLORS[p.plan] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-white/30 text-center">{stats.totalUsers} total users</p>
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <p className="text-sm font-medium text-white">Recent Users</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{user.name || 'No name'}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: `${PLAN_COLORS[user.subscriptionPlan]}20`,
                      color: PLAN_COLORS[user.subscriptionPlan],
                    }}
                  >
                    {user.subscriptionPlan}
                  </span>
                  <p className="text-xs text-white/25 mt-0.5">{format(new Date(user.createdAt), 'MMM d')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent generations */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <p className="text-sm font-medium text-white">Recent Generations</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {stats.recentGenerations.map((gen) => (
              <div key={gen.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-7 h-7 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <AudioLines className="w-3 h-3 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{gen.text.substring(0, 35)}...</p>
                  <p className="text-xs text-white/40">{gen.user?.name || gen.user?.email} · {gen.voice?.displayName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-white/40">{gen.charactersUsed} chars</p>
                  <p className="text-xs text-white/25">{format(new Date(gen.createdAt), 'MMM d')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
