import { useState, useCallback, useRef, useEffect } from "react";
import { TTSEngine, TTSChunk, createTTSEngine } from "@/lib/tts-engine";
import * as tts from "@diffusionstudio/vits-web";

export interface UseTTSOptions {
  voiceId: string;
  speed?: number;
  volume?: number;
  maxConcurrent?: number;
  autoWarmUp?: boolean;
}

export interface UseTTSReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  warmUp: () => Promise<void>;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  isPaused: boolean;
  isGenerating: boolean;
  isDownloading: boolean;
  isWarmingUp: boolean;
  isReady: boolean;
  downloadProgress: number;
  chunks: TTSChunk[];
  currentChunkIndex: number;
  progress: { current: number; total: number; playing: number };
}

const warmedUpVoices = new Set<string>();

export function useTTS(options: UseTTSOptions): UseTTSReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [chunks, setChunks] = useState<TTSChunk[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0, playing: 0 });

  const engineRef = useRef<TTSEngine | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    setIsReady(warmedUpVoices.has(options.voiceId));
  }, [options.voiceId]);

  const warmUp = useCallback(async () => {
    const voiceId = optionsRef.current.voiceId;
    
    if (warmedUpVoices.has(voiceId)) {
      setIsReady(true);
      return;
    }

    try {
      const storedModels = await tts.stored();
      const isModelCached = storedModels.includes(voiceId as any);

      if (!isModelCached) {
        setIsDownloading(true);
        setDownloadProgress(0);
        await tts.download(voiceId as any, (prog) => {
          const percent = Math.round((prog.loaded / prog.total) * 100);
          setDownloadProgress(percent);
        });
        setIsDownloading(false);
      }

      setIsWarmingUp(true);
      
      await tts.predict({
        text: ".",
        voiceId: voiceId as any,
      });

      warmedUpVoices.add(voiceId);
      setIsWarmingUp(false);
      setIsReady(true);
    } catch (error) {
      console.error("Failed to warm up voice model:", error);
      setIsDownloading(false);
      setIsWarmingUp(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoWarmUp) {
      warmUp();
    }
  }, [options.voiceId, options.autoWarmUp, warmUp]);

  const speak = useCallback(async (text: string) => {
    if (engineRef.current) {
      engineRef.current.stop();
    }

    setChunks([]);
    setCurrentChunkIndex(0);
    setProgress({ current: 0, total: 0, playing: 0 });

    if (!warmedUpVoices.has(optionsRef.current.voiceId)) {
      await warmUp();
    }

    setIsPlaying(true);
    setIsGenerating(true);

    const engine = createTTSEngine({
      voiceId: optionsRef.current.voiceId,
      speed: optionsRef.current.speed,
      volume: optionsRef.current.volume,
      maxConcurrent: optionsRef.current.maxConcurrent || 2,
      skipDownload: true,
      onChunkUpdate: (updatedChunks) => {
        setChunks(updatedChunks);
        const playingIdx = updatedChunks.findIndex(c => c.status === "playing");
        if (playingIdx >= 0) {
          setCurrentChunkIndex(playingIdx);
        }
      },
      onProgress: (prog) => {
        setProgress(prog);
        setCurrentChunkIndex(prog.playing);
        if (prog.current === prog.total && prog.total > 0) {
          setIsGenerating(false);
        }
      },
      onComplete: () => {
        setIsPlaying(false);
        setIsGenerating(false);
      },
      onError: (error) => {
        console.error("TTS Error:", error);
      },
    });

    engineRef.current = engine;
    await engine.speak(text);
  }, [warmUp]);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setIsGenerating(false);
    setChunks([]);
    setCurrentChunkIndex(0);
    setProgress({ current: 0, total: 0, playing: 0 });
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    engineRef.current?.resume();
    setIsPaused(false);
  }, []);

  const setSpeed = useCallback((speed: number) => {
    engineRef.current?.setSpeed(speed);
  }, []);

  const setVolume = useCallback((volume: number) => {
    engineRef.current?.setVolume(volume);
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    warmUp,
    setSpeed,
    setVolume,
    isPlaying,
    isPaused,
    isGenerating,
    isDownloading,
    isWarmingUp,
    isReady,
    downloadProgress,
    chunks,
    currentChunkIndex,
    progress,
  };
}
