import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Code, Settings, Volume2, Mic, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
              <p className="text-muted-foreground">Browser TTS API Reference</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            A simple, free, and fast text-to-speech library that runs entirely in the browser.
            No API keys required.
          </p>
          <div className="flex gap-2 mt-4">
            <Link href="/quickstart">
              <Button data-testid="button-quickstart">
                <Zap className="w-4 h-4 mr-2" />
                Quick Start Guide
              </Button>
            </Link>
          </div>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Mic className="w-6 h-6" />
              Overview
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p>
                  Browser TTS provides streaming text-to-speech powered by Piper TTS models running
                  via WebAssembly/ONNX. Key features:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Streaming playback</strong> - Audio starts as soon as the first sentence is ready</li>
                  <li><strong>Parallel generation</strong> - Multiple sentences process simultaneously</li>
                  <li><strong>8 voices</strong> - English, German, French, and Spanish options</li>
                  <li><strong>No server required</strong> - Everything runs client-side</li>
                  <li><strong>Offline capable</strong> - Models cached in browser storage</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Code className="w-6 h-6" />
              useTTS Hook
            </h2>
            <p className="text-muted-foreground mb-4">
              The primary way to use Browser TTS in React applications.
            </p>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Import</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`import { useTTS } from "@/hooks/use-tts";`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="font-mono shrink-0">voiceId</Badge>
                      <div>
                        <p className="font-medium">string (required)</p>
                        <p className="text-sm text-muted-foreground">Voice model ID to use</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="font-mono shrink-0">speed</Badge>
                      <div>
                        <p className="font-medium">number (default: 1.0)</p>
                        <p className="text-sm text-muted-foreground">Playback speed (0.5 to 2.0)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="font-mono shrink-0">volume</Badge>
                      <div>
                        <p className="font-medium">number (default: 0.8)</p>
                        <p className="text-sm text-muted-foreground">Volume level (0 to 1)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="font-mono shrink-0">maxConcurrent</Badge>
                      <div>
                        <p className="font-medium">number (default: 2)</p>
                        <p className="text-sm text-muted-foreground">Max parallel sentence generation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Return Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium">Methods</h4>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Badge className="font-mono shrink-0">speak(text)</Badge>
                      <span className="text-muted-foreground">Start speaking the given text</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="font-mono shrink-0">stop()</Badge>
                      <span className="text-muted-foreground">Stop all playback and generation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="font-mono shrink-0">pause()</Badge>
                      <span className="text-muted-foreground">Pause current playback</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="font-mono shrink-0">resume()</Badge>
                      <span className="text-muted-foreground">Resume paused playback</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="font-mono shrink-0">setSpeed(n)</Badge>
                      <span className="text-muted-foreground">Change speed during playback</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="font-mono shrink-0">setVolume(n)</Badge>
                      <span className="text-muted-foreground">Change volume during playback</span>
                    </div>
                  </div>

                  <Separator />

                  <h4 className="font-medium">State</h4>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="font-mono shrink-0">isPlaying</Badge>
                      <span className="text-muted-foreground">boolean - Currently playing audio</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="font-mono shrink-0">isPaused</Badge>
                      <span className="text-muted-foreground">boolean - Playback is paused</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="font-mono shrink-0">isGenerating</Badge>
                      <span className="text-muted-foreground">boolean - Generating audio chunks</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="font-mono shrink-0">isDownloading</Badge>
                      <span className="text-muted-foreground">boolean - Downloading voice model</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="font-mono shrink-0">downloadProgress</Badge>
                      <span className="text-muted-foreground">number - Download progress (0-100)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="font-mono shrink-0">chunks</Badge>
                      <span className="text-muted-foreground">TTSChunk[] - Array of sentence chunks with status</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="font-mono shrink-0">progress</Badge>
                      <span className="text-muted-foreground">{`{ current, total, playing }`} - Generation progress</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Volume2 className="w-6 h-6" />
              Available Voices
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { id: "en_US-hfc_female-medium", name: "HFC Female", lang: "English (US)" },
                    { id: "en_US-hfc_male-medium", name: "HFC Male", lang: "English (US)" },
                    { id: "en_US-libritts_r-medium", name: "LibriTTS", lang: "English (US)" },
                    { id: "en_GB-alba-medium", name: "Alba", lang: "English (UK)" },
                    { id: "en_GB-aru-medium", name: "Aru", lang: "English (UK)" },
                    { id: "de_DE-thorsten-medium", name: "Thorsten", lang: "German" },
                    { id: "fr_FR-siwis-medium", name: "Siwis", lang: "French" },
                    { id: "es_ES-davefx-medium", name: "DaveFX", lang: "Spanish" },
                  ].map((voice) => (
                    <div key={voice.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                      <div>
                        <p className="font-medium">{voice.name}</p>
                        <p className="text-sm text-muted-foreground">{voice.lang}</p>
                      </div>
                      <code className="text-xs bg-background px-2 py-1 rounded">{voice.id}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              TTSEngine Class
            </h2>
            <p className="text-muted-foreground mb-4">
              For advanced use cases, you can use the TTSEngine class directly.
            </p>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Direct Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`import { createTTSEngine } from "@/lib/tts-engine";

const engine = createTTSEngine({
  voiceId: "en_US-hfc_female-medium",
  speed: 1.0,
  volume: 0.8,
  maxConcurrent: 2,
  onChunkUpdate: (chunks) => {
    console.log("Chunks updated:", chunks);
  },
  onProgress: (progress) => {
    console.log(\`\${progress.current}/\${progress.total} ready\`);
  },
  onComplete: () => {
    console.log("Playback complete");
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});

// Start speaking
await engine.speak("Hello world! This is a test.");

// Control playback
engine.pause();
engine.resume();
engine.setSpeed(1.5);
engine.setVolume(0.5);
engine.stop();`}</code>
                </pre>
              </CardContent>
            </Card>
          </section>

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
