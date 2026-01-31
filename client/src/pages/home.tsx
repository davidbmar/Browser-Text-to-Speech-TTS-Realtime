import { useState, useRef, useCallback } from "react";
import * as tts from "@diffusionstudio/vits-web";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Volume2, Play, Square, Download, Mic, Settings2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

type TTSStatus = "idle" | "downloading" | "generating" | "playing";

export default function Home() {
  const [text, setText] = useState("Hello! This is a real-time text to speech demo running entirely in your browser using WebAssembly and ONNX. No server required!");
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [speed, setSpeed] = useState([1.0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSpeak = useCallback(async () => {
    if (!text.trim()) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }

      setStatus("downloading");
      setDownloadProgress(0);

      await tts.download(selectedVoice as any, (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setDownloadProgress(percent);
      });

      setStatus("generating");

      const wav = await tts.predict({
        text: text,
        voiceId: selectedVoice as any,
      });

      const audioUrl = URL.createObjectURL(wav);
      setCurrentAudioUrl(audioUrl);

      const audio = new Audio(audioUrl);
      audio.volume = volume[0] / 100;
      audio.playbackRate = speed[0];
      audioRef.current = audio;

      audio.onended = () => {
        setStatus("idle");
      };

      audio.onerror = () => {
        setStatus("idle");
      };

      setStatus("playing");
      await audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      setStatus("idle");
      toast({
        title: "Speech generation failed",
        description: "There was an error generating speech. Please try again.",
        variant: "destructive",
      });
    }
  }, [text, selectedVoice, volume, speed, currentAudioUrl, toast]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setStatus("idle");
  }, []);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
    }
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number[]) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed[0];
    }
  }, []);

  const isProcessing = status === "downloading" || status === "generating";
  const isPlaying = status === "playing";

  const selectedVoiceInfo = VOICES.find(v => v.id === selectedVoice);

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
            Real-time text-to-speech powered by WebAssembly + ONNX
          </p>
          <p className="text-muted-foreground/70 text-sm mt-1">
            Runs entirely in your browser. Free. No API keys.
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
                disabled={isProcessing || isPlaying}
              />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{text.length} characters</span>
                <span className="text-muted-foreground/50">•</span>
                <span>~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 150)} min read</span>
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
                  disabled={isProcessing || isPlaying}
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                  <Download className="w-4 h-4" />
                  <span>
                    Model: <strong>{selectedVoiceInfo.name}</strong> (~20-50MB, cached after first use)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {(status === "downloading" || status === "generating") && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-medium">
                    {status === "downloading" ? "Downloading voice model..." : "Generating speech..."}
                  </span>
                </div>
                {status === "downloading" && (
                  <div className="space-y-2">
                    <Progress value={downloadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-right">{downloadProgress}%</p>
                  </div>
                )}
                {status === "generating" && (
                  <p className="text-sm text-muted-foreground">
                    Processing text with neural TTS model...
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            {!isPlaying ? (
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
                    {status === "downloading" ? "Downloading..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Speak
                  </>
                )}
              </Button>
            ) : (
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
            )}
          </div>

          <Card className="bg-muted/30 border-muted">
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-3 text-center">
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
