import { useState, useEffect, useCallback } from 'react'

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

// Copy to clipboard hook
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      return true
    } catch {
      return false
    }
  }, [])

  return { isCopied, copy }
}

// Audio player hook
export function useAudioPlayer(src: string | null) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audio] = useState(() => (typeof Audio !== 'undefined' ? new Audio() : null))

  useEffect(() => {
    if (!audio || !src) return
    audio.src = src
    audio.onloadedmetadata = () => setDuration(audio.duration)
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime)
    audio.onended = () => setIsPlaying(false)
    return () => { audio.pause(); audio.src = '' }
  }, [audio, src])

  const toggle = useCallback(() => {
    if (!audio || !src) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play(); setIsPlaying(true) }
  }, [audio, src, isPlaying])

  const seek = useCallback((time: number) => {
    if (!audio) return
    audio.currentTime = time
  }, [audio])

  return { isPlaying, duration, currentTime, toggle, seek }
}

// API fetch hook
export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (body?: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        ...options,
        body: body ? JSON.stringify(body) : options?.body,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Request failed')
      setData(json.data)
      return json
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return { data, loading, error, execute }
}
