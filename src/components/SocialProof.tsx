'use client'

import { Star, Users, Zap, Heart } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    company: 'TechCorp',
    content: 'ShotFix has completely transformed how I create design documentation. The AI text detection is incredibly accurate, and I can edit screenshots in seconds instead of minutes.',
    avatar: 'SC'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Developer',
    company: 'StartupXYZ',
    content: 'As a developer, I need to quickly edit screenshots for bug reports and documentation. ShotFix makes it effortless - paste, edit, done. The UI-aware editing is brilliant.',
    avatar: 'MR'
  },
  {
    name: 'Emily Johnson',
    role: 'Marketing Manager',
    company: 'GrowthCo',
    content: 'The privacy tools are a game-changer for our team. We can quickly blur sensitive information before sharing screenshots with clients. So much faster than Photoshop.',
    avatar: 'EJ'
  }
]

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    color: 'text-blue-500'
  },
  {
    icon: Zap,
    value: '50K+',
    label: 'Screenshots Edited',
    color: 'text-purple-500'
  },
  {
    icon: Heart,
    value: '4.9/5',
    label: 'User Rating',
    color: 'text-red-500'
  }
]

export default function SocialProof() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Professionals
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join the growing community of designers, developers, and teams who use ShotFix 
            to streamline their screenshot editing workflow.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200"
            >
              {/* Stars */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Transform Your Screenshot Workflow?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who save hours every week with ShotFix's 
              AI-powered screenshot editing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/editor"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Start Editing Now
                <Zap className="ml-2 w-5 h-5" />
              </a>
              <a 
                href="/pricing"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}