'use client'

import {
  Mic2,
  Globe2,
  Zap,
  Download,
  Code2,
  Shield,
  AudioLines,
  Languages,
} from 'lucide-react'

const features = [
  {
    icon: AudioLines,
    title: 'Natural-Sounding AI Voices',
    description: 'State-of-the-art neural TTS models produce lifelike speech indistinguishable from human narration.',
    color: 'from-purple-500 to-purple-700',
    glow: 'purple',
  },
  {
    icon: Languages,
    title: 'Native Khmer Support',
    description: 'Purpose-built Khmer language models with correct pronunciation, tone, and natural rhythm.',
    color: 'from-amber-500 to-orange-600',
    glow: 'amber',
  },
  {
    icon: Globe2,
    title: 'Multi-Language',
    description: 'Support for English, Khmer, and bilingual content in a single generation workflow.',
    color: 'from-blue-500 to-blue-700',
    glow: 'blue',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-second latency for real-time generation. Generate 5,000 characters in under 3 seconds.',
    color: 'from-yellow-500 to-orange-500',
    glow: 'yellow',
  },
  {
    icon: Download,
    title: 'Download MP3 & WAV',
    description: 'Export studio-quality audio in multiple formats. Perfect for podcasts, e-learning, and production.',
    color: 'from-green-500 to-emerald-600',
    glow: 'green',
  },
  {
    icon: Code2,
    title: 'Developer API',
    description: 'RESTful API with SDKs for JavaScript, Python, and PHP. Integrate TTS into your app in minutes.',
    color: 'from-pink-500 to-rose-600',
    glow: 'pink',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-4">
            <Zap className="w-3 h-3 text-purple-400" />
            CAPABILITIES
          </div>
          <h2 className="text-4xl sm:text-5xl font-display text-white mb-4">
            Everything you need to{' '}
            <span className="gradient-text">go vocal</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Professional-grade text-to-speech infrastructure built for Khmer language from the ground up.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="relative group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient icon */}
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-white font-semibold text-lg mb-2 font-display">
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover accent line */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-40 transition-opacity`}
              />
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10+', label: 'AI Voices' },
            { value: '2', label: 'Languages' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '<1s', label: 'Generation Speed' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-white/[0.03] border border-white/[0.07]"
            >
              <div className="text-3xl font-display gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
