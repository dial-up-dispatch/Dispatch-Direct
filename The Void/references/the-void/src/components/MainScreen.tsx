import { useState, useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { BlinkingCursor } from './BlinkingCursor'
import { playClick } from '../lib/clicks'
import { playWhoosh } from '../lib/whoosh'
import { DissolveOverlay } from './DissolveOverlay'
import { pickResponse } from '../lib/responses'
import { ResponseDisplay } from './ResponseDisplay'

interface MainScreenProps {
  onOpenSettings: () => void
}

export function MainScreen({ onOpenSettings }: MainScreenProps) {
  const { settings } = useSettings()
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)
  const [dissolveText, setDissolveText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<string | null>(null)
  const [responseVisible, setResponseVisible] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1. Textarea Auto-resize Effect
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [inputValue])

  // 2. Response Timeout Cleanup Effect
  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current)
      }
    }
  }, [])

  // 3. Send Sequence Handler
  const handleSend = () => {
    if (isSending || inputValue.trim().length === 0) return

    // Capture the text snapshot and measure height before state wipes
    const snapshot = inputValue
    const height = containerRef.current?.getBoundingClientRect().height ?? 40

    // Lock height and snapshot text to prevent layout collapse
    setContainerHeight(height)
    setDissolveText(snapshot)

    // Clear state instantly to physically purge data from React memory (Privacy compliance)
    setInputValue('')
    setIsSending(true)

    // Play synthesized Web Audio departure sound
    playWhoosh(!settings.muted)

    // After animation window (400ms spec + buffer), restore normal container flow
    setTimeout(() => {
      setIsSending(false)
      setContainerHeight(null)
      setDissolveText('')
      
      // Return focus to textarea for the next thought
      textareaRef.current?.focus()

      // Show response after dissolve completes — acknowledgment mode only
      if (settings.receptionMode === 'acknowledgment') {
        setCurrentResponse(pickResponse())
        setResponseVisible(true)
      }

      // Increment retention count if enabled
      if (settings.retention) {
        const current = parseInt(localStorage.getItem('void_count') ?? '0', 10)
        localStorage.setItem('void_count', String(current + 1))

        if (!localStorage.getItem('void_first_transmission')) {
          localStorage.setItem('void_first_transmission', new Date().toISOString())
        }

        localStorage.setItem('void_most_recent', new Date().toISOString())
      }
    }, 420)
  }

  // 4. Textarea Keydown Event Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Typing clicks: ignore system key modifiers and standard UI utility keys
    const isModifier = e.ctrlKey || e.altKey || e.metaKey
    const isSystemKey = [
      'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
      'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ].includes(e.key)

    if (!isModifier && !isSystemKey) {
      // Satisfying click sounds with subtle random pitch variance (Tactile typewriter feedback)
      playClick(0.95 + Math.random() * 0.1, !settings.muted)
    }

    // Shiftless Enter fires the send sequence
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Intercept standard browser newline insertion
      handleSend()
    }
  }

  // 5. Textarea Change Event Handler
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)

    if (responseVisible) {
      setResponseVisible(false)
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current)
      }
      responseTimeoutRef.current = setTimeout(() => {
        setCurrentResponse(null)
        responseTimeoutRef.current = null
      }, 400)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 select-none">
      <div className="flex flex-col items-center gap-6 max-w-xl w-full">
        
        {/* Input area wrapper */}
        <div
          ref={containerRef}
          style={{
            height: containerHeight ? `${containerHeight}px` : 'auto',
          }}
          className="relative w-full flex items-center justify-center transition-all duration-75"
        >
          {/* Chunky custom block cursor visible only when waiting (empty input) */}
          <div
            style={{ opacity: inputValue.length === 0 && !isFocused ? 1 : 0 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-150 z-20"
          >
            <BlinkingCursor />
          </div>

          {/* The Textarea */}
          <label htmlFor="void-input" className="sr-only">
            type your thought
          </label>
          <textarea
            id="void-input"
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSending}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="w-full text-center font-mono text-base text-[var(--color-text-primary)] bg-transparent border-none outline-hidden resize-none caret-[var(--color-accent)] z-10 px-3 py-2 leading-normal whitespace-pre-wrap break-words transition-opacity duration-150 placeholder:text-transparent"
          />

          {/* Evaporating Dissolve Animation Overlay */}
          <DissolveOverlay
            text={dissolveText}
            isVisible={isSending}
            containerHeight={containerHeight ?? 0}
          />
        </div>

        {/* Clickable Send Affordance */}
        <div
          onClick={handleSend}
          role="button"
          aria-label="send"
          className={`font-mono text-[0.7rem] tracking-[0.12em] select-none transition-colors duration-200 cursor-pointer ${
            isSending || inputValue.trim().length === 0
              ? 'text-[var(--color-text-dim)] cursor-default'
              : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-secondary)] phosphor-glow'
          }`}
        >
          [ ENTER ]
        </div>

      </div>

      {/* Void response — fixed position, acknowledgment mode only */}
      <ResponseDisplay
        text={currentResponse}
        isVisible={responseVisible}
      />

      {/* Footer Cluster: [ SETTINGS ] + DIAL UP DISPATCH */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.15em] pointer-events-none select-none text-[var(--color-text-dim)] z-20">
        <button
          onClick={onOpenSettings}
          className="pointer-events-auto cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors duration-200 bg-transparent border-none"
          aria-label="open settings"
        >
          [ SETTINGS ]
        </button>
        <div>DIAL UP DISPATCH</div>
      </div>
    </div>
  )
}
