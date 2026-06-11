import { Play, Pause, Square, Volume2, VolumeX, Settings } from 'lucide-react';
import { TagRow } from './TagRow';
import { OneLiner } from './OneLiner';
import { useTimer } from '../lib/TimerContext';

interface TimerTabProps {
  onSettingsOpen: () => void;
}

export function TimerTab({ onSettingsOpen }: TimerTabProps) {
  const {
    mode,
    status,
    elapsed,
    remaining,
    play,
    pause,
    stop,
    setMode,
    volume,
    setVolume,
    muted,
    toggleMute,
  } = useTimer();

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeToRender = mode === 'timer' ? remaining : elapsed;
  const formattedTime = formatTime(timeToRender);

  return (
    <div className="w-full flex flex-col items-center flex-grow select-none pl-4">
      {/* Tab Header with Settings Gear */}
      <div className="w-full flex items-center justify-between px-6 pt-4 pb-2 border-b border-[var(--dd-border-muted)]">
        {/* Title */}
        <span className="dd-text-xs dd-text-bold dd-text-uppercase text-[var(--dd-text-dim)] tracking-widest">
          &gt;circadian_
        </span>
        {/* Gear */}
        <button
          type="button"
          onClick={onSettingsOpen}
          className="flex items-center justify-center p-1 text-[var(--dd-text-dim)] hover:text-[var(--dd-accent)] hover:shadow-[var(--dd-active-glow)] transition-all"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Selector Row */}
      <div className="w-full flex justify-center gap-4 mt-6 px-6">
        <button
          type="button"
          onClick={() => setMode('timer')}
          className={`dd-text-xs dd-text-uppercase py-1.5 px-4 border transition-all ${
            mode === 'timer'
              ? 'border-[var(--dd-accent)] text-[var(--dd-text-bright)] bg-[var(--dd-accent-glow)] shadow-[var(--dd-active-glow)]'
              : 'border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)]'
          }`}
          style={{ borderRadius: 'var(--dd-radius-sm)' }}
        >
          [ timer ]
        </button>
        <button
          type="button"
          onClick={() => setMode('stopwatch')}
          className={`dd-text-xs dd-text-uppercase py-1.5 px-4 border transition-all ${
            mode === 'stopwatch'
              ? 'border-[var(--dd-accent)] text-[var(--dd-text-bright)] bg-[var(--dd-accent-glow)] shadow-[var(--dd-active-glow)]'
              : 'border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)]'
          }`}
          style={{ borderRadius: 'var(--dd-radius-sm)' }}
        >
          [ stopwatch ]
        </button>
      </div>

      {/* Center Clock Display */}
      <div className="flex flex-col items-center justify-center flex-grow py-12 select-none">
        <button
          type="button"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            filter: status === 'active' ? 'brightness(1.15)' : undefined
          }}
          onClick={status === 'active' ? pause : play}
          disabled={status === 'complete'}
          className={`text-6xl font-bold tracking-widest dd-font-mono text-[var(--dd-accent)] select-all transition-all duration-350 outline-none ${
            status === 'active'
              ? 'dd-glow-text cursor-pointer scale-105'
              : 'opacity-70 cursor-pointer hover:opacity-100 hover:scale-102'
          }`}
          aria-label="Toggle session timer"
        >
          {formattedTime}
        </button>
        
        {/* Status Line */}
        <div className="mt-4 flex items-center justify-center">
          <span className={`dd-text-xs dd-text-uppercase dd-status-pulse dd-${status} text-[var(--dd-text-dim)] tracking-widest transition-opacity duration-200 ease-in-out`}>
            STATUS: {status}
          </span>
        </div>

        {/* OneLiner */}
        <OneLiner />
      </div>

      {/* Tag Row Selector */}
      <div className="w-full flex flex-col items-center mb-6">
        <span className="dd-text-xs dd-text-uppercase text-[var(--dd-text-muted)] tracking-wider mb-1">
          select session focus
        </span>
        <TagRow />
      </div>

      {/* Controls Row */}
      <div className="w-full border-t border-[var(--dd-border-muted)] py-6 px-6 bg-[var(--dd-surface-ghost)]">
        <div className="flex items-center justify-between gap-4 max-w-xs mx-auto">
          {/* Play & Reset Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={status === 'active' ? pause : play}
              disabled={status === 'complete'}
              className={`flex items-center justify-center p-2 border border-[var(--dd-accent)] text-[var(--dd-text-bright)] bg-[var(--dd-accent-glow)] hover:shadow-[var(--dd-active-glow)] transition-all ${
                status === 'complete' ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              style={{ borderRadius: 'var(--dd-radius-md)' }}
              aria-label={status === 'active' ? "Pause timer" : "Play timer"}
            >
              {status === 'active' ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>

            {status !== 'standby' && (
              <button
                type="button"
                onClick={stop}
                className="flex items-center justify-center p-2 border border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)] transition-all"
                style={{ borderRadius: 'var(--dd-radius-md)' }}
                aria-label="Stop/Reset timer"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 flex-grow max-w-[140px]">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[var(--dd-text-dim)] hover:text-[var(--dd-accent)] transition-all"
              aria-label={muted ? "Unmute audio" : "Mute audio"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={muted}
              className="w-full h-1 bg-[var(--dd-border)] rounded-lg appearance-none cursor-pointer accent-[var(--dd-accent)] hover:shadow-[var(--dd-active-glow)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Adjust volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

