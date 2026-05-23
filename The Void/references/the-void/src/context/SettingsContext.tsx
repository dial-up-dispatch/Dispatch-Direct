import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export type AppSettings = {
  theme: 'expanse' | 'deep' | 'crimson-nebula'
  receptionMode: 'silence' | 'acknowledgment'
  retention: boolean
  muted: boolean
  ambienceMode: 'off' | 'tonal' | 'textured' | 'both'
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'expanse',
  receptionMode: 'silence',
  retention: false,
  muted: false,
  ambienceMode: 'off',
}

type SettingsContextType = {
  settings: AppSettings
  setSettings: (settings: AppSettings) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>('void_settings', DEFAULT_SETTINGS)

  // Shallow merge — guards against missing fields on migration from previous versions
  const mergedSettings = { ...DEFAULT_SETTINGS, ...settings }

  return (
    <SettingsContext.Provider value={{ settings: mergedSettings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
