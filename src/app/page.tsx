import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import SocialProof from '@/components/SocialProof'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <SocialProof />
      <Pricing />
    </main>
  )
}