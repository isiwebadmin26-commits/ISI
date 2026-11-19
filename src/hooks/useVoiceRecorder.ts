// src/hooks/useVoiceRecorder.ts
import { useState, useRef, useEffect, useCallback } from 'react';

export interface VoiceRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number; // in seconds
  audioBlob: Blob | null;
  audioUrl: string | null;
  frequencyData: number[];
  error: string | null;
}

export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioBlob: null,
    audioUrl: null,
    frequencyData: Array(32).fill(10),
    error: null
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Update waveform bars via Web Audio API AnalyserNode
  const updateWaveform = useCallback(() => {
    if (!analyserRef.current || !state.isRecording) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Downsample to 32 bars for sleek UI rendering
    const step = Math.floor(dataArray.length / 32) || 1;
    const bars: number[] = [];

    for (let i = 0; i < 32; i++) {
      const val = dataArray[i * step] || 0;
      // Normalize to 10 - 100 range
      const normalized = Math.max(12, Math.min(100, (val / 255) * 100));
      bars.push(normalized);
    }

    setState((prev) => ({ ...prev, frequencyData: bars }));
    animationFrameRef.current = requestAnimationFrame(updateWaveform);
  }, [state.isRecording]);

  const startRecording = async (): Promise<boolean> => {
    try {
      setState((prev) => ({
        ...prev,
        error: null,
        audioBlob: null,
        audioUrl: null,
        recordingTime: 0,
        frequencyData: Array(32).fill(12)
      }));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      // Setup Web Audio API for waveform
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Determine supported mime type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(finalBlob);

        setState((prev) => ({
          ...prev,
          isRecording: false,
          audioBlob: finalBlob,
          audioUrl: url
        }));

        // Stop stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      recorder.start(100);

      setState((prev) => ({ ...prev, isRecording: true }));

      // Start timer
      timerIntervalRef.current = window.setInterval(() => {
        setState((prev) => ({ ...prev, recordingTime: prev.recordingTime + 1 }));
      }, 1000);

      // Start waveform loop
      animationFrameRef.current = requestAnimationFrame(updateWaveform);

      return true;
    } catch (err: any) {
      console.warn('[VOICE RECORDER PERMISSION NOTICE]', err);
      setState((prev) => ({
        ...prev,
        isRecording: false,
        error: err.name === 'NotAllowedError' 
          ? 'Microphone permission denied. Please allow microphone access in your browser.' 
          : 'Failed to access microphone.'
      }));
      return false;
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      audioBlob: null,
      audioUrl: null,
      frequencyData: Array(32).fill(12),
      error: null
    });
  };

  const resetRecording = () => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      audioBlob: null,
      audioUrl: null,
      frequencyData: Array(32).fill(12),
      error: null
    });
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording
  };
}
