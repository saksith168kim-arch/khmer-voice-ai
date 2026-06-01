'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, AudioLines, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#080B14]/90 backdrop-blur-xl border-b border-white/5 py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-display text-white text-lg tracking-tight">
              Khmer<span className="text-purple-400">Voice</span>
              <span className="text-blue-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors font-medium px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="relative text-sm font-semibold px-5 py-2.5 rounded-lg overflow-hidden group"
            >
              <span className="relative z-10 text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Get Started Free
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:from-purple-500 group-hover:to-blue-500 transition-all" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-3">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-white/70 hover:text-white py-2 text-sm font-medium"
                onClick={() => setIsMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                className="text-center py-2.5 text-sm text-white/70 border border-white/10 rounded-lg hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
