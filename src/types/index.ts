import { User, Voice, Generation, ApiKey } from '@prisma/client'

// Re-export Prisma types
export type { User, Voice, Generation, ApiKey }

// Extended types
export type UserWithStats = User & {
  _count: {
    generations: number
    apiKeys: number
  }
}

export type GenerationWithVoice = Generation & {
  voice: Voice
}

export type ApiKeyWithUser = ApiKey & {
  user: Pick<User, 'id' | 'name' | 'email'>
}

// Plan configuration
export const PLAN_LIMITS = {
  FREE: {
    characters: 10_000,
    name: 'Free',
    price: 0,
    priceId: '',
    features: [
      '10,000 characters/month',
      '4 standard voices',
      'MP3 download',
      'Basic Khmer support',
    ],
  },
  PRO: {
    characters: 500_000,
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      '500,000 characters/month',
      'All 10+ voices',
      'MP3 & WAV download',
      'Full Khmer support',
      'API access',
      'Priority generation',
      'Voice cloning (beta)',
    ],
  },
  ENTERPRISE: {
    characters: 999_999_999,
    name: 'Enterprise',
    price: null,
    priceId: '',
    features: [
      'Unlimited characters',
      'Custom voices',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'White-label option',
    ],
  },
} as const

// TTS Request/Response types
export interface TTSRequest {
  text: string
  voiceId: string
  language?: string
  speed?: number
  pitch?: number
  format?: 'mp3' | 'wav'
}

export interface TTSResponse {
  audioUrl: string
  duration: number
  characters: number
  generationId: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard stats
export interface DashboardStats {
  totalGenerations: number
  charactersUsed: number
  charactersLimit: number
  activeApiKeys: number
  recentGenerations: GenerationWithVoice[]
  usageByDay: { date: string; count: number; characters: number }[]
}

// Voice provider abstraction
export interface TTSProvider {
  name: string
  generateSpeech(request: TTSRequest): Promise<Buffer>
  getAvailableVoices(): Promise<ProviderVoice[]>
}

export interface ProviderVoice {
  id: string
  name: string
  language: string
  gender: string
  preview_url?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface TTSFormData {
  text: string
  voiceId: string
  language: string
  speed: number
  pitch: number
  format: 'mp3' | 'wav'
}

// Admin types
export interface AdminStats {
  totalUsers: number
  totalGenerations: number
  totalCharacters: number
  revenue: number
  usersByPlan: { plan: string; count: number }[]
  generationsByDay: { date: string; count: number }[]
  topVoices: { voice: string; count: number }[]
}
