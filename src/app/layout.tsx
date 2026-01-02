import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShotFix - Edit Screenshots Like Real UI',
  description: 'Fast, intuitive screenshot editing with AI-assisted text detection and UI-aware editing capabilities. Paste, edit, and share in under 60 seconds.',
  keywords: ['screenshot', 'editor', 'AI', 'text detection', 'UI editing', 'image editing'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}