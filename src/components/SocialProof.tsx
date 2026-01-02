'use client'

import { Star, Users, Zap, Heart, Quote, ArrowRight, Sparkles } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    company: 'TechCorp',
    content: 'ShotFix has completely transformed how I create design documentation. The AI text detection is incredibly accurate, and I can edit screenshots in seconds instead of minutes.',
    avatar: 'SC',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Developer',
    company: 'StartupXYZ',
    content: 'As a developer, I need to quickly edit screenshots for bug reports and documentation. ShotFix makes it effortless - paste, edit, done. The UI-aware editing is brilliant.',
    avatar: 'MR',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Emily Johnson',
    role: 'Marketing Manager',
    company: 'GrowthCo',
    content: 'The privacy tools are a game-changer for our team. We can quickly blur sensitive information before sharing screenshots with clients. So much faster than Photoshop.',
    avatar: 'EJ',
    gradient: 'from-green-500 to-emerald-500'
  }
]

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    color: 'from-blue-500 to-cyan-500',
    description: 'Professionals trust ShotFix'
  },
  {
    icon: Zap,
    value: '50K+',
    label: 'Screenshots Edited',
    color: 'from-purple-500 to-pink-500',
    description: 'And counting every day'
  },
  {
    icon: Heart,
    value: '4.9/5',
    label: 'User Rating',
    color: 'from-red-500 to-pink-500',
    description: 'Based on 500+ reviews'
  }
]

export default function SocialProof() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-sm font-semibold mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Loved by Thousands
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Trusted by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Professionals
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Join the growing community of designers, developers, and teams who use ShotFix 
            to streamline their screenshot editing workflow.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="relative p-8 rounded-3xl bg-white border border-gray-200/50 hover:border-gray-300/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl lg:text-5xl font-black text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-lg font-bold text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              What Our Users Say
            </h3>
            <p className="text-lg text-gray-600">
              Real feedback from real professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 hover:border-gray-300/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-12 h-12 text-gray-400" />
                </div>

                {/* Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-8 leading-relaxed text-lg font-medium group-hover:text-gray-800 transition-colors duration-300">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg group-hover:text-gray-800 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 lg:p-16 overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Ready to Get Started?
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                Transform Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Screenshot Workflow
                </span>
              </h3>
              <p className="text-xl text-blue-100 mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Join thousands of professionals who save hours every week with ShotFix's 
                AI-powered screenshot editing. Start free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="/editor"
                  className="group inline-flex items-center px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
                >
                  Start Editing Now
                  <Zap className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                </a>
                <a 
                  href="/pricing"
                  className="group inline-flex items-center px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg"
                >
                  View Pricing
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}