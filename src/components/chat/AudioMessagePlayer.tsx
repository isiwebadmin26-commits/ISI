// src/components/chat/AudioMessagePlayer.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { formatDuration } from './VoiceRecorder';

interface AudioMessagePlayerProps {
  audioUrl: string;
  duration?: number;
  isUser?: boolean;
}

export const AudioMessagePlayer: React.FC<AudioMessagePlayerProps> = ({
  audioUrl,
  duration = 0,
  isUser = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setTotalDuration(Math.round(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.round(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.onpause = () => setIsPlaying(false);
    audio.onplay = () => setIsPlaying(true);

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (index: number, totalBars: number) => {
    if (!audioRef.current || !totalDuration) return;
    const seekTime = (index / totalBars) * totalDuration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(Math.round(seekTime));
  };

  const totalBars = 26;
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  const activeBarsCount = Math.floor((progressPercent / 100) * totalBars);

  return (
    <div
      className={`flex items-center gap-3 p-2.5 px-3.5 rounded-2xl max-w-xs sm:max-w-sm border ${
        isUser
          ? 'bg-primary/20 border-primary/30 text-primary-foreground'
          : 'bg-muted/60 dark:bg-slate-900/60 border-border/80 text-foreground'
      }`}
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer ${
          isUser
            ? 'bg-white text-primary hover:bg-white/90'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
        title={isPlaying ? 'Pause' : 'Play voice message'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 ml-0.5 fill-current" />
        )}
      </button>

      {/* Waveform Scrubber */}
      <div className="flex-1 flex flex-col gap-1 min-w-[130px]">
        <div className="flex items-center gap-0.5 h-6 cursor-pointer py-1">
          {Array.from({ length: totalBars }).map((_, idx) => {
            const barHeight = Math.max(25, (Math.sin(idx * 0.45) + 1.2) * 38);
            const isActive = idx <= activeBarsCount;

            return (
              <div
                key={idx}
                onClick={() => handleSeek(idx, totalBars)}
                style={{ height: `${barHeight}%` }}
                className={`flex-1 rounded-full transition-colors duration-150 ${
                  isActive
                    ? isUser ? 'bg-white' : 'bg-primary'
                    : isUser ? 'bg-white/35' : 'bg-muted-foreground/30'
                }`}
              />
            );
          })}
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
};
