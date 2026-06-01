import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center px-4">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" />
              </svg>
            </div>
            <span className="font-display text-white text-xl">
              Khmer<span className="text-purple-400">Voice</span><span className="text-blue-400">AI</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-display text-white">Reset password</h1>
            <p className="text-white/40 text-sm mt-1">
              Enter your email and we'll send you reset instructions
            </p>
          </div>
          <ForgotPasswordForm />
          <p className="text-center text-sm text-white/40 mt-5">
            Remember your password?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
