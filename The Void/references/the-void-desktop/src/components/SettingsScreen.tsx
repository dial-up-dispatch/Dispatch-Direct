import { useState, useEffect, useCallback } from 'react'
import { useSettings } from '../context/SettingsContext'
import { format, isToday, isYesterday } from 'date-fns'

interface SettingsScreenProps {
  onClose: () => void
}

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const { settings, setSettings } = useSettings()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Local React state for immediate reactive update upon clearing archive
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('void_count') ?? '0', 10))
  const [firstTransmission, setFirstTransmission] = useState(() => localStorage.getItem('void_first_transmission'))
  const [mostRecent, setMostRecent] = useState(() => localStorage.getItem('void_most_recent'))

  const handleClose = useCallback(() => {
    if (showClearConfirm) {
      setShowClearConfirm(false)
    } else {
      onClose()
    }
  }, [showClearConfirm, onClose])


  // Escape key handler with safe dependency bounds
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [handleClose])


  const handleClearArchive = () => {
    localStorage.removeItem('void_count')
    localStorage.removeItem('void_first_transmission')
    localStorage.removeItem('void_most_recent')
    setCount(0)
    setFirstTransmission(null)
    setMostRecent(null)
    setShowClearConfirm(false)
  }

  // Safe date formatting helpers
  const formatFullDate = (dateStr: string | null): string => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'
    return format(date, 'MMMM d, yyyy').toLowerCase()
  }

  const formatRelativeDate = (dateStr: string | null): string => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'
    if (isToday(date)) return 'today'
    if (isYesterday(date)) return 'yesterday'
    return format(date, 'MMMM d, yyyy').toLowerCase()
  }

  return (
    <div className="h-full w-full overflow-y-auto flex justify-center py-20 px-6">
      <div className="max-w-[min(560px,90vw)] w-full flex flex-col items-start select-none">
        
        {/* BACK button */}
        <button
          onClick={handleClose}
          className="font-mono text-[0.65rem] tracking-[0.15em] text-[var(--color-text-dim)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer bg-transparent border-none p-0 mb-12 self-start"
          aria-label="back to void"
        >
          [ BACK ]
        </button>

        <h1 className="w-full font-mono text-[0.75rem] tracking-[0.2em] text-[var(--color-text-dim)] text-center mb-16 uppercase">
          THIS VOID IS YOURS
        </h1>

        {/* Section 1: Signal (Theme) */}
        <section className="w-full mb-14">
          <p className="font-mono text-[0.8rem] text-[var(--color-text-secondary)] mb-5 tracking-[0.05em]">
            choose your signal.
          </p>
          <div className="flex flex-col gap-1 w-full">
            <button
              onClick={() => setSettings({ ...settings, theme: 'expanse' })}
              className={`settings-option ${settings.theme === 'expanse' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.theme === 'expanse' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">the expanse</div>
                <div className="settings-option-description">cold. vast. the quiet between stars.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, theme: 'deep' })}
              className={`settings-option ${settings.theme === 'deep' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.theme === 'deep' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">the deep</div>
                <div className="settings-option-description">ancient. weighted. something older than words.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, theme: 'crimson-nebula' })}
              className={`settings-option ${settings.theme === 'crimson-nebula' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.theme === 'crimson-nebula' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">crimson nebula</div>
                <div className="settings-option-description">slow burn. distant light. something ending, beautifully.</div>
              </div>
            </button>
          </div>
        </section>

        {/* Section 2: Reception */}
        <section className="w-full mb-14">
          <p className="font-mono text-[0.8rem] text-[var(--color-text-secondary)] mb-5 tracking-[0.05em]">
            does she speak, or absorb in silence?
          </p>
          <div className="flex flex-col gap-1 w-full">
            <button
              onClick={() => setSettings({ ...settings, receptionMode: 'silence' })}
              className={`settings-option ${settings.receptionMode === 'silence' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.receptionMode === 'silence' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">silence</div>
                <div className="settings-option-description">she receives. the dark is the answer.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, receptionMode: 'acknowledgment' })}
              className={`settings-option ${settings.receptionMode === 'acknowledgment' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.receptionMode === 'acknowledgment' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">acknowledgment</div>
                <div className="settings-option-description">she receives. she says one small thing.</div>
              </div>
            </button>
          </div>
        </section>

        {/* Section 3: Retention */}
        <section className="w-full mb-14">
          <p className="font-mono text-[0.8rem] text-[var(--color-text-secondary)] mb-5 tracking-[0.05em]">
            does she count, or forget?
          </p>
          <div className="flex flex-col gap-1 w-full">
            <button
              onClick={() => setSettings({ ...settings, retention: false })}
              className={`settings-option ${!settings.retention ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {!settings.retention ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">the void forgets</div>
                <div className="settings-option-description">it happened. that's enough.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, retention: true })}
              className={`settings-option ${settings.retention ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.retention ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">the void remembers</div>
                <div className="settings-option-description">just a number. nothing more.</div>
              </div>
            </button>
          </div>

          {/* Retention Archive Block */}
          {settings.retention && (
            <div className="archive-block w-full">
              <div className="archive-title">THE VOID HAS RECEIVED</div>
              <div className="archive-count font-mono">{count}</div>
              <div className="archive-dates font-mono">
                <div>first transmission: {formatFullDate(firstTransmission)}</div>
                <div>most recent: {formatRelativeDate(mostRecent)}</div>
              </div>

              {!showClearConfirm ? (
                <button onClick={() => setShowClearConfirm(true)} className="archive-clear-btn">
                  [ clear ]
                </button>
              ) : (
                <div className="archive-confirm font-mono">
                  <div>this will forget everything.</div>
                  <div>are you sure?</div>
                  <div className="archive-confirm-actions">
                    <button onClick={handleClearArchive} className="archive-clear-btn">
                      [ yes, forget ]
                    </button>
                    <button onClick={() => setShowClearConfirm(false)} className="archive-clear-btn">
                      [ keep it ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 4: Sound */}
        <section className="w-full mb-14">
          <p className="font-mono text-[0.8rem] text-[var(--color-text-secondary)] mb-5 tracking-[0.05em]">
            does she have a voice at all?
          </p>
          <div className="flex flex-col gap-1 w-full">
            <button
              onClick={() => setSettings({ ...settings, muted: false })}
              className={`settings-option ${!settings.muted ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {!settings.muted ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">ambient</div>
                <div className="settings-option-description">the keys speak. the departure has a sound.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, muted: true })}
              className={`settings-option ${settings.muted ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.muted ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">silent</div>
                <div className="settings-option-description">no sound. just the dark and the words.</div>
              </div>
            </button>
          </div>
        </section>

        {/* Section 5: Ambience */}
        <section className="w-full mb-14">
          <p className="font-mono text-[0.8rem] text-[var(--color-text-secondary)] mb-5 tracking-[0.05em]">
            does she breathe?
          </p>
          <div className="flex flex-col gap-1 w-full">
            <button
              onClick={() => setSettings({ ...settings, ambienceMode: 'off' })}
              className={`settings-option ${settings.ambienceMode === 'off' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.ambienceMode === 'off' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">silence</div>
                <div className="settings-option-description">just the dark.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, ambienceMode: 'tonal' })}
              className={`settings-option ${settings.ambienceMode === 'tonal' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.ambienceMode === 'tonal' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">the drone</div>
                <div className="settings-option-description">tones. deep. something ancient underneath.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, ambienceMode: 'textured' })}
              className={`settings-option ${settings.ambienceMode === 'textured' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.ambienceMode === 'textured' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">the texture</div>
                <div className="settings-option-description">noise shaped into something vast and soft.</div>
              </div>
            </button>

            <button
              onClick={() => setSettings({ ...settings, ambienceMode: 'both' })}
              className={`settings-option ${settings.ambienceMode === 'both' ? 'settings-option--selected' : ''}`}
            >
              <div className="settings-option-indicator">
                {settings.ambienceMode === 'both' ? '●' : '○'}
              </div>
              <div className="settings-option-content">
                <div className="settings-option-label">both</div>
                <div className="settings-option-description">the drone inside the dark. the full depth.</div>
              </div>
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}
