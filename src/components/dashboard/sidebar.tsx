'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Mic2,
  Library,
  History,
  Key,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Wand2,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/dashboard/tts', icon: Wand2, label: 'Text to Speech' },
  { href: '/dashboard/voices', icon: Library, label: 'Voice Library' },
  { href: '/dashboard/history', icon: History, label: 'History' },
  { href: '/dashboard/api-keys', icon: Key, label: 'API Keys' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0B0F1A] border-r border-white/[0.06] flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" />
            </svg>
          </div>
          <span className="font-display text-white text-base">
            Khmer<span className="text-purple-400">Voice</span><span className="text-blue-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-purple-400' : 'group-hover:text-white/80'}`}
              />
              {item.label}
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-purple-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group mb-1">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ''}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user.name || 'User'}</p>
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
