'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { User, Mail, Shield, Bell, Trash2 } from 'lucide-react'

export function SettingsForm({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // In production: call PATCH /api/user
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Settings saved!')
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      {/* Profile */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">Profile</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Display Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Email</label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full bg-white/[0.02] border border-white/[0.07] rounded-lg px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
            />
            <p className="text-xs text-white/25 mt-1">Email cannot be changed</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">Security</span>
        </div>
        <div className="p-5 space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] transition-colors">
            <div className="text-left">
              <p className="text-sm text-white font-medium">Change Password</p>
              <p className="text-xs text-white/40 mt-0.5">Update your account password</p>
            </div>
            <span className="text-xs text-purple-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] transition-colors">
            <div className="text-left">
              <p className="text-sm text-white font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-white/40 mt-0.5">Add extra security to your account</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-white/40">Coming soon</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl bg-red-500/5 border border-red-500/15 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-500/10 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-red-400">Danger Zone</span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white font-medium">Delete Account</p>
              <p className="text-xs text-white/40 mt-0.5">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
