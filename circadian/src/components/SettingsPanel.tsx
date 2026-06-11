import { useState } from 'react';
import { X, Plus, Volume2, VolumeX } from 'lucide-react';
import type { ThemeName } from '../types';
import { useTimer } from '../lib/TimerContext';
import { downloadSessionsMarkdown } from '../lib/export';
import { audio } from '../lib/sound';

interface SettingsPanelProps {
  onClose: () => void;
  isClosing: boolean;
  onStartCollapse: () => void;
  onEndCollapse: () => void;
}

export function SettingsPanel({
  onClose,
  isClosing,
  onStartCollapse,
  onEndCollapse,
}: SettingsPanelProps) {
  const {
    theme,
    setTheme,
    duration,
    setDuration,
    volume,
    setVolume,
    muted,
    toggleMute,
    tags,
    addTag,
    removeTag,
    clearAllData,
    sessions,
  } = useTimer();

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagVal, setNewTagVal] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isJittering, setIsJittering] = useState(false);

  const themesList: { id: ThemeName; label: string }[] = [
    { id: 'last-call', label: 'last call' },
    { id: 'dusk-greenhouse', label: 'dusk greenhouse' },
    { id: 'wet-cobblestone', label: 'wet cobblestone' },
    { id: 'old-film', label: 'old film' },
  ];

  const handleSettingsAddTag = () => {
    const trimmed = newTagVal.trim();
    if (trimmed) {
      addTag(trimmed);
    }
    setNewTagVal('');
    setIsAddingTag(false);
  };

  const handleConfirmClear = () => {
    setShowClearConfirm(false);
    setIsCollapsing(true);
    onStartCollapse();
    audio.playWhoosh();

    // Trigger jitter at the end of the collapse sequence
    setTimeout(() => {
      setIsJittering(true);
    }, 750);

    setTimeout(() => {
      clearAllData();
      onEndCollapse();
      setIsCollapsing(false);
      setIsJittering(false);
      onClose();
    }, 900); // adjusted from 800ms to accommodate jitter
  };

  return (
    <div 
      className={`absolute inset-0 z-50 flex flex-col bg-[var(--dd-bg)] border-l border-[var(--dd-border)] select-none pl-4 ${
        isClosing ? 'dd-slide-out' : 'dd-slide-in'
      } ${isJittering ? 'dd-jitter' : ''}`}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 pt-4 pb-2 border-b border-[var(--dd-border-muted)]">
        <span className="dd-text-xs dd-text-bold dd-text-uppercase text-[var(--dd-accent)] tracking-widest dd-glow-text">
          &gt;settings_
        </span>
        <button
          type="button"
          onClick={onClose}
          disabled={isClosing || isCollapsing}
          className="flex items-center justify-center p-1 text-[var(--dd-text-dim)] hover:text-[var(--dd-accent)] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Close settings panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Options Scroll Container */}
      <div className="flex-grow overflow-y-auto px-6 py-4">
        <div className="flex flex-col min-h-full gap-6">
        
        {/* Signal Theme Section */}
        <div className="flex flex-col gap-2">
          <span className="dd-text-xs dd-text-uppercase text-[var(--dd-text-muted)] tracking-wider">
            signal (theme)
          </span>
          <div className="grid grid-cols-2 gap-2">
            {themesList.map((t) => {
              const isActive = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`dd-text-xs dd-text-lowercase py-2 px-3 border transition-all text-center cursor-pointer ${
                    isActive
                      ? 'border-[var(--dd-accent)] text-[var(--dd-text-bright)] bg-[var(--dd-accent-glow)] shadow-[var(--dd-active-glow)]'
                      : 'border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)]'
                  }`}
                  style={{ borderRadius: 'var(--dd-radius-sm)' }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timer Duration Section */}
        <div className="flex flex-col gap-2">
          <span className="dd-text-xs dd-text-uppercase text-[var(--dd-text-muted)] tracking-wider">
            timer duration
          </span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="999"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-3 py-1.5 border border-[var(--dd-border)] text-center dd-font-mono text-[var(--dd-text-bright)] bg-[var(--dd-surface)] hover:border-[var(--dd-border-active)] focus:border-[var(--dd-accent)] outline-none transition-all"
              style={{ borderRadius: 'var(--dd-radius-sm)' }}
            />
            <span className="dd-text-xs text-[var(--dd-text-dim)] lowercase">
              minutes
            </span>
          </div>
        </div>

        {/* Sound Settings Section */}
        <div className="flex flex-col gap-2">
          <span className="dd-text-xs dd-text-uppercase text-[var(--dd-text-muted)] tracking-wider">
            sound
          </span>
          <div className="flex items-center gap-4 py-1">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[var(--dd-text-dim)] hover:text-[var(--dd-accent)] transition-all cursor-pointer"
              aria-label={muted ? "Unmute settings audio" : "Mute settings audio"}
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
              className="w-32 h-1 bg-[var(--dd-border)] rounded-lg appearance-none cursor-pointer accent-[var(--dd-accent)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Adjust settings volume"
            />
          </div>
        </div>

        {/* Tags Settings Section */}
        <div className="flex flex-col gap-2">
          <span className="dd-text-xs dd-text-uppercase text-[var(--dd-text-muted)] tracking-wider">
            manage tags
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="group flex items-center gap-1.5 dd-text-xs dd-text-lowercase px-3 py-1 border border-[var(--dd-border)] text-[var(--dd-text-dim)] select-none"
                style={{ borderRadius: 'var(--dd-radius-sm)' }}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="opacity-0 group-hover:opacity-100 hover:text-[var(--dd-danger)] text-xs font-bold cursor-pointer transition-opacity"
                  aria-label={`Delete tag ${tag}`}
                >
                  ×
                </button>
              </div>
            ))}
            
            {isAddingTag ? (
              <div
                className="flex items-center gap-1 border border-[var(--dd-accent)] px-2 py-0.5 bg-[var(--dd-surface)]"
                style={{ borderRadius: 'var(--dd-radius-sm)' }}
              >
                <span className="text-[var(--dd-accent)] text-xs font-bold">&gt;</span>
                <input
                  type="text"
                  value={newTagVal}
                  onChange={(e) => setNewTagVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key.length === 1) {
                      audio.playClick();
                    }
                    if (e.key === 'Enter') {
                      handleSettingsAddTag();
                    } else if (e.key === 'Escape') {
                      e.stopPropagation();
                      setIsAddingTag(false);
                      setNewTagVal('');
                    }
                  }}
                  className="bg-transparent outline-none text-xs text-[var(--dd-text-bright)] w-16 dd-font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSettingsAddTag}
                  className="text-[var(--dd-accent)] hover:text-[var(--dd-text-bright)] flex items-center justify-center p-0.5 transition-all"
                  aria-label="Submit tag"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingTag(true)}
                className="flex items-center justify-center p-1.5 border border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)] transition-all cursor-pointer"
                style={{ borderRadius: 'var(--dd-radius-sm)' }}
                aria-label="Add settings tag"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Data Options Section */}
        <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-[var(--dd-border-muted)]">
          <span className="dd-text-xs dd-text-uppercase text-[var(--dd-text-muted)] tracking-wider">
            data controls
          </span>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => downloadSessionsMarkdown(sessions)}
              disabled={sessions.length === 0}
              className="dd-text-xs dd-text-uppercase py-2 px-3 border border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)] hover:shadow-[var(--dd-active-glow)] transition-all text-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderRadius: 'var(--dd-radius-sm)' }}
            >
              export all sessions
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="dd-text-xs dd-text-uppercase py-2 px-3 border border-[var(--dd-border)] text-[var(--dd-danger)] hover:border-[var(--dd-danger)] hover:bg-[rgba(234,76,96,0.08)] transition-all text-center cursor-pointer"
              style={{ borderRadius: 'var(--dd-radius-sm)' }}
            >
              clear all data
            </button>
          </div>
        </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-[var(--dd-bg)] px-6 select-none border-l border-[var(--dd-border)]">
          <div className="flex flex-col items-center text-center gap-6 max-w-xs">
            <span className="dd-text-xs dd-font-mono text-[var(--dd-text-dim)] lowercase leading-relaxed">
              this will delete all sessions, tags, and settings. cannot be undone.
            </span>
            <div className="flex flex-col w-full gap-2">
              <button
                type="button"
                onClick={handleConfirmClear}
                className="dd-text-xs dd-text-uppercase py-2 px-4 border border-[var(--dd-danger)] text-[var(--dd-danger)] hover:bg-[rgba(234,76,96,0.08)] transition-all text-center cursor-pointer"
                style={{ borderRadius: 'var(--dd-radius-sm)' }}
              >
                yes, clear everything
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="dd-text-xs dd-text-uppercase py-2 px-4 border border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)] transition-all text-center cursor-pointer"
                style={{ borderRadius: 'var(--dd-radius-sm)' }}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRT Power-Off Collapse Overlay */}
      {isCollapsing && (
        <div className="absolute inset-0 z-70 flex items-center justify-center pointer-events-auto bg-black dd-collapse-backdrop">
          {/* Phosphor Line */}
          <div className="absolute w-full h-[3px] bg-[var(--dd-accent)] shadow-[0_0_15px_var(--dd-accent)] dd-collapse-line" />
          
          {/* Center Phosphor Dot */}
          <div className="w-[5px] h-[5px] rounded-full bg-[var(--dd-accent)] shadow-[0_0_12px_var(--dd-accent)] dd-collapse-dot" />
        </div>
      )}
    </div>
  );
}
