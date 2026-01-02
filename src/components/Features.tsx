'use client'

import { 
  Brain, 
  MousePointer, 
  Shield, 
  Shapes, 
  Eye,
  Zap,
  Palette,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Text Detection',
    description: 'Automatically detect and edit text in screenshots with intelligent OCR technology. Click any text to edit it inline.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: MousePointer,
    title: 'UI-Aware Smart Editing',
    description: 'Intelligent alignment guides and spacing suggestions that understand UI patterns for professional-looking edits.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
    iconColor: 'text-purple-600'
  },
  {
    icon: Shield,
    title: 'Privacy & Redaction',
    description: 'Quick blur and redaction tools to hide sensitive information. One-click privacy protection for safe sharing.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    iconColor: 'text-green-600'
  },
  {
    icon: Shapes,
    title: 'Annotation Tools',
    description: 'Add rectangles, arrows, circles, and text annotations with smart styling suggestions and perfect alignment.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    iconColor: 'text-orange-600'
  },
  {
    icon: Eye,
    title: 'Zero Learning Curve',
    description: 'Cursor-first interaction design. No complex tool panels or tutorials needed - just point, click, and edit.',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-50 to-blue-50',
    iconColor: 'text-indigo-600'
  },
  {
    icon: Zap,
    title: '60-Second Workflow',
    description: 'Complete editing workflow from paste to export in under 60 seconds. Optimized for speed and productivity.',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50',
    iconColor: 'text-yellow-600'
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Modern Workflows
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to edit screenshots quickly and professionally, 
            with AI assistance and intelligent design suggestions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-white border border-gray-200/50 hover:border-gray-300/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Hover arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="inline-flex items-center text-sm font-semibold text-blue-600">
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 lg:p-16 overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-6">
                  <Eye className="w-4 h-4 mr-2" />
                  See It In Action
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                  Transform Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Workflow
                  </span>
                </h3>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Watch how ShotFix transforms your screenshot editing workflow with 
                  intelligent AI assistance and intuitive design.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: '📋', text: 'Paste screenshot from clipboard', color: 'from-blue-400 to-cyan-400' },
                    { icon: '🤖', text: 'AI detects text automatically', color: 'from-purple-400 to-pink-400' },
                    { icon: '✏️', text: 'Click to edit, add shapes, or blur', color: 'from-green-400 to-emerald-400' },
                    { icon: '🚀', text: 'Export and share instantly', color: 'from-orange-400 to-red-400' }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center group">
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition-transform duration-200`}>
                        {step.icon}
                      </div>
                      <span className="text-blue-100 font-medium text-lg group-hover:text-white transition-colors duration-200">
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
                    {/* Animated demo elements */}
                    <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-xl animate-pulse"></div>
                    <div className="absolute top-8 left-8 w-24 h-4 bg-white/20 rounded animate-pulse delay-300"></div>
                    <div className="absolute top-14 left-8 w-16 h-3 bg-white/15 rounded animate-pulse delay-500"></div>
                    <div className="absolute bottom-8 right-8 w-20 h-6 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded animate-pulse delay-700"></div>
                    
                    <div className="text-center z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
                        <Palette className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-semibold mb-1">Interactive Demo</p>
                      <p className="text-blue-200 text-sm">Experience the magic</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}