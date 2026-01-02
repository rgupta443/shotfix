'use client'

import { Check, Star, Zap } from 'lucide-react'
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
    buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white'
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
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white'
  }
]

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade when you need more. No hidden fees, no complex tiers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl border-2 p-8 bg-white shadow-lg ${
                plan.popular 
                  ? 'border-blue-500 shadow-blue-100' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={plan.ctaLink}
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${plan.buttonStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens to my images?
              </h4>
              <p className="text-gray-600">
                All processing happens in your browser. Images are never uploaded to our servers unless you choose to save them to your account.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can cancel your Pro subscription at any time. You'll continue to have Pro access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                Yes! The Free plan lets you try all features with 3 exports per day. Pro users get a 7-day free trial.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What file formats are supported?
              </h4>
              <p className="text-gray-600">
                We support PNG and JPG input formats. Exports are always high-quality PNG files with transparency support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}