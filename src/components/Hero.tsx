'use client'

import { ArrowRight, Zap, Eye, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Screenshot Editing
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Edit screenshots like they were{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              real UI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Fast, intuitive screenshot editing with AI text detection and UI-aware smart editing. 
            Paste, edit, and share in under 60 seconds.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-gray-600">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2 text-blue-500" />
              AI Text Detection
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              Privacy Tools
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-purple-500" />
              60-Second Workflow
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/editor" 
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Try Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/pricing" 
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              View Pricing
            </Link>
          </div>

          {/* Demo Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-sm text-gray-600">ShotFix Editor</div>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-lg font-medium">
                  Interactive Demo Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}