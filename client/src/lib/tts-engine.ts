import * as tts from "@diffusionstudio/vits-web";

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

export interface TTSEngineState {
  isPlaying: boolean;
  isPaused: boolean;
  isGenerating: boolean;
  chunks: TTSChunk[];
  currentChunkIndex: number;
  progress: { current: number; total: number; playing: number };
}

function splitIntoSentences(text: string): string[] {
  const sentenceRegex = /[^.!?]*[.!?]+["']?\s*/g;
  const sentences: string[] = [];
  let match;
  let lastIndex = 0;

  while ((match = sentenceRegex.exec(text)) !== null) {
    sentences.push(match[0].trim());
    lastIndex = sentenceRegex.lastIndex;
  }

  const remaining = text.slice(lastIndex).trim();
  if (remaining) {
    sentences.push(remaining);
  }

  return sentences.filter(s => s.length > 0);
}

export class TTSEngine {
  private chunks: TTSChunk[] = [];
  private currentAudio: HTMLAudioElement | null = null;
  private currentChunkIndex = 0;
  private isPlaying = false;
  private isPaused = false;
  private isGenerating = false;
  private aborted = false;
  private options: TTSEngineOptions;
  private activeGenerations = 0;
  private generationQueue: number[] = [];
  private playbackPromiseResolve: (() => void) | null = null;

  constructor(options: TTSEngineOptions) {
    this.options = {
      speed: 1.0,
      volume: 0.8,
      maxConcurrent: 2,
      skipDownload: false,
      ...options,
    };
  }

  private notifyChunkUpdate() {
    this.options.onChunkUpdate?.(this.chunks.map(c => ({ ...c })));
  }

  private notifyProgress() {
    const ready = this.chunks.filter(c => 
      c.status === "ready" || c.status === "playing" || c.status === "done"
    ).length;
    this.options.onProgress?.({
      current: ready,
      total: this.chunks.length,
      playing: this.currentChunkIndex,
    });
  }

  private revokeAllAudioUrls() {
    for (const chunk of this.chunks) {
      if (chunk.audioUrl) {
        URL.revokeObjectURL(chunk.audioUrl);
        chunk.audioUrl = undefined;
      }
    }
  }

  async speak(text: string): Promise<void> {
    this.stop();

    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) return;

    this.chunks = sentences.map((sentence, index) => ({
      id: index,
      text: sentence,
      status: "pending" as const,
    }));

    this.currentChunkIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.isGenerating = true;
    this.aborted = false;
    this.activeGenerations = 0;
    this.generationQueue = this.chunks.map((_, i) => i);

    this.notifyChunkUpdate();
    this.notifyProgress();

    if (!this.options.skipDownload) {
      await tts.download(this.options.voiceId as any, () => {});
    }

    this.startGeneration();
    await this.runPlaybackLoop();
  }

  private async startGeneration(): Promise<void> {
    const maxConcurrent = this.options.maxConcurrent || 2;

    const processNext = async () => {
      while (this.generationQueue.length > 0 && !this.aborted) {
        if (this.activeGenerations >= maxConcurrent) {
          await new Promise(resolve => setTimeout(resolve, 50));
          continue;
        }

        const chunkIndex = this.generationQueue.shift();
        if (chunkIndex === undefined) break;

        this.activeGenerations++;
        this.generateChunk(chunkIndex).finally(() => {
          this.activeGenerations--;
        });
      }

      while (this.activeGenerations > 0 && !this.aborted) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      this.isGenerating = false;
    };

    processNext();
  }

  private async generateChunk(index: number): Promise<void> {
    if (this.aborted) return;

    const chunk = this.chunks[index];
    if (!chunk || chunk.status !== "pending") return;

    chunk.status = "generating";
    this.notifyChunkUpdate();

    try {
      const audioBlob = await tts.predict({
        text: chunk.text,
        voiceId: this.options.voiceId as any,
      });

      if (this.aborted) return;

      chunk.audio = audioBlob;
      chunk.status = "ready";
      this.notifyChunkUpdate();
      this.notifyProgress();

      if (this.playbackPromiseResolve) {
        this.playbackPromiseResolve();
      }
    } catch (error) {
      if (this.aborted) return;
      chunk.status = "error";
      chunk.error = error instanceof Error ? error.message : "Unknown error";
      this.notifyChunkUpdate();
      this.options.onError?.(error instanceof Error ? error : new Error("TTS generation failed"));

      if (this.playbackPromiseResolve) {
        this.playbackPromiseResolve();
      }
    }
  }

  private async runPlaybackLoop(): Promise<void> {
    while (this.currentChunkIndex < this.chunks.length && !this.aborted) {
      const chunk = this.chunks[this.currentChunkIndex];

      if (chunk.status === "error") {
        this.currentChunkIndex++;
        this.notifyProgress();
        continue;
      }

      if (chunk.status === "ready" && chunk.audio) {
        await this.playChunk(chunk);
        continue;
      }

      await new Promise<void>(resolve => {
        this.playbackPromiseResolve = resolve;
        setTimeout(resolve, 100);
      });
      this.playbackPromiseResolve = null;
    }

    if (!this.aborted) {
      this.isPlaying = false;
      this.options.onComplete?.();
    }
  }

  private async playChunk(chunk: TTSChunk): Promise<void> {
    return new Promise((resolve) => {
      if (!chunk.audio || this.aborted) {
        resolve();
        return;
      }

      while (this.isPaused && !this.aborted) {
        setTimeout(() => {}, 100);
      }

      const audioUrl = URL.createObjectURL(chunk.audio);
      chunk.audioUrl = audioUrl;
      const audio = new Audio(audioUrl);
      audio.volume = this.options.volume || 0.8;
      audio.playbackRate = this.options.speed || 1.0;

      this.currentAudio = audio;
      chunk.status = "playing";
      this.notifyChunkUpdate();
      this.notifyProgress();

      const cleanup = () => {
        chunk.status = "done";
        this.currentChunkIndex++;
        URL.revokeObjectURL(audioUrl);
        chunk.audioUrl = undefined;
        this.currentAudio = null;
        this.notifyChunkUpdate();
        this.notifyProgress();
        resolve();
      };

      audio.onended = cleanup;
      audio.onerror = cleanup;

      audio.play().catch(cleanup);
    });
  }

  pause(): void {
    this.isPaused = true;
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  resume(): void {
    this.isPaused = false;
    if (this.currentAudio) {
      this.currentAudio.play();
    }
  }

  stop(): void {
    this.aborted = true;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    this.revokeAllAudioUrls();

    this.chunks = [];
    this.currentChunkIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.isGenerating = false;
    this.activeGenerations = 0;
    this.generationQueue = [];

    if (this.playbackPromiseResolve) {
      this.playbackPromiseResolve();
      this.playbackPromiseResolve = null;
    }

    this.notifyChunkUpdate();
  }

  setSpeed(speed: number): void {
    this.options.speed = speed;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = speed;
    }
  }

  setVolume(volume: number): void {
    this.options.volume = volume;
    if (this.currentAudio) {
      this.currentAudio.volume = volume;
    }
  }

  getState(): TTSEngineState {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      isGenerating: this.isGenerating,
      chunks: this.chunks.map(c => ({ ...c })),
      currentChunkIndex: this.currentChunkIndex,
      progress: {
        current: this.chunks.filter(c => ["ready", "playing", "done"].includes(c.status)).length,
        total: this.chunks.length,
        playing: this.currentChunkIndex,
      },
    };
  }
}

export function createTTSEngine(options: TTSEngineOptions): TTSEngine {
  return new TTSEngine(options);
}
