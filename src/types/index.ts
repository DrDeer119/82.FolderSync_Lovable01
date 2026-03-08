export type SyncDirection = 'one-way' | 'two-way' | 'mirror';
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'paused';
export type SyncSchedule = 'manual' | 'realtime' | '5min' | '15min' | '30min' | '1hour' | '6hour' | '24hour';

export interface SyncPair {
  id: string;
  name: string;
  sourcePath: string;
  destPath: string;
  direction: SyncDirection;
  schedule: SyncSchedule;
  status: SyncStatus;
  lastSync: Date | null;
  nextSync: Date | null;
  filesTotal: number;
  filesSynced: number;
  bytesTotal: number;
  bytesSynced: number;
  enabled: boolean;
  excludePatterns: string[];
}

export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface SyncLogEntry {
  id: string;
  pairId: string;
  pairName: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: string;
}

export interface AppSettings {
  language: 'zh' | 'en';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  startWithSystem: boolean;
  minimizeToTray: boolean;
  logRetentionDays: number;
  maxConcurrentSyncs: number;
}
