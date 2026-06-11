export type ThemeName = 'last-call' | 'dusk-greenhouse' | 'wet-cobblestone' | 'old-film';
export type TimerMode = 'timer' | 'stopwatch';
export type TabName = 'timer' | 'history';

export interface Session {
  id: string;
  mode: TimerMode;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  tag?: string;
}

export interface AppSettings {
  theme: ThemeName;
  timerDurationMinutes: number;
  tags: string[];
  muted: boolean;
  volume: number;
}
