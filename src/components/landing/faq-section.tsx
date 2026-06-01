'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'What languages does Khmer Voice AI support?',
    a: 'Khmer Voice AI supports Khmer (ភាសាខ្មែរ) and English, with bilingual voices that can handle content mixing both languages naturally.',
  },
  {
    q: 'How accurate is the Khmer pronunciation?',
    a: 'Our Khmer TTS model is purpose-built and trained on native Cambodian speech data. It handles complex Khmer script including subscript consonants, dependent vowels, and proper tonal patterns.',
  },
  {
    q: 'Can I use the generated audio commercially?',
    a: 'Yes! All plans include commercial usage rights for generated audio. You can use it in videos, podcasts, e-learning courses, apps, and any other commercial projects.',
  },
  {
    q: 'What audio formats are available for download?',
    a: 'Free users can download MP3. Pro and Enterprise users can download both MP3 and WAV (lossless, ideal for production work).',
  },
  {
    q: 'Is there an API I can use?',
    a: 'Yes. Pro and Enterprise plans include full API access with SDKs for JavaScript, Python, and PHP. Documentation with code examples is available in your dashboard.',
  },
  {
    q: 'What happens if I exceed my character limit?',
    a: 'Free users will need to upgrade to continue generating. Pro users on monthly plans get their characters reset each billing cycle.',
  },
  {
    q: 'Can I try Pro features before paying?',
    a: 'Yes, you can start a free trial with your Pro subscription. No credit card required for the free plan.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-4">
            <HelpCircle className="w-3 h-3 text-purple-400" />
            FAQ
          </div>
          <h2 className="text-4xl font-display text-white mb-4">
            Common <span className="gradient-text">questions</span>
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.07] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-white font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/[0.05]">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
