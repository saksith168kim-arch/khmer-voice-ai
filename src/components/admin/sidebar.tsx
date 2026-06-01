'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Mic2, BarChart3,
  CreditCard, Settings, Shield
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/voices', icon: Mic2, label: 'Voices' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#08090F] border-r border-white/[0.05] flex flex-col z-40 hidden lg:flex">
      <div className="p-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          <span className="font-display text-white">Admin Panel</span>
        </div>
        <p className="text-xs text-white/30 mt-1">Khmer Voice AI</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-red-500/10 text-red-300 border border-red-500/15'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-red-400' : ''}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
