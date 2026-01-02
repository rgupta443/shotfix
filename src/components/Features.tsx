'use client'

import { 
  Brain, 
  MousePointer, 
  Shield, 
  Shapes, 
  Download, 
  Zap,
  Eye,
  Palette
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Text Detection',
    description: 'Automatically detect and edit text in screenshots with intelligent OCR technology. Click any text to edit it inline.',
    color: 'text-blue-500'
  },
  {
    icon: MousePointer,
    title: 'UI-Aware Smart Editing',
    description: 'Intelligent alignment guides and spacing suggestions that understand UI patterns for professional-looking edits.',
    color: 'text-purple-500'
  },
  {
    icon: Shield,
    title: 'Privacy & Redaction',
    description: 'Quick blur and redaction tools to hide sensitive information. One-click privacy protection for safe sharing.',
    color: 'text-green-500'
  },
  {
    icon: Shapes,
    title: 'Annotation Tools',
    description: 'Add rectangles, arrows, circles, and text annotations with smart styling suggestions and perfect alignment.',
    color: 'text-orange-500'
  },
  {
    icon: Eye,
    title: 'Zero Learning Curve',
    description: 'Cursor-first interaction design. No complex tool panels or tutorials needed - just point, click, and edit.',
    color: 'text-indigo-500'
  },
  {
    icon: Zap,
    title: '60-Second Workflow',
    description: 'Complete editing workflow from paste to export in under 60 seconds. Optimized for speed and productivity.',
    color: 'text-yellow-500'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Workflows
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to edit screenshots quickly and professionally, 
            with AI assistance and intelligent design suggestions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 bg-white"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  See It In Action
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Watch how ShotFix transforms your screenshot editing workflow with 
                  intelligent AI assistance and intuitive design.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Paste screenshot from clipboard
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    AI detects text automatically
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Click to edit, add shapes, or blur
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Export and share instantly
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Interactive Demo</p>
                    <p className="text-gray-400 text-sm">Coming Soon</p>
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