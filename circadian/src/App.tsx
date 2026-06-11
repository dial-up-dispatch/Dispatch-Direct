import { useState, useEffect } from 'react';
import { TimerTab } from './components/TimerTab';
import { HistoryTab } from './components/HistoryTab';
import { SettingsPanel } from './components/SettingsPanel';
import { useTimer } from './lib/TimerContext';
import { CRTWarmup } from './components/CRTWarmup';
import type { TabName } from './types';

function App() {
  const { theme, status, play, pause, toggleMute } = useTimer();
  const [activeTab, setActiveTab] = useState<TabName>('timer');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsClosing, setSettingsClosing] = useState(false);
  const [settingsCollapsing, setSettingsCollapsing] = useState(false);

  const handleOpenSettings = () => {
    setSettingsClosing(false);
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsClosing(true);
    setTimeout(() => {
      setSettingsOpen(false);
      setSettingsClosing(false);
    }, 200); // matches slide-out animation duration
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (settingsCollapsing) {
        // Block ALL keyboard shortcuts during data wipe collapse animation
        return;
      }

      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (settingsOpen || settingsClosing) {
        // Only allow Escape to exit during this window
        if (e.key === 'Escape') {
          if (!settingsClosing) {
            handleCloseSettings();
          }
        }
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        if (isInput) return;
        e.preventDefault();
        if (status === 'active') {
          pause();
        } else {
          play();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        if (isInput) return;
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [settingsOpen, settingsClosing, settingsCollapsing, status, play, pause, toggleMute]);

  return (
    <div data-theme={theme} className="dd-crt-shell dd-font-mono dd-text-smooth select-none flex flex-col h-full relative">
      {/* Isolated CRT Warm-up Overlay */}
      <CRTWarmup />

      {/* CRT Screen scanline, vignette, and grain overlays */}
      <div className="dd-screen-effects" aria-hidden="true" />
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        {activeTab === 'timer' ? (
          <TimerTab onSettingsOpen={handleOpenSettings} />
        ) : (
          <HistoryTab />
        )}

        {/* Settings Panel Overlay */}
        {settingsOpen && (
          <SettingsPanel
            onClose={handleCloseSettings}
            isClosing={settingsClosing}
            onStartCollapse={() => setSettingsCollapsing(true)}
            onEndCollapse={() => setSettingsCollapsing(false)}
          />
        )}
      </div>

      {/* Primary Tab Navigation Row */}
      <div className="w-full flex border-t border-[var(--dd-border-muted)] bg-[var(--dd-bg)]">
        <button
          type="button"
          onClick={() => setActiveTab('timer')}
          className={`flex-grow py-3 text-center dd-text-xs dd-text-uppercase transition-all border-r border-[var(--dd-border-muted)] ${
            activeTab === 'timer'
              ? 'text-[var(--dd-accent)] bg-[var(--dd-surface)] font-bold shadow-[var(--dd-shadow-glow)]'
              : 'text-[var(--dd-text-dim)] hover:text-[var(--dd-text)] hover:bg-[var(--dd-surface-ghost)]'
          }`}
        >
          timer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-grow py-3 text-center dd-text-xs dd-text-uppercase transition-all ${
            activeTab === 'history'
              ? 'text-[var(--dd-accent)] bg-[var(--dd-surface)] font-bold shadow-[var(--dd-shadow-glow)]'
              : 'text-[var(--dd-text-dim)] hover:text-[var(--dd-text)] hover:bg-[var(--dd-surface-ghost)]'
          }`}
        >
          log
        </button>
      </div>
    </div>
  );
}

export default App;

