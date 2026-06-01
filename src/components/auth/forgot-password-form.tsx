'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, CheckCircle2 } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call — in production connect to email service
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-white font-medium mb-2">Check your email</p>
        <p className="text-white/50 text-sm">
          We sent reset instructions to <strong className="text-white/70">{email}</strong>
        </p>
        <p className="text-white/30 text-xs mt-4">Didn't receive it? Check your spam folder.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-purple-500/60 transition-all"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || !email}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center"
      >
        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
      </button>
    </form>
  )
}
