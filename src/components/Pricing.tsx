'use client'

import { Check, Star, Zap, Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out ShotFix',
    features: [
      '3 exports per day',
      'AI text detection',
      'Basic annotation tools',
      'Privacy & blur tools',
      'Watermarked exports',
      'Community support'
    ],
    cta: 'Get Started Free',
    ctaLink: '/editor',
    popular: false,
    buttonStyle: 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white shadow-xl hover:shadow-2xl',
    cardStyle: 'border-gray-200 bg-white'
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For professionals and teams',
    features: [
      'Unlimited exports',
      'No watermarks',
      'Advanced UI-aware editing',
      'Priority processing',
      'Export history & cloud sync',
      'Priority email support',
      'Custom export formats',
      'Team collaboration (coming soon)'
    ],
    cta: 'Start Pro Trial',
    ctaLink: '/signup?plan=pro',
    popular: true,
    buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl',
    cardStyle: 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50'
  }
]

export default function Pricing() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl transform -translate-x-1/2"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl transform translate-x-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade when you need more. No hidden fees, no complex tiers.
            Just powerful screenshot editing at your fingertips.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-3xl border-2 p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${plan.cardStyle} ${
                plan.popular ? 'transform scale-105 lg:scale-110' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold shadow-lg">
                    <Crown className="w-4 h-4 mr-2" />
                    Most Popular
                    <div className="ml-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-3xl font-black text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="ml-3 p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <span className="text-5xl lg:text-6xl font-black text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2 text-lg">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 text-lg">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-5 mb-10">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={plan.ctaLink}
                className={`block w-full text-center px-8 py-5 rounded-2xl font-bold transition-all duration-300 hover:scale-105 text-lg ${plan.buttonStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/50 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need to know about ShotFix
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "What happens to my images?",
                answer: "All processing happens in your browser. Images are never uploaded to our servers unless you choose to save them to your account."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your Pro subscription at any time. You'll continue to have Pro access until the end of your billing period."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! The Free plan lets you try all features with 3 exports per day. Pro users get a 7-day free trial."
              },
              {
                question: "What file formats are supported?",
                answer: "We support PNG and JPG input formats. Exports are always high-quality PNG files with transparency support."
              }
            ].map((faq, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 hover:border-gray-300/50 hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors duration-200">
                  {faq.question}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}