import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { VoiceShowcase } from '@/components/landing/voice-showcase'
import { PricingSection } from '@/components/landing/pricing-section'
import { FAQSection } from '@/components/landing/faq-section'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080B14] text-white overflow-x-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[400px] h-[400px] bg-blue-600/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-[300px] h-[300px] bg-cyan-600/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <VoiceShowcase />
          <PricingSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
