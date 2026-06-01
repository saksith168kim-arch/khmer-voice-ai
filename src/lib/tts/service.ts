import { TTSRequest, TTSProvider, ProviderVoice } from '@/types'

// ==========================================
// ElevenLabs Provider
// ==========================================
class ElevenLabsProvider implements TTSProvider {
  name = 'elevenlabs'
  private apiKey: string
  private baseUrl = 'https://api.elevenlabs.io/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateSpeech(request: TTSRequest): Promise<Buffer> {
    const voiceSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
    }

    const response = await fetch(`${this.baseUrl}/text-to-speech/${request.voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: request.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voiceSettings,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ElevenLabs API error: ${response.status} - ${error}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  async getAvailableVoices(): Promise<ProviderVoice[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: { 'xi-api-key': this.apiKey },
    })

    if (!response.ok) throw new Error('Failed to fetch ElevenLabs voices')

    const data = await response.json()
    return data.voices.map((v: any) => ({
      id: v.voice_id,
      name: v.name,
      language: 'English',
      gender: 'unknown',
      preview_url: v.preview_url,
    }))
  }
}

// ==========================================
// Azure Speech Provider
// ==========================================
class AzureSpeechProvider implements TTSProvider {
  name = 'azure'
  private apiKey: string
  private region: string

  constructor(apiKey: string, region: string) {
    this.apiKey = apiKey
    this.region = region
  }

  async generateSpeech(request: TTSRequest): Promise<Buffer> {
    const endpoint = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`

    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${request.voiceId}">
          <prosody rate="${request.speed || 1}" pitch="${request.pitch ? request.pitch > 1 ? '+' + ((request.pitch - 1) * 50) + 'Hz' : '-' + ((1 - request.pitch) * 50) + 'Hz' : '+0Hz'}">
            ${request.text}
          </prosody>
        </voice>
      </speak>
    `

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: ssml,
    })

    if (!response.ok) {
      throw new Error(`Azure TTS error: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  async getAvailableVoices(): Promise<ProviderVoice[]> {
    const response = await fetch(
      `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/voices/list`,
      {
        headers: { 'Ocp-Apim-Subscription-Key': this.apiKey },
      }
    )

    if (!response.ok) throw new Error('Failed to fetch Azure voices')
    const voices = await response.json()

    return voices.map((v: any) => ({
      id: v.ShortName,
      name: v.DisplayName,
      language: v.Locale,
      gender: v.Gender,
    }))
  }
}

// ==========================================
// Google Cloud TTS Provider
// ==========================================
class GoogleTTSProvider implements TTSProvider {
  name = 'google'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateSpeech(request: TTSRequest): Promise<Buffer> {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: request.text },
          voice: {
            languageCode: request.language || 'en-US',
            name: request.voiceId,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: request.speed || 1.0,
            pitch: request.pitch ? (request.pitch - 1) * 10 : 0,
          },
        }),
      }
    )

    if (!response.ok) throw new Error(`Google TTS error: ${response.status}`)

    const data = await response.json()
    return Buffer.from(data.audioContent, 'base64')
  }

  async getAvailableVoices(): Promise<ProviderVoice[]> {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?key=${this.apiKey}`
    )
    if (!response.ok) throw new Error('Failed to fetch Google voices')

    const data = await response.json()
    return data.voices.map((v: any) => ({
      id: v.name,
      name: v.name,
      language: v.languageCodes[0],
      gender: v.ssmlGender,
    }))
  }
}

// ==========================================
// Kiri TTS Provider (Custom Khmer Model)
// ==========================================
class KiriTTSProvider implements TTSProvider {
  name = 'kiritts'
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async generateSpeech(request: TTSRequest): Promise<Buffer> {
    const response = await fetch(`${this.baseUrl}/api/tts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        text: request.text,
        voice_id: request.voiceId,
        speed: request.speed || 1.0,
        pitch: request.pitch || 1.0,
        format: request.format || 'mp3',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Kiri TTS error: ${response.status} - ${error}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  async getAvailableVoices(): Promise<ProviderVoice[]> {
    const response = await fetch(`${this.baseUrl}/api/voices`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    })

    if (!response.ok) throw new Error('Failed to fetch Kiri TTS voices')

    const data = await response.json()
    return data.voices
  }
}

// ==========================================
// Mock Provider (for development/demo)
// ==========================================
class MockTTSProvider implements TTSProvider {
  name = 'mock'

  async generateSpeech(request: TTSRequest): Promise<Buffer> {
    // Return a minimal valid MP3 buffer for development
    // In production, this would be replaced with a real provider
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

    // Minimal MP3 header bytes (silent audio)
    const silentMp3 = Buffer.from([
      0xff, 0xfb, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00,
    ])
    return silentMp3
  }

  async getAvailableVoices(): Promise<ProviderVoice[]> {
    return []
  }
}

// ==========================================
// TTS Service Factory
// ==========================================
export class TTSService {
  private providers: Map<string, TTSProvider> = new Map()
  private defaultProvider: string

  constructor() {
    this.defaultProvider = process.env.DEFAULT_TTS_PROVIDER || 'mock'

    // Register providers based on available API keys
    if (process.env.ELEVENLABS_API_KEY) {
      this.providers.set('elevenlabs', new ElevenLabsProvider(process.env.ELEVENLABS_API_KEY))
    }

    if (process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) {
      this.providers.set(
        'azure',
        new AzureSpeechProvider(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION)
      )
    }

    if (process.env.GOOGLE_CLOUD_TTS_KEY) {
      this.providers.set('google', new GoogleTTSProvider(process.env.GOOGLE_CLOUD_TTS_KEY))
    }

    if (process.env.KIRI_TTS_API_KEY && process.env.KIRI_TTS_API_URL) {
      this.providers.set(
        'kiritts',
        new KiriTTSProvider(process.env.KIRI_TTS_API_KEY, process.env.KIRI_TTS_API_URL)
      )
    }

    // Always register mock as fallback
    this.providers.set('mock', new MockTTSProvider())
  }

  getProvider(name?: string): TTSProvider {
    const providerName = name || this.defaultProvider
    const provider = this.providers.get(providerName)

    if (!provider) {
      console.warn(`Provider ${providerName} not found, falling back to mock`)
      return this.providers.get('mock')!
    }

    return provider
  }

  async generateSpeech(
    request: TTSRequest,
    providerName?: string
  ): Promise<{ buffer: Buffer; provider: string }> {
    const provider = this.getProvider(providerName)

    try {
      const buffer = await provider.generateSpeech(request)
      return { buffer, provider: provider.name }
    } catch (error) {
      console.error(`Provider ${provider.name} failed:`, error)

      // Fallback to mock in development
      if (process.env.NODE_ENV === 'development') {
        const mockProvider = this.providers.get('mock')!
        const buffer = await mockProvider.generateSpeech(request)
        return { buffer, provider: 'mock' }
      }

      throw error
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}

// Singleton instance
export const ttsService = new TTSService()
