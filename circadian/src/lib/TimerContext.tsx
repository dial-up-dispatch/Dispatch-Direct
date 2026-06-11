/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ThemeName, TimerMode, Session, AppSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { audio } from './sound';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from './constants';

export type TimerStatus = 'standby' | 'active' | 'paused' | 'complete';

interface TimerContextType {
  mode: TimerMode;
  status: TimerStatus;
  elapsed: number;
  remaining: number;
  duration: number;
  volume: number;
  muted: boolean;
  theme: ThemeName;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setMode: (mode: TimerMode) => void;
  setDuration: (minutes: number) => void;
  setVolume: (level: number) => void;
  toggleMute: () => void;
  setTheme: (theme: ThemeName) => void;
  
  // Phase 2 additions
  tags: string[];
  activeTag: string | null;
  sessions: Session[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setActiveTag: (tag: string | null) => void;
  clearAllData: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  // Synchronous loading of initial settings to prevent flashes and UI discrepancies
  const getInitialSettings = (): AppSettings => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (err) {
      console.warn('Failed to parse stashed settings from localStorage:', err);
    }
    return DEFAULT_SETTINGS;
  };

  const initialSettings = getInitialSettings();

  const [theme, setTheme] = useState<ThemeName>(initialSettings.theme);
  const [duration, setDurationState] = useState<number>(initialSettings.timerDurationMinutes);
  const [tags, setTags] = useState<string[]>(initialSettings.tags);
  const [muted, setMuted] = useState<boolean>(initialSettings.muted);
  const [volume, setVolumeState] = useState<number>(initialSettings.volume);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mode, setModeState] = useState<TimerMode>('timer');
  const [status, setStatus] = useState<TimerStatus>('standby');
  const [elapsed, setElapsed] = useState(0);
  
  // Initializing remaining directly from the loaded persisted duration (prevents 25:00 default flash bug)
  const [remaining, setRemaining] = useState<number>(initialSettings.timerDurationMinutes * 60);

  // Refs to maintain latest values in interval tick without stale closures
  const modeRef = useRef(mode);
  const durationRef = useRef(duration);
  const elapsedRef = useRef(elapsed);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number>(0);

  // Sync refs with React state updates
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Sync settings and audio on mount
  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    // Set initial volumes in singleton audio module
    audio.setVolume(volume);
    audio.setMuted(muted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Settings change observer to persist settings to localStorage
  const isSettingsMounted = useRef(false);
  useEffect(() => {
    if (!isSettingsMounted.current) {
      isSettingsMounted.current = true;
      return;
    }
    const settings: AppSettings = {
      theme,
      timerDurationMinutes: duration,
      tags,
      muted,
      volume
    };
    window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

    // Keep audio module in sync
    audio.setVolume(volume);
    audio.setMuted(muted);
  }, [theme, duration, tags, muted, volume]);

  const logSession = (sessionMode: TimerMode, durationSec: number) => {
    const newSession: Session = {
      id: uuidv4(),
      mode: sessionMode,
      startTime: sessionStartRef.current,
      endTime: Date.now(),
      durationSeconds: durationSec,
      tag: activeTag || undefined
    };

    setSessions((prev) => {
      const updated = [newSession, ...prev];
      window.localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
      return updated;
    });

    // Reset active tag for the next session
    setActiveTag(null);
  };

  const play = () => {
    // Bootstrap AudioContext to bypass browser autoplay blocks
    audio.unlock();

    if (status === 'active' || status === 'complete') return;

    setStatus('active');
    
    // Set a start timestamp offset by already elapsed milliseconds
    sessionStartRef.current = Date.now() - (elapsedRef.current * 1000);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.floor((now - sessionStartRef.current) / 1000);
      
      setElapsed(elapsedSec);

      if (modeRef.current === 'timer') {
        const totalSec = durationRef.current * 60;
        const rem = Math.max(0, totalSec - elapsedSec);
        setRemaining(rem);

        if (rem <= 0) {
          setStatus('complete');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          audio.playChime();
          logSession(modeRef.current, elapsedSec);
        }
      }
    }, 100);
  };

  const pause = () => {
    if (status !== 'active') return;

    setStatus('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stop = () => {
    // Accidental start prevention: only log if active/paused and elapsed >= 10 seconds
    if ((status === 'active' || status === 'paused') && elapsedRef.current >= 10) {
      logSession(mode, elapsedRef.current);
    }

    setStatus('standby');
    setElapsed(0);
    setRemaining(duration * 60);
    
    // Reset elapsed ref immediately to prevent stale read on next play
    elapsedRef.current = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const setMode = (newMode: TimerMode) => {
    stop();
    setModeState(newMode);
  };

  const setDuration = (minutes: number) => {
    const clamped = Math.max(1, minutes);
    setDurationState(clamped);
    if (status === 'standby') {
      setRemaining(clamped * 60);
    }
  };

  const setVolume = (level: number) => {
    setVolumeState(Math.max(0, Math.min(1, level)));
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    setTags((prev) => {
      const exists = prev.some((t) => t.toLowerCase() === trimmed.toLowerCase());
      if (exists) return prev;
      return [...prev, trimmed];
    });
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    if (activeTag === tag) {
      setActiveTag(null);
    }
  };

  const clearAllData = () => {
    setStatus('standby');
    setElapsed(0);
    setRemaining(DEFAULT_SETTINGS.timerDurationMinutes * 60);
    setTheme(DEFAULT_SETTINGS.theme);
    setDurationState(DEFAULT_SETTINGS.timerDurationMinutes);
    setTags(DEFAULT_SETTINGS.tags);
    setVolumeState(DEFAULT_SETTINGS.volume);
    setMuted(DEFAULT_SETTINGS.muted);
    setSessions([]);
    setActiveTag(null);
    elapsedRef.current = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    window.localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    window.localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        status,
        elapsed,
        remaining,
        duration,
        volume,
        muted,
        theme,
        play,
        pause,
        stop,
        setMode,
        setDuration,
        setVolume,
        toggleMute,
        setTheme,
        tags,
        activeTag,
        sessions,
        addTag,
        removeTag,
        setActiveTag,
        clearAllData,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}

