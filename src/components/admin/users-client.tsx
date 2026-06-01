'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Search, Shield, Crown, Zap, Building2, MoreHorizontal, Ban, ChevronUp, ChevronDown } from 'lucide-react'

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-gray-500/15 text-gray-400',
  PRO: 'bg-purple-500/15 text-purple-400',
  ENTERPRISE: 'bg-amber-500/15 text-amber-400',
}

type SortKey = 'name' | 'createdAt' | 'charactersUsed' | 'subscriptionPlan'

export function AdminUsersClient({ users: initialUsers }: { users: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase()
      return (u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (planFilter === 'All' || u.subscriptionPlan === planFilter)
    })
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (sortKey === 'createdAt') { av = new Date(av).getTime(); bv = new Date(bv).getTime() }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })

  const handleChangePlan = async (userId: string, plan: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionPlan: plan }),
      })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscriptionPlan: plan } : u))
      toast.success('Plan updated')
    } catch { toast.error('Failed to update plan') }
    setOpenMenu(null)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/40"
          />
        </div>
        {['All', 'FREE', 'PRO', 'ENTERPRISE'].map(p => (
          <button
            key={p}
            onClick={() => setPlanFilter(p)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${planFilter === p ? 'bg-white text-black' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/30">{filtered.length} users</p>

      <div className="rounded-xl overflow-hidden border border-white/[0.07]">
        {/* Header */}
        <div className="grid grid-cols-12 px-5 py-3 bg-white/[0.02] border-b border-white/[0.07] text-xs text-white/30 font-medium uppercase tracking-wider">
          <button className="col-span-3 text-left flex items-center gap-1 hover:text-white/60" onClick={() => handleSort('name')}>
            User <SortIcon k="name" />
          </button>
          <button className="col-span-2 text-left flex items-center gap-1 hover:text-white/60" onClick={() => handleSort('subscriptionPlan')}>
            Plan <SortIcon k="subscriptionPlan" />
          </button>
          <button className="col-span-2 text-left flex items-center gap-1 hover:text-white/60" onClick={() => handleSort('charactersUsed')}>
            Usage <SortIcon k="charactersUsed" />
          </button>
          <div className="col-span-2">Generations</div>
          <button className="col-span-2 text-left flex items-center gap-1 hover:text-white/60" onClick={() => handleSort('createdAt')}>
            Joined <SortIcon k="createdAt" />
          </button>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {filtered.map(user => (
            <div key={user.id} className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{user.name || '—'}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${PLAN_COLORS[user.subscriptionPlan]}`}>
                  {user.subscriptionPlan}
                </span>
                {user.role === 'admin' && (
                  <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">admin</span>
                )}
              </div>
              <div className="col-span-2">
                <p className="text-xs text-white/60">{user.charactersUsed.toLocaleString()}</p>
                <div className="mt-1 h-1 bg-white/[0.06] rounded-full w-16 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${Math.min((user.charactersUsed / (user.charactersLimit || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="col-span-2 text-xs text-white/50">{user._count.generations.toLocaleString()}</div>
              <div className="col-span-2 text-xs text-white/40">{format(new Date(user.createdAt), 'MMM d, yyyy')}</div>
              <div className="col-span-1 flex justify-end">
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {openMenu === user.id && (
                    <div className="absolute right-0 top-8 z-20 w-44 rounded-xl bg-[#0D1117] border border-white/[0.1] shadow-2xl overflow-hidden">
                      <div className="p-1 space-y-0.5">
                        <p className="px-3 py-1.5 text-xs text-white/30 font-medium uppercase tracking-wider">Change Plan</p>
                        {['FREE', 'PRO', 'ENTERPRISE'].map(plan => (
                          <button
                            key={plan}
                            onClick={() => handleChangePlan(user.id, plan)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${user.subscriptionPlan === plan ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:bg-white/[0.05] hover:text-white'}`}
                          >
                            {plan}
                            {user.subscriptionPlan === plan && ' ✓'}
                          </button>
                        ))}
                        <div className="h-px bg-white/[0.06] my-1" />
                        <button
                          onClick={() => { toast.info('Ban feature coming soon'); setOpenMenu(null) }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        >
                          <Ban className="w-3 h-3" /> Suspend User
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">No users found</div>
        )}
      </div>
    </div>
  )
}
