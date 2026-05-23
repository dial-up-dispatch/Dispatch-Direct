import { useState, useEffect } from 'react'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { CRTShell } from './components/CRTShell'
import { ScreenWipe } from './components/ScreenWipe'
import { MainScreen } from './components/MainScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { playStaticPulse } from './lib/staticPulse'
import { setAmbienceMode, setAmbienceMuted, stopAmbience } from './lib/ambience'

function AppContent() {
  const { settings, setSettings } = useSettings()
  const [showSettings, setShowSettings] = useState(false)

  // Ambience mode changes
  useEffect(() => {
    setAmbienceMode(settings.ambienceMode, settings.muted)
  }, [settings.ambienceMode, settings.muted])

  // Mute changes
  useEffect(() => {
    setAmbienceMuted(settings.muted)
  }, [settings.muted])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAmbience()
  }, [])
  const [isWiping, setIsWiping] = useState(false)
  const [wipeDirection, setWipeDirection] = useState<'bottom-to-top' | 'top-to-bottom'>('bottom-to-top')

  // Detect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const WIPE_DURATION = prefersReducedMotion ? 200 : 400
  const WIPE_MIDPOINT = prefersReducedMotion ? 100 : 200

  // 1. Root-level Global Hotkeys Effect
  // Listens for 'M' or 'm' keydown events to toggle mute globally.
  // Kept here in AppContent so it works on both MainScreen and SettingsScreen.
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        const target = e.target as HTMLElement | null
        // Guard so typing 'm' inside the textarea does not fire the toggle
        if (target && target.tagName !== 'TEXTAREA') {
          setSettings({ ...settings, muted: !settings.muted })
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [settings, setSettings])

  // 2. Midpoint Sweep Visual Wipe Orchestration
  const triggerTransition = (targetState: boolean, direction: 'bottom-to-top' | 'top-to-bottom') => {
    if (isWiping) return
    setWipeDirection(direction)
    setIsWiping(true)

    // Swap content at midpoint when screen is fully covered
    setTimeout(() => {
      setShowSettings(targetState)
    }, WIPE_MIDPOINT)
  }

  const openSettings = () => {
    playStaticPulse(!settings.muted)
    triggerTransition(true, 'bottom-to-top')
  }

  const closeSettings = () => triggerTransition(false, 'top-to-bottom')

  const handleWipeComplete = () => {
    setIsWiping(false)
  }

  return (
    <div className={`theme-${settings.theme} min-h-screen w-full`}>
      <CRTShell>
        {/* Scanline visual sweep wipe overlay — renders during transitions only */}
        {isWiping && (
          <ScreenWipe
            direction={wipeDirection}
            onComplete={handleWipeComplete}
            duration={WIPE_DURATION}
          />
        )}

        {/* Main interactive releasing workspace */}
        {!showSettings && (
          <MainScreen
            onOpenSettings={openSettings}
          />
        )}

        {/* Settings panel dashboard */}
        {showSettings && (
          <SettingsScreen
            onClose={closeSettings}
          />
        )}
      </CRTShell>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}
