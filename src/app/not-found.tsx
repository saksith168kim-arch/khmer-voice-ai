import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center px-4">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative text-center">
        <div className="text-8xl font-display gradient-text mb-4">404</div>
        <h1 className="text-2xl font-display text-white mb-3">Page not found</h1>
        <p className="text-white/40 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white text-sm font-medium transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
