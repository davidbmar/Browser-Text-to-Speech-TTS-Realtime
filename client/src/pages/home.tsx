import { useState, useCallback, useEffect } from "react";
import * as tts from "@diffusionstudio/vits-web";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play, Square, Download, Mic, Settings2, Loader2, Check, Pause, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTTS } from "@/hooks/use-tts";

interface Voice {
  id: string;
  name: string;
  language: string;
}

const VOICES: Voice[] = [
  { id: "en_US-hfc_female-medium", name: "HFC Female (US)", language: "English" },
  { id: "en_US-hfc_male-medium", name: "HFC Male (US)", language: "English" },
  { id: "en_US-libritts_r-medium", name: "LibriTTS (US)", language: "English" },
  { id: "en_GB-alba-medium", name: "Alba (UK)", language: "English" },
  { id: "en_GB-aru-medium", name: "Aru (UK)", language: "English" },
  { id: "de_DE-thorsten-medium", name: "Thorsten", language: "German" },
  { id: "fr_FR-siwis-medium", name: "Siwis", language: "French" },
  { id: "es_ES-davefx-medium", name: "DaveFX", language: "Spanish" },
];

export default function Home() {
  const [text, setText] = useState("Hello! This is a real-time text to speech demo. It runs entirely in your browser using WebAssembly and ONNX. No server required! Each sentence is processed separately for faster playback.");
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [volume, setVolume] = useState([80]);
  const [speed, setSpeed] = useState([1.0]);
  const [cachedVoices, setCachedVoices] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const {
    speak,
    stop,
    pause,
    resume,
    setSpeed: setTTSSpeed,
    setVolume: setTTSVolume,
    isPlaying,
    isPaused,
    isGenerating,
    isDownloading,
    downloadProgress,
    chunks,
    currentChunkIndex,
    progress,
  } = useTTS({
    voiceId: selectedVoice,
    speed: speed[0],
    volume: volume[0] / 100,
    maxConcurrent: 2,
  });

  const handleSpeak = useCallback(async () => {
    if (!text.trim()) return;

    try {
      await speak(text);
      if (!cachedVoices.has(selectedVoice)) {
        setCachedVoices(prev => {
          const newSet = new Set(prev);
          newSet.add(selectedVoice);
          return newSet;
        });
      }
    } catch (error) {
      console.error("TTS Error:", error);
      toast({
        title: "Speech generation failed",
        description: "There was an error generating speech. Please try again.",
        variant: "destructive",
      });
    }
  }, [text, selectedVoice, speak, cachedVoices, toast]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    setVolume(newVolume);
    setTTSVolume(newVolume[0] / 100);
  }, [setTTSVolume]);

  const handleSpeedChange = useCallback((newSpeed: number[]) => {
    setSpeed(newSpeed);
    setTTSSpeed(newSpeed[0]);
  }, [setTTSSpeed]);

  const isProcessing = isDownloading || (isGenerating && chunks.length === 0);
  const isActive = isPlaying || isGenerating;

  const selectedVoiceInfo = VOICES.find(v => v.id === selectedVoice);

  const getChunkStatusColor = (status: string) => {
    switch (status) {
      case "done": return "bg-green-500";
      case "playing": return "bg-primary animate-pulse";
      case "ready": return "bg-blue-500";
      case "generating": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Mic className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Browser TTS
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time streaming text-to-speech with sentence chunking
          </p>
          <p className="text-muted-foreground/70 text-sm mt-1">
            Starts playing as soon as the first sentence is ready
          </p>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Volume2 className="w-5 h-5" />
                Text to Speak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                data-testid="input-text"
                placeholder="Enter the text you want to convert to speech..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[140px] text-base resize-none"
                disabled={isActive}
              />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{text.length} characters</span>
                <span className="text-muted-foreground/50">•</span>
                <span>~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 150)} min read</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{text.split(/[.!?]+/).filter(s => s.trim()).length} sentences</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings2 className="w-5 h-5" />
                Voice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice</label>
                <Select
                  value={selectedVoice}
                  onValueChange={setSelectedVoice}
                  disabled={isActive}
                >
                  <SelectTrigger data-testid="select-voice">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id} data-testid={`voice-option-${voice.id}`}>
                        <span className="flex items-center gap-2">
                          <span>{voice.name}</span>
                          <span className="text-muted-foreground text-xs">({voice.language})</span>
                          {cachedVoices.has(voice.id) && (
                            <Check className="w-3 h-3 text-green-500" />
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed: {speed[0].toFixed(1)}x</label>
                  <Slider
                    data-testid="slider-speed"
                    value={speed}
                    onValueChange={handleSpeedChange}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5x</span>
                    <span>1x</span>
                    <span>2x</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume: {volume[0]}%</label>
                  <Slider
                    data-testid="slider-volume"
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {selectedVoiceInfo && (
                <div className={`flex items-center gap-2 text-sm rounded-md px-3 py-2 ${
                  cachedVoices.has(selectedVoice) 
                    ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                    : "bg-muted/50 text-muted-foreground"
                }`}>
                  {cachedVoices.has(selectedVoice) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>
                    Model: <strong>{selectedVoiceInfo.name}</strong>
                    {cachedVoices.has(selectedVoice) 
                      ? " (cached - ready to use)" 
                      : " (~20-50MB, downloads on first use)"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {isDownloading && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-medium">Downloading voice model...</span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-right">{downloadProgress}%</p>
              </CardContent>
            </Card>
          )}

          {chunks.length > 0 && (
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <SkipForward className="w-4 h-4" />
                    Streaming Progress
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {progress.current}/{progress.total} ready
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-1 flex-wrap">
                  {chunks.map((chunk, index) => (
                    <div
                      key={chunk.id}
                      className={`h-2 flex-1 min-w-[20px] rounded-full transition-colors ${getChunkStatusColor(chunk.status)}`}
                      title={`Sentence ${index + 1}: ${chunk.status}`}
                    />
                  ))}
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {chunks.map((chunk, index) => (
                    <div 
                      key={chunk.id}
                      className={`flex items-start gap-2 p-2 rounded-md text-sm transition-colors ${
                        chunk.status === "playing" 
                          ? "bg-primary/10 border border-primary/30" 
                          : chunk.status === "done"
                          ? "bg-muted/30 text-muted-foreground"
                          : "bg-muted/10"
                      }`}
                    >
                      <Badge 
                        variant={chunk.status === "playing" ? "default" : "secondary"}
                        className="shrink-0 text-xs"
                      >
                        {index + 1}
                      </Badge>
                      <span className={chunk.status === "playing" ? "font-medium" : ""}>
                        {chunk.text}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`ml-auto shrink-0 text-xs ${
                          chunk.status === "done" ? "text-green-600 border-green-600" :
                          chunk.status === "playing" ? "text-primary border-primary" :
                          chunk.status === "ready" ? "text-blue-600 border-blue-600" :
                          chunk.status === "generating" ? "text-yellow-600 border-yellow-600" :
                          ""
                        }`}
                      >
                        {chunk.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            {!isActive ? (
              <Button
                data-testid="button-speak"
                onClick={handleSpeak}
                disabled={isProcessing || !text.trim()}
                size="lg"
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Speak
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  data-testid="button-pause"
                  onClick={handlePauseResume}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  data-testid="button-stop"
                  onClick={handleStop}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>

          <Card className="bg-muted/30 border-muted">
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">Streaming</div>
                  <div className="text-sm text-muted-foreground">Sentence-by-Sentence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Client-Side</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Free</div>
                  <div className="text-sm text-muted-foreground">No API Keys</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Offline</div>
                  <div className="text-sm text-muted-foreground">After Download</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <footer className="text-center text-sm text-muted-foreground pt-4 pb-8">
            <p>
              Powered by <strong>Piper TTS</strong> + <strong>ONNX Runtime</strong> via WebAssembly
            </p>
            <p className="mt-1">
              Models from <a href="https://github.com/rhasspy/piper" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">rhasspy/piper</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
