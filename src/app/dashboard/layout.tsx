import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardTopbar } from '@/components/dashboard/topbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#080B14] flex">
      <DashboardSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <DashboardTopbar user={session.user} />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
