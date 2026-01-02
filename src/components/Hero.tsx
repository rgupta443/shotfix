'use client'

import { ArrowRight, Zap, Eye, Shield, Sparkles, Play } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Floating badge with animation */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 text-blue-700 text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            AI-Powered Screenshot Editing
            <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Main Headline with enhanced typography */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight text-gray-900 mb-8 leading-tight">
            Edit screenshots like they were{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              real UI
            </span>
          </h1>

          {/* Enhanced subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Fast, intuitive screenshot editing with{' '}
            <span className="text-blue-600 font-semibold">AI text detection</span> and{' '}
            <span className="text-purple-600 font-semibold">UI-aware smart editing</span>. 
            <br className="hidden sm:block" />
            Paste, edit, and share in under{' '}
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-bold text-lg">
              60 seconds
            </span>
          </p>

          {/* Enhanced feature highlights */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              <Eye className="w-5 h-5 mr-3 text-blue-500" />
              <span className="text-gray-700 font-medium">AI Text Detection</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200/50 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              <Shield className="w-5 h-5 mr-3 text-green-500" />
              <span className="text-gray-700 font-medium">Privacy Tools</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              <Zap className="w-5 h-5 mr-3 text-purple-500" />
              <span className="text-gray-700 font-medium">60-Second Workflow</span>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              href="/editor" 
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
            >
              <span className="relative flex items-center">
                Try Free Now
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Link>
            <button className="group inline-flex items-center px-8 py-5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg">
              <Play className="mr-3 w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              Watch Demo
            </button>
          </div>

          {/* Enhanced Demo Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Main container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                {/* Browser chrome */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                      </div>
                      <div className="bg-white px-4 py-1 rounded-lg text-sm text-gray-600 font-medium border border-gray-200">
                        shotfix.com/editor
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">ShotFix Editor</div>
                  </div>
                </div>
                
                {/* Demo content */}
                <div className="aspect-video bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
                  {/* Animated elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl animate-pulse"></div>
                  </div>
                  <div className="absolute top-8 left-8 w-24 h-6 bg-white/60 rounded-lg animate-pulse delay-300"></div>
                  <div className="absolute top-16 left-8 w-16 h-4 bg-white/40 rounded animate-pulse delay-500"></div>
                  <div className="absolute bottom-8 right-8 w-20 h-8 bg-blue-500/30 rounded-lg animate-pulse delay-700"></div>
                  
                  <div className="text-center z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-4 border border-gray-200/50">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                    <p className="text-gray-600 text-lg font-semibold mb-2">Interactive Demo</p>
                    <p className="text-gray-500 text-sm">Experience the magic of AI-powered editing</p>
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