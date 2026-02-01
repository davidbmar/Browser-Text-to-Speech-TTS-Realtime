# Setup Guide

## Prerequisites

- Node.js 20+ (currently using v23.9.0)
- npm 11+ (currently using v11.2.0)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### 3. Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot-reloading
- `npm run build` - Build for production (client + server)
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes (if using PostgreSQL)

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (optional - defaults to in-memory storage)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Development Notes

### Cross-Origin Isolation

The server automatically sets required headers for WebAssembly multi-threading:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These headers enable the TTS engine to use multiple CPU cores for faster processing.

### Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript (ESM)
- **TTS Engine**: `@diffusionstudio/vits-web` (WebAssembly-based, runs in browser)
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui (Radix UI primitives)

### Project Structure

```
.
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui)
│   │   ├── hooks/        # React hooks (use-tts.ts)
│   │   ├── lib/          # Core libraries (tts-engine.ts)
│   │   ├── pages/        # Page components
│   │   └── main.tsx      # Entry point
│   └── index.html
├── server/          # Express backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Storage interface
│   └── vite.ts      # Vite dev server integration
├── shared/          # Shared types and schemas
└── script/          # Build scripts
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, change the `PORT` environment variable:

```bash
PORT=3000 npm run dev
```

### TypeScript Errors

Run type checking to see all errors:

```bash
npm run check
```

### WebAssembly Issues

Ensure your browser supports:
- WebAssembly
- SharedArrayBuffer (requires cross-origin isolation headers)
- Web Audio API

Supported browsers:
- Chrome/Edge 92+
- Firefox 95+
- Safari 15.2+
