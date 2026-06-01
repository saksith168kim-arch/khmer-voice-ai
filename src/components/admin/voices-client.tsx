'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Edit, ToggleLeft, ToggleRight, Star, StarOff } from 'lucide-react'

const LANG_BADGE: Record<string, string> = {
  KHMER: 'bg-amber-500/15 text-amber-400',
  ENGLISH: 'bg-blue-500/15 text-blue-400',
  BILINGUAL: 'bg-purple-500/15 text-purple-400',
}

export function AdminVoicesClient({ voices: initialVoices }: { voices: any[] }) {
  const [voices, setVoices] = useState(initialVoices)

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/voices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current }),
      })
      if (!res.ok) throw new Error()
      setVoices(prev => prev.map(v => v.id === id ? { ...v, isActive: !current } : v))
      toast.success(`Voice ${!current ? 'enabled' : 'disabled'}`)
    } catch { toast.error('Failed to update voice') }
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/voices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !current }),
      })
      if (!res.ok) throw new Error()
      setVoices(prev => prev.map(v => v.id === id ? { ...v, isFeatured: !current } : v))
      toast.success(`Voice ${!current ? 'featured' : 'unfeatured'}`)
    } catch { toast.error('Failed to update voice') }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => toast.info('Voice creation form coming soon')}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Voice
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/[0.07]">
        <div className="grid grid-cols-12 px-5 py-3 bg-white/[0.02] border-b border-white/[0.07] text-xs text-white/30 font-medium uppercase tracking-wider">
          <div className="col-span-3">Voice</div>
          <div className="col-span-2">Language</div>
          <div className="col-span-2">Gender</div>
          <div className="col-span-2">Provider</div>
          <div className="col-span-1">Uses</div>
          <div className="col-span-2 text-right">Controls</div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {voices.map((voice, i) => (
            <div key={voice.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                  ['from-pink-500 to-rose-500','from-blue-500 to-cyan-500','from-purple-500 to-violet-500',
                   'from-emerald-500 to-teal-500','from-amber-500 to-orange-500'][i % 5]
                } flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {voice.displayName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{voice.displayName}</p>
                  <p className="text-xs text-white/40">{voice.name}</p>
                </div>
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${LANG_BADGE[voice.language] || 'bg-white/5 text-white/40'}`}>
                  {voice.language.charAt(0) + voice.language.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="col-span-2 text-xs text-white/50 capitalize">{voice.gender.toLowerCase()}</div>
              <div className="col-span-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-white/40">{voice.provider}</span>
              </div>
              <div className="col-span-1 text-xs text-white/40">{voice._count.generations.toLocaleString()}</div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => toggleFeatured(voice.id, voice.isFeatured)}
                  className={`p-1.5 rounded-lg transition-all ${voice.isFeatured ? 'text-amber-400 bg-amber-500/10' : 'text-white/25 hover:text-amber-400 hover:bg-amber-500/10'}`}
                  title={voice.isFeatured ? 'Unfeature' : 'Feature'}
                >
                  {voice.isFeatured ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => toggleActive(voice.id, voice.isActive)}
                  className={`transition-colors ${voice.isActive ? 'text-green-400' : 'text-white/25 hover:text-green-400'}`}
                  title={voice.isActive ? 'Disable' : 'Enable'}
                >
                  {voice.isActive
                    ? <ToggleRight className="w-5 h-5" />
                    : <ToggleLeft className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
