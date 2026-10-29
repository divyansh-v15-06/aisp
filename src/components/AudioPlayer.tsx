import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Loader2, Sparkles } from 'lucide-react';

interface AudioPlayerProps {
  textToSpeak: string;
  title: string;
  toneName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  textToSpeak,
  title,
  toneName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useFallbackSpeech, setUseFallbackSpeech] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop audio whenever text changes
  useEffect(() => {
    handleStop();
    setAudioUrl(null);
    setErrorMessage(null);
    setUseFallbackSpeech(false);
  }, [textToSpeak]);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleGenerateAndPlay = async () => {
    if (isPlaying) {
      if (audioRef.current && !useFallbackSpeech) {
        audioRef.current.pause();
      } else if (window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
      return;
    }

    // If audio is already loaded, resume
    if (audioRef.current && audioUrl && !useFallbackSpeech) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      } catch (e) {
        console.warn('Resume error, refetching:', e);
      }
    }

    // If using native fallback speech
    if (useFallbackSpeech) {
      playNativeTTS();
      return;
    }

    // Call server-side Gemini TTS API
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/synthesize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${title}. ${textToSpeak}`,
          voiceName: 'Kore',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Speech synthesis request failed.');
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('No audio data received.');
      }

      const wavUrl = `data:audio/wav;base64,${data.audioBase64}`;
      setAudioUrl(wavUrl);

      const audio = new Audio(wavUrl);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        console.warn('Audio element error, falling back to Web Speech API');
        playNativeTTS();
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err: any) {
      console.warn('Gemini TTS failed, falling back to Web Speech API:', err.message);
      setUseFallbackSpeech(true);
      playNativeTTS();
    } finally {
      setIsLoading(false);
    }
  };

  const playNativeTTS = () => {
    if (!('speechSynthesis' in window)) {
      setErrorMessage('Speech playback is not supported by your browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${title}. ${textToSpeak}`);
    utterance.rate = playbackRate;
    synthRef.current = utterance;

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    utterance.onerror = (e) => {
      setIsPlaying(false);
      setErrorMessage('Browser speech synthesis error.');
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const toggleRate = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={handleGenerateAndPlay}
          disabled={isLoading}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition-all shadow-sm disabled:opacity-50"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio explanation'}
          title={isPlaying ? 'Pause' : 'Listen to explanation'}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>Listen to Narration</span>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {useFallbackSpeech ? 'Web Speech' : 'Gemini 3.8 TTS'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {duration > 0
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : `${toneName} voice overview`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleRate}
          className="px-2 py-1 text-[11px] font-mono font-medium rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          title="Adjust playback speed"
        >
          {playbackRate}x
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Reset audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="w-full text-[11px] text-amber-600 dark:text-amber-400">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
