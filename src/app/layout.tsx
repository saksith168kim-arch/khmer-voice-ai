import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  title: {
    default: 'Khmer Voice AI — Convert Text to Natural Speech',
    template: '%s | Khmer Voice AI',
  },
  description:
    'Generate realistic AI voices in Khmer and English. Advanced text-to-speech technology with natural-sounding Khmer language support.',
  keywords: [
    'Khmer TTS',
    'Khmer text to speech',
    'AI voice generator',
    'Cambodian AI',
    'speech synthesis',
    'voice AI',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://khmervoiceai.com',
    title: 'Khmer Voice AI',
    description: 'Generate natural AI voices in Khmer and English',
    siteName: 'Khmer Voice AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khmer Voice AI',
    description: 'Generate natural AI voices in Khmer and English',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: 'var(--font-inter)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
