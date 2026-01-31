import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Package, Code, Play, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function QuickStart() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quick Start</h1>
              <p className="text-muted-foreground">Get up and running in 2 minutes</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">No API Keys</Badge>
            <Badge variant="secondary">100% Client-Side</Badge>
            <Badge variant="secondary">Free Forever</Badge>
          </div>
        </header>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                1
              </div>
              <h2 className="text-xl font-semibold">Install the TTS library</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>npm install @diffusionstudio/vits-web</code>
                </pre>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                2
              </div>
              <h2 className="text-xl font-semibold">Copy the hook files</h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  lib/tts-engine.ts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  The core engine that handles sentence splitting, parallel generation, and sequential playback.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm max-h-[300px]">
                  <code>{`import * as tts from "@diffusionstudio/vits-web";

export interface TTSChunk {
  id: number;
  text: string;
  status: "pending" | "generating" | "ready" | "playing" | "done" | "error";
  audio?: Blob;
  audioUrl?: string;
  error?: string;
}

export interface TTSEngineOptions {
  voiceId: string;
  speed?: number;
  volume?: number;
  maxConcurrent?: number;
  skipDownload?: boolean;
  onChunkUpdate?: (chunks: TTSChunk[]) => void;
  onProgress?: (progress: { current: number; total: number; playing: number }) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

// Full implementation available in the source code
export class TTSEngine {
  // ... see Documentation for full API
}

export function createTTSEngine(options: TTSEngineOptions): TTSEngine {
  return new TTSEngine(options);
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  hooks/use-tts.ts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  React hook that wraps the engine with state management.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm max-h-[300px]">
                  <code>{`import { useState, useCallback, useRef, useEffect } from "react";
import { TTSEngine, TTSChunk, createTTSEngine } from "@/lib/tts-engine";
import * as tts from "@diffusionstudio/vits-web";

export interface UseTTSOptions {
  voiceId: string;
  speed?: number;
  volume?: number;
  maxConcurrent?: number;
}

export function useTTS(options: UseTTSOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [chunks, setChunks] = useState<TTSChunk[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, playing: 0 });

  // ... implementation handles model download, 
  // chunk updates, and playback state
  
  return {
    speak, stop, pause, resume,
    setSpeed, setVolume,
    isPlaying, isPaused, isGenerating,
    isDownloading, downloadProgress,
    chunks, progress,
  };
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                3
              </div>
              <h2 className="text-xl font-semibold">Use in your component</h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Basic Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`import { useTTS } from "@/hooks/use-tts";

function TextToSpeechButton() {
  const { speak, stop, isPlaying, isDownloading } = useTTS({
    voiceId: "en_US-hfc_female-medium",
  });

  const handleClick = () => {
    if (isPlaying) {
      stop();
    } else {
      speak("Hello! This text will be converted to speech.");
    }
  };

  return (
    <button onClick={handleClick} disabled={isDownloading}>
      {isDownloading ? "Loading..." : isPlaying ? "Stop" : "Speak"}
    </button>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                4
              </div>
              <h2 className="text-xl font-semibold">Advanced: Show progress</h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  With Streaming Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`import { useTTS } from "@/hooks/use-tts";

function StreamingTTS() {
  const { 
    speak, stop, pause, resume,
    isPlaying, isPaused, isGenerating,
    chunks, progress 
  } = useTTS({
    voiceId: "en_US-hfc_female-medium",
    speed: 1.0,
    volume: 0.8,
    maxConcurrent: 2, // Process 2 sentences at once
  });

  return (
    <div>
      <button onClick={() => speak("First sentence. Second sentence. Third!")}>
        Speak
      </button>
      
      {isPlaying && (
        <div>
          <p>Progress: {progress.current}/{progress.total} ready</p>
          
          {/* Show each sentence's status */}
          {chunks.map((chunk, i) => (
            <div key={chunk.id} style={{ 
              opacity: chunk.status === "done" ? 0.5 : 1,
              fontWeight: chunk.status === "playing" ? "bold" : "normal"
            }}>
              {i + 1}. {chunk.text} [{chunk.status}]
            </div>
          ))}
          
          <button onClick={isPaused ? resume : pause}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button onClick={stop}>Stop</button>
        </div>
      )}
    </div>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              That's it!
            </h2>
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="font-medium">Your TTS is now ready. Here's what happens:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>First use downloads the voice model (~20-50MB, cached in browser)</li>
                    <li>Text is split into sentences automatically</li>
                    <li>Sentences generate in parallel for speed</li>
                    <li>Audio plays as soon as first sentence is ready</li>
                    <li>Works offline after first model download</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex gap-3 pt-4">
            <Link href="/">
              <Button variant="outline" data-testid="button-try-demo">
                Try the Demo
              </Button>
            </Link>
            <Link href="/docs">
              <Button data-testid="button-full-docs">
                Full Documentation
              </Button>
            </Link>
          </div>

          <footer className="text-center text-sm text-muted-foreground pt-8 pb-8">
            <p>
              Built with <strong>Piper TTS</strong> + <strong>ONNX Runtime</strong>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
