# Browser TTS - Real-time Text to Speech

## Overview

A browser-based text-to-speech application that runs entirely client-side using WebAssembly and ONNX. The app allows users to convert text to speech with multiple voice options without requiring any API keys or server-side processing for the TTS functionality.

**Key Feature**: Streaming TTS with sentence-by-sentence playback - audio starts playing as soon as the first sentence is ready while the rest continues generating in the background.

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

### TTS Library Architecture
- **TTSEngine** (`client/src/lib/tts-engine.ts`): Core TTS engine with:
  - Sentence splitting for chunked playback
  - Parallel generation queue (configurable concurrency)
  - Sequential audio playback
  - Pause/resume/stop controls
  - Memory-safe URL management
  
- **useTTS Hook** (`client/src/hooks/use-tts.ts`): React hook wrapper providing:
  - Simple API: `speak()`, `stop()`, `pause()`, `resume()`, `warmUp()`
  - State: `isPlaying`, `isPaused`, `isGenerating`, `isDownloading`, `isWarmingUp`, `isReady`
  - Auto warm-up option for instant playback on page load
  - Progress tracking with chunk status visualization
  - Real-time speed/volume adjustment

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

2. **Streaming Playback**: Text is split into sentences and processed in parallel. Audio starts playing as soon as the first sentence is ready, reducing perceived latency.

3. **Auto Warm-Up**: Models are pre-loaded and initialized when a voice is selected, so playback starts instantly when the user clicks Speak.

4. **Multi-Core Processing**: Cross-origin isolation headers enable WASM threads for parallel TTS generation across CPU cores.

3. **Monorepo Structure**: 
   - `client/` - React frontend
   - `server/` - Express backend
   - `shared/` - Shared types and schemas (Drizzle schema, Zod validation)

4. **Storage Interface Pattern**: `IStorage` interface in `server/storage.ts` allows easy swapping between in-memory and database implementations

5. **API Pattern**: All API routes prefixed with `/api`, static files served from `dist/public` in production

## External Dependencies

### Database
- PostgreSQL (via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- `connect-pg-simple` for session storage capability

### Key Libraries
- **TTS Engine**: `@diffusionstudio/vits-web` - WebAssembly-based text-to-speech using Piper/VITS models
- **UI Components**: Full shadcn/ui suite with Radix UI primitives
- **Form Handling**: React Hook Form with Zod resolvers
- **Date Handling**: date-fns

### Available Voices
- en_US-hfc_female-medium (HFC Female US)
- en_US-hfc_male-medium (HFC Male US)
- en_US-libritts_r-medium (LibriTTS US)
- en_GB-alba-medium (Alba UK)
- en_GB-aru-medium (Aru UK)
- de_DE-thorsten-medium (Thorsten - German)
- fr_FR-siwis-medium (Siwis - French)
- es_ES-davefx-medium (DaveFX - Spanish)

### Development Tools
- Replit-specific plugins for Vite (runtime error overlay, cartographer, dev banner)
- TypeScript with strict mode enabled

## Usage Example

```tsx
import { useTTS } from "@/hooks/use-tts";

function MyComponent() {
  const { speak, stop, isPlaying, chunks, progress } = useTTS({
    voiceId: "en_US-hfc_female-medium",
    speed: 1.0,
    volume: 0.8,
  });

  return (
    <div>
      <button onClick={() => speak("Hello world! This is a test.")}>
        Speak
      </button>
      <button onClick={stop}>Stop</button>
      <p>Progress: {progress.current}/{progress.total} sentences ready</p>
    </div>
  );
}
```
