import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTimer } from '../lib/TimerContext';
import { audio } from '../lib/sound';

export function TagRow() {
  const { tags, activeTag, addTag, removeTag, setActiveTag } = useTimer();
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAdd = () => {
    const trimmed = newTag.trim();
    if (trimmed) {
      addTag(trimmed);
    }
    setNewTag('');
    setIsAdding(false);
  };

  const handleChipClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
    }
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-4 px-4 select-none">
      {tags.map((tag) => {
        const isActive = tag === activeTag;
        return (
          <div
            key={tag}
            className={`group flex items-center gap-1.5 dd-text-xs dd-text-lowercase px-3 py-1 border transition-all cursor-pointer ${
              isActive
                ? 'border-[var(--dd-accent)] text-[var(--dd-text-bright)] bg-[var(--dd-accent-glow)] shadow-[var(--dd-active-glow)]'
                : 'border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)]'
            }`}
            style={{ borderRadius: 'var(--dd-radius-sm)' }}
            onClick={() => handleChipClick(tag)}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent chip click from firing
                removeTag(tag);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-[var(--dd-danger)] ml-0.5 text-xs font-bold transition-opacity duration-150 cursor-pointer"
              aria-label={`Delete tag ${tag}`}
            >
              ×
            </button>
          </div>
        );
      })}

      {isAdding ? (
        <div
          className="flex items-center gap-1 border border-[var(--dd-accent)] px-2 py-0.5 bg-[var(--dd-surface)]"
          style={{ borderRadius: 'var(--dd-radius-sm)' }}
        >
          <span className="text-[var(--dd-accent)] text-xs font-bold">&gt;</span>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key.length === 1) {
                audio.playClick();
              }
              if (e.key === 'Enter') {
                handleAdd();
              } else if (e.key === 'Escape') {
                setIsAdding(false);
                setNewTag('');
              }
            }}
            className="bg-transparent outline-none text-xs text-[var(--dd-text-bright)] w-16 dd-font-mono"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="text-[var(--dd-accent)] hover:text-[var(--dd-text-bright)] flex items-center justify-center p-0.5 transition-all"
            aria-label="Submit tag"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center p-1.5 border border-[var(--dd-border)] text-[var(--dd-text-dim)] hover:border-[var(--dd-border-active)] hover:text-[var(--dd-text)] transition-all cursor-pointer"
          style={{ borderRadius: 'var(--dd-radius-sm)' }}
          aria-label="Add custom tag"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

