import { useState, useCallback, useRef, useEffect } from "react";
import { TTSEngine, TTSChunk, createTTSEngine } from "@/lib/tts-engine";
import * as tts from "@diffusionstudio/vits-web";

export interface UseTTSOptions {
  voiceId: string;
  speed?: number;
  volume?: number;
  maxConcurrent?: number;
}

export interface UseTTSReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  isPaused: boolean;
  isGenerating: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  chunks: TTSChunk[];
  currentChunkIndex: number;
  progress: { current: number; total: number; playing: number };
}

export function useTTS(options: UseTTSOptions): UseTTSReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [chunks, setChunks] = useState<TTSChunk[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0, playing: 0 });

  const engineRef = useRef<TTSEngine | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const speak = useCallback(async (text: string) => {
    if (engineRef.current) {
      engineRef.current.stop();
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setChunks([]);
    setCurrentChunkIndex(0);
    setProgress({ current: 0, total: 0, playing: 0 });

    try {
      await tts.download(optionsRef.current.voiceId as any, (prog) => {
        const percent = Math.round((prog.loaded / prog.total) * 100);
        setDownloadProgress(percent);
      });
    } catch (error) {
      console.error("Failed to download voice model:", error);
      setIsDownloading(false);
      return;
    }

    setIsDownloading(false);
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
  }, []);

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
    setSpeed,
    setVolume,
    isPlaying,
    isPaused,
    isGenerating,
    isDownloading,
    downloadProgress,
    chunks,
    currentChunkIndex,
    progress,
  };
}
