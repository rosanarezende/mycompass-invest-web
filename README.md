# MyCompass Invest - Web Application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mycompass-invest/mycompass-invest-web)
[![CI](https://github.com/mycompass-invest/mycompass-invest-web/actions/workflows/ci.yml/badge.svg)](https://github.com/mycompass-invest/mycompass-invest-web/actions/workflows/ci.yml)

Modern web application for MyCompass Invest platform built with Next.js 14 and TypeScript.

## Features

- **Modern Stack**: Next.js 14 with App Router and TypeScript
- **Beautiful UI**: Tailwind CSS + shadcn/ui (Radix UI)
- **Authentication**: Firebase Auth integration
- **State Management**: TanStack Query for server state
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized for Core Web Vitals

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mycompass-invest/mycompass-invest-web.git
cd mycompass-invest-web

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

The development server will start on [http://localhost:3000](http://localhost:3000) (or next available port).

## Tech Stack

### 🚀 **Core Framework**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **React 18**: Latest React features

### 🎨 **UI & Styling**  
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality components built on Radix UI
- **Lucide React**: Beautiful SVG icons
- **CSS Variables**: Dynamic theming support

### 🔥 **Backend Integration**
- **Firebase**: Authentication and real-time database
- **TanStack Query**: Server state management
- **API Routes**: Next.js API endpoints

### 🛠️ **Development Tools**
- **ESLint + Prettier**: Code formatting and linting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   ├── features/          # Feature-specific components
│   └── layouts/           # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configs
├── services/              # API services and data fetching
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Infrastructure API
NEXT_PUBLIC_API_URL=http://localhost:5001/mycompass-invest-dev/us-central1
```

## Architecture Integration

This web application integrates with:

- **📦 @mycompass/invest-core**: Core algorithms and business logic
- **☁️ mycompass-invest-infra**: Firebase Functions and cloud services
- **🗄️ Firestore**: Real-time database for portfolio data
- **🔐 Firebase Auth**: User authentication and sessions

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
