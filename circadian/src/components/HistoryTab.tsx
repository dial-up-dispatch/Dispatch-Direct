import { useState } from 'react';
import { useTimer } from '../lib/TimerContext';
import { format, isToday, isYesterday } from 'date-fns';
import { downloadSessionsMarkdown } from '../lib/export';

export function HistoryTab() {
  const { sessions, tags } = useTimer();
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Available filters: 'ALL' + all saved tags
  const filters = ['ALL', ...tags];

  // Filter and sort sessions (newest first)
  const filteredSessions = sessions
    .filter((session) => {
      if (activeFilter === 'ALL') return true;
      return session.tag === activeFilter;
    })
    .sort((a, b) => b.endTime - a.endTime);

  const getRelativeTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) return 'today';
    if (isYesterday(date)) return 'yesterday';
    return format(date, 'MMM d').toLowerCase(); // lowercase to match circadian voice
  };

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full flex flex-col flex-grow select-none overflow-hidden pl-4">
      {/* Header */}
      <div className="w-full px-6 pt-4 pb-2 border-b border-[var(--dd-border-muted)] flex-shrink-0">
        <span className="dd-text-xs dd-text-bold dd-text-uppercase text-[var(--dd-text-dim)] tracking-widest">
          session history
        </span>
      </div>

      {/* Horizontal Scroll Tag Filters */}
      <div className="w-full flex items-center gap-2 mt-4 px-6 overflow-x-auto scrollbar-none py-1 flex-shrink-0">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`dd-text-xs dd-text-lowercase py-1 px-3 border whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-[var(--dd-accent)] text-[var(--dd-text-bright)] bg-[var(--dd-accent-glow)] shadow-[var(--dd-active-glow)]'
                  : 'border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)]'
              }`}
              style={{ borderRadius: 'var(--dd-radius-sm)' }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-y-auto px-6 py-4 scrollbar-thin">
        {sessions.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <span className="dd-text-xs text-[var(--dd-text-dim)] leading-relaxed tracking-wider lowercase">
              no sessions logged yet.
              <br />
              go do something.
            </span>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <span className="dd-text-xs text-[var(--dd-text-dim)] leading-relaxed tracking-wider lowercase">
              nothing logged under this tag yet.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="w-full flex items-center justify-between py-2 border-b border-[var(--dd-border-muted)] dd-text-xs"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--dd-text-dim)] uppercase tracking-wider text-[10px]">
                      {session.mode}
                    </span>
                    <span className="text-[var(--dd-text-muted)]">—</span>
                    <span className={`dd-text-lowercase ${session.tag ? 'text-[var(--dd-accent)] font-medium' : 'text-[var(--dd-text-dim)]'}`}>
                      {session.tag || '—'}
                    </span>
                  </div>
                  <span className="text-[var(--dd-text-muted)] text-[10px] lowercase">
                    {getRelativeTimestamp(session.endTime)}
                  </span>
                </div>
                <span className="font-bold text-[var(--dd-text-bright)] font-mono">
                  {formatDuration(session.durationSeconds)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Export Bar */}
      <div className="w-full border-t border-[var(--dd-border-muted)] py-4 px-6 bg-[var(--dd-surface-ghost)] flex justify-end flex-shrink-0">
        <button
          type="button"
          onClick={() => downloadSessionsMarkdown(sessions)}
          disabled={sessions.length === 0}
          className="dd-text-xs dd-text-uppercase py-1.5 px-4 border border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)] hover:shadow-[var(--dd-active-glow)] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderRadius: 'var(--dd-radius-sm)' }}
        >
          [ export .md ]
        </button>
      </div>
    </div>
  );
}

