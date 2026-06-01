'use client'

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { AudioLines, Languages } from 'lucide-react'

const LANG_COLORS: Record<string, string> = {
  en: '#3b82f6',
  km: '#f59e0b',
  KHMER: '#f59e0b',
  ENGLISH: '#3b82f6',
  BILINGUAL: '#a855f7',
  unknown: '#6b7280',
}

interface AnalyticsData {
  dailyStats: { date: string; generations: number; characters: number }[]
  topVoices: { name: string; language: string; count: number; characters: number }[]
  langDistribution: { language: string; count: number }[]
}

export function AdminAnalyticsClient({ data }: { data: AnalyticsData }) {
  const totalGenerations = data.dailyStats.reduce((s, d) => s + d.generations, 0)
  const totalChars = data.dailyStats.reduce((s, d) => s + d.characters, 0)
  const peakDay = [...data.dailyStats].sort((a, b) => b.generations - a.generations)[0]

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: '30-Day Generations', value: totalGenerations.toLocaleString(), sub: 'Total API calls' },
          { label: '30-Day Characters', value: totalChars > 1_000_000 ? `${(totalChars/1_000_000).toFixed(2)}M` : totalChars.toLocaleString(), sub: 'Characters processed' },
          { label: 'Peak Day', value: peakDay?.generations || 0, sub: peakDay?.date || '—' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-2xl font-display text-white">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
            <p className="text-sm text-white/40 mt-0.5">{s.label}</p>
            <p className="text-xs text-white/25 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Daily trends */}
      <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-sm font-medium text-white mb-5">Daily Generation Trends — Last 30 Days</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data.dailyStats}>
            <defs>
              <linearGradient id="gGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }} />
            <Area type="monotone" dataKey="generations" stroke="#a855f7" strokeWidth={2} fill="url(#gGrad)" name="Generations" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top voices */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-5">
            <AudioLines className="w-4 h-4 text-purple-400" />
            <p className="text-sm font-medium text-white">Top Voices</p>
          </div>
          <div className="space-y-3">
            {data.topVoices.slice(0, 8).map((v, i) => {
              const maxCount = data.topVoices[0]?.count || 1
              const pct = (v.count / maxCount) * 100
              return (
                <div key={v.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30 w-4">{i + 1}</span>
                      <span className="text-sm text-white">{v.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        v.language === 'KHMER' ? 'bg-amber-500/15 text-amber-400' :
                        v.language === 'ENGLISH' ? 'bg-blue-500/15 text-blue-400' :
                        'bg-purple-500/15 text-purple-400'
                      }`}>
                        {v.language.charAt(0) + v.language.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <span className="text-xs text-white/40">{v.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: v.language === 'KHMER' ? '#f59e0b' : v.language === 'ENGLISH' ? '#3b82f6' : '#a855f7'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Language distribution */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-5">
            <Languages className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-medium text-white">Language Distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.langDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="language"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Generations">
                {data.langDistribution.map((entry, i) => (
                  <rect key={i} fill={LANG_COLORS[entry.language] || '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
