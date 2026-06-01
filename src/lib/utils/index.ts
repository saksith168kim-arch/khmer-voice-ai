import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatCharacters(chars: number): string {
  if (chars >= 1_000_000) return `${(chars / 1_000_000).toFixed(1)}M`
  if (chars >= 1_000) return `${(chars / 1_000).toFixed(1)}K`
  return chars.toString()
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.substring(0, max) + '...' : str
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.split(' ')
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase()
  }
  return email ? email[0].toUpperCase() : 'U'
}

export function planBadgeColor(plan: string): string {
  switch (plan) {
    case 'PRO': return 'bg-purple-500/15 text-purple-400 border-purple-500/20'
    case 'ENTERPRISE': return 'bg-amber-500/15 text-amber-400 border-amber-500/20'
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/15'
  }
}

export function languageBadgeColor(lang: string): string {
  switch (lang.toUpperCase()) {
    case 'KHMER': return 'bg-amber-500/15 text-amber-400 border-amber-500/20'
    case 'ENGLISH': return 'bg-blue-500/15 text-blue-400 border-blue-500/20'
    case 'BILINGUAL': return 'bg-purple-500/15 text-purple-400 border-purple-500/20'
    default: return 'bg-white/5 text-white/40 border-white/10'
  }
}
