# Browser TTS - Real-time Text to Speech

## Overview

A browser-based text-to-speech application that runs entirely client-side using WebAssembly and ONNX. The app allows users to convert text to speech with multiple voice options without requiring any API keys or server-side processing for the TTS functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom development server integration
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Component Pattern**: Path aliases configured (`@/` for client/src, `@shared/` for shared)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Build**: Custom esbuild script for production bundling with dependency allowlisting
- **Development**: tsx for TypeScript execution, Vite dev server integration with HMR

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with migrations output to `./migrations`
- **Current Storage**: In-memory storage implementation (`MemStorage` class) as default, designed to be swapped for database storage

### Key Design Decisions

1. **Client-Side TTS Processing**: Uses `@diffusionstudio/vits-web` for browser-based text-to-speech via WebAssembly/ONNX, eliminating server dependency for core functionality

2. **Monorepo Structure**: 
   - `client/` - React frontend
   - `server/` - Express backend
   - `shared/` - Shared types and schemas (Drizzle schema, Zod validation)

3. **Storage Interface Pattern**: `IStorage` interface in `server/storage.ts` allows easy swapping between in-memory and database implementations

4. **API Pattern**: All API routes prefixed with `/api`, static files served from `dist/public` in production

## External Dependencies

### Database
- PostgreSQL (via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- `connect-pg-simple` for session storage capability

### Key Libraries
- **TTS Engine**: `@diffusionstudio/vits-web` - WebAssembly-based text-to-speech
- **UI Components**: Full shadcn/ui suite with Radix UI primitives
- **Form Handling**: React Hook Form with Zod resolvers
- **Date Handling**: date-fns

### Development Tools
- Replit-specific plugins for Vite (runtime error overlay, cartographer, dev banner)
- TypeScript with strict mode enabled