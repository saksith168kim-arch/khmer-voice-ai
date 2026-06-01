import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user as any

  if (!session || user?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#060810] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:pl-60">
        <header className="sticky top-0 z-30 bg-[#060810]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-red-500/15 text-red-400 border border-red-500/20">
                ADMIN
              </span>
              <span className="text-white/40 text-sm">Control Panel</span>
            </div>
            <Link href="/dashboard" className="text-xs text-white/40 hover:text-white transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
