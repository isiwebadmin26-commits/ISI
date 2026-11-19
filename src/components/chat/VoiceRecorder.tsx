// src/components/chat/VoiceRecorder.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Send, Square, Play, Pause, Mic } from 'lucide-react';

interface VoiceRecorderProps {
  isRecording: boolean;
  recordingTime: number;
  frequencyData: number[];
  audioUrl: string | null;
  onStop: () => void;
  onCancel: () => void;
  onSend: () => void;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  recordingTime,
  frequencyData,
  audioUrl,
  onStop,
  onCancel,
  onSend
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.onplay = () => setIsPlaying(true);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 px-4 bg-muted/90 dark:bg-slate-900 border border-primary/30 rounded-2xl shadow-lg w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Left: Cancel/Trash Button */}
      <button
        type="button"
        onClick={onCancel}
        className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
        title="Discard recording"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Middle: Live Waveform & Duration */}
      <div className="flex-1 flex items-center justify-center gap-3 overflow-hidden px-2">
        {isRecording ? (
          <>
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-semibold text-foreground">
                {formatDuration(recordingTime)}
              </span>
            </div>

            {/* Waveform Visualization Bars */}
            <div className="flex items-center gap-0.5 sm:gap-1 h-8 max-w-[200px] sm:max-w-[320px] overflow-hidden">
              {frequencyData.map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}%` }}
                  className="w-1 sm:w-1.5 rounded-full bg-primary/70 transition-all duration-75"
                />
              ))}
            </div>
          </>
        ) : audioUrl ? (
          /* Stopped Review Mode */
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={togglePlayback}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              title={isPlaying ? 'Pause' : 'Play preview'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1 flex items-center gap-1 h-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.max(20, (Math.sin(i * 0.5) + 1) * 45)}%` }}
                  className="flex-1 rounded-full bg-primary/40"
                />
              ))}
            </div>
            <span className="text-xs font-mono text-muted-foreground shrink-0">
              {formatDuration(recordingTime)}
            </span>
          </div>
        ) : null}
      </div>

      {/* Right Action: Stop or Send */}
      <div className="flex items-center gap-2 shrink-0">
        {isRecording ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer"
            title="Stop recording"
          >
            <Square className="w-4 h-4 fill-white" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer"
            title="Send voice message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
