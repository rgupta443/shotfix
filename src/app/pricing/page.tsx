import Pricing from '@/components/Pricing'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
          >
            ← Back to Home
          </a>
        </div>
      </div>
      <Pricing />
    </div>
  )
}