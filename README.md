# ShotFix - Screenshot Editor

A web application that enables fast, intuitive editing of screenshots with AI-assisted text detection and UI-aware editing capabilities. Edit screenshots like they were real UI - paste, edit, and share in under 60 seconds.

## Features

- **AI-Powered Text Detection**: Automatically detect and edit text in screenshots
- **UI-Aware Smart Editing**: Intelligent alignment guides and spacing suggestions
- **Privacy Tools**: Quick blur and redaction tools for sensitive information
- **Annotation Tools**: Add shapes, arrows, and highlights
- **Zero Learning Curve**: Cursor-first interaction without complex tool panels
- **Fast Workflow**: Complete editing workflow in under 60 seconds

## Tech Stack

- **Frontend**: Next.js 15+ with App Router, TypeScript, Tailwind CSS
- **Canvas**: Konva.js for high-performance 2D graphics
- **OCR**: Tesseract.js for client-side text detection
- **Authentication**: NextAuth.js with magic links and Google OAuth
- **Storage**: Cloudflare R2 for image storage
- **Image Processing**: Sharp for server-side image optimization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rgupta443/shotfix.git
cd shotfix
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration values.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── public/              # Static assets
└── api/                 # API routes
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Usage

1. **Upload or Paste**: Drag and drop an image or paste from clipboard
2. **Edit Text**: Click on detected text to edit inline
3. **Add Annotations**: Use tools to add shapes, arrows, and highlights
4. **Apply Privacy**: Use blur tools to hide sensitive information
5. **Export**: Download your edited screenshot

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@shotfix.com or open an issue on GitHub.