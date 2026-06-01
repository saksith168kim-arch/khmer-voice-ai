'use client'

import { Bell, Search, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

interface TopbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function DashboardTopbar({ user }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-[#080B14]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu + search */}
        <div className="flex items-center gap-3 flex-1">
          <button className="lg:hidden text-white/50 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative hidden sm:flex items-center max-w-xs w-full">
            <Search className="absolute left-3 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button className="relative w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-500 rounded-full" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold ml-1">
            {user.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
