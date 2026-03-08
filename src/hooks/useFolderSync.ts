import { useState, useCallback } from 'react';
import type { SyncPair, SyncLogEntry, AppSettings, SyncStatus } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 10);

const MOCK_PAIRS: SyncPair[] = [
  {
    id: 'pair-1',
    name: '文档备份',
    sourcePath: 'C:\\Users\\Admin\\Documents',
    destPath: 'D:\\Backup\\Documents',
    direction: 'one-way',
    schedule: '1hour',
    status: 'success',
    lastSync: new Date(Date.now() - 3600000),
    nextSync: new Date(Date.now() + 3600000),
    filesTotal: 1240,
    filesSynced: 1240,
    bytesTotal: 2048 * 1024 * 1024,
    bytesSynced: 2048 * 1024 * 1024,
    enabled: true,
    excludePatterns: ['*.tmp', '~$*'],
  },
  {
    id: 'pair-2',
    name: '项目代码同步',
    sourcePath: 'C:\\Projects',
    destPath: '\\\\NAS\\Projects',
    direction: 'two-way',
    schedule: 'realtime',
    status: 'syncing',
    lastSync: new Date(Date.now() - 120000),
    nextSync: null,
    filesTotal: 5820,
    filesSynced: 3210,
    bytesTotal: 4096 * 1024 * 1024,
    bytesSynced: 2200 * 1024 * 1024,
    enabled: true,
    excludePatterns: ['node_modules', '.git', '*.log'],
  },
  {
    id: 'pair-3',
    name: '照片归档',
    sourcePath: 'C:\\Users\\Admin\\Pictures',
    destPath: 'E:\\Photos\\Archive',
    direction: 'mirror',
    schedule: '24hour',
    status: 'paused',
    lastSync: new Date(Date.now() - 86400000 * 3),
    nextSync: new Date(Date.now() + 86400000),
    filesTotal: 8930,
    filesSynced: 8930,
    bytesTotal: 32768 * 1024 * 1024,
    bytesSynced: 32768 * 1024 * 1024,
    enabled: false,
    excludePatterns: ['Thumbs.db'],
  },
  {
    id: 'pair-4',
    name: '桌面同步',
    sourcePath: 'C:\\Users\\Admin\\Desktop',
    destPath: 'D:\\Backup\\Desktop',
    direction: 'one-way',
    schedule: '30min',
    status: 'error',
    lastSync: new Date(Date.now() - 1800000),
    nextSync: new Date(Date.now() + 1800000),
    filesTotal: 120,
    filesSynced: 87,
    bytesTotal: 512 * 1024 * 1024,
    bytesSynced: 320 * 1024 * 1024,
    enabled: true,
    excludePatterns: [],
  },
];

const MOCK_LOGS: SyncLogEntry[] = [
  {
    id: 'log-1',
    pairId: 'pair-1',
    pairName: '文档备份',
    timestamp: new Date(Date.now() - 3600000),
    level: 'success',
    message: '同步完成',
    details: '已同步 1240 个文件，共 2.0 GB',
  },
  {
    id: 'log-2',
    pairId: 'pair-2',
    pairName: '项目代码同步',
    timestamp: new Date(Date.now() - 120000),
    level: 'info',
    message: '正在同步中',
    details: '已完成 3210/5820 个文件',
  },
  {
    id: 'log-3',
    pairId: 'pair-4',
    pairName: '桌面同步',
    timestamp: new Date(Date.now() - 1800000),
    level: 'error',
    message: '同步失败：目标路径不可访问',
    details: '错误代码: ENOENT - D:\\Backup\\Desktop 路径不存在',
  },
  {
    id: 'log-4',
    pairId: 'pair-1',
    pairName: '文档备份',
    timestamp: new Date(Date.now() - 7200000),
    level: 'warning',
    message: '跳过 3 个锁定文件',
    details: '~$report.docx, ~$budget.xlsx, ~$notes.docx',
  },
  {
    id: 'log-5',
    pairId: 'pair-3',
    pairName: '照片归档',
    timestamp: new Date(Date.now() - 86400000 * 3),
    level: 'success',
    message: '同步完成',
    details: '已同步 8930 个文件，共 32.0 GB',
  },
  {
    id: 'log-6',
    pairId: 'pair-2',
    pairName: '项目代码同步',
    timestamp: new Date(Date.now() - 300000),
    level: 'info',
    message: '检测到文件变更',
    details: '修改: src/components/App.tsx',
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  language: 'zh',
  theme: 'light',
  notifications: true,
  startWithSystem: false,
  minimizeToTray: true,
  logRetentionDays: 30,
  maxConcurrentSyncs: 3,
};

export function useFolderSync() {
  const [pairs, setPairs] = useState<SyncPair[]>(MOCK_PAIRS);
  const [logs, setLogs] = useState<SyncLogEntry[]>(MOCK_LOGS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const addPair = useCallback((pair: Omit<SyncPair, 'id' | 'status' | 'lastSync' | 'nextSync' | 'filesTotal' | 'filesSynced' | 'bytesTotal' | 'bytesSynced'>) => {
    const newPair: SyncPair = {
      ...pair,
      id: `pair-${generateId()}`,
      status: 'idle',
      lastSync: null,
      nextSync: null,
      filesTotal: 0,
      filesSynced: 0,
      bytesTotal: 0,
      bytesSynced: 0,
    };
    setPairs(prev => [...prev, newPair]);
    return newPair;
  }, []);

  const updatePair = useCallback((id: string, updates: Partial<SyncPair>) => {
    setPairs(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePair = useCallback((id: string) => {
    setPairs(prev => prev.filter(p => p.id !== id));
  }, []);

  const togglePair = useCallback((id: string) => {
    setPairs(prev => prev.map(p => {
      if (p.id !== id) return p;
      const enabled = !p.enabled;
      const status: SyncStatus = enabled ? 'idle' : 'paused';
      return { ...p, enabled, status };
    }));
  }, []);

  const startSync = useCallback((id: string) => {
    setPairs(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'syncing' as SyncStatus } : p
    ));
    const pair = pairs.find(p => p.id === id);
    if (pair) {
      const logEntry: SyncLogEntry = {
        id: `log-${generateId()}`,
        pairId: id,
        pairName: pair.name,
        timestamp: new Date(),
        level: 'info',
        message: '手动触发同步',
      };
      setLogs(prev => [logEntry, ...prev]);
    }
    // Simulate sync completion after 3s
    setTimeout(() => {
      setPairs(prev => prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: 'success' as SyncStatus,
          lastSync: new Date(),
          filesSynced: p.filesTotal,
          bytesSynced: p.bytesTotal,
        };
      }));
      const currentPair = pairs.find(p => p.id === id);
      if (currentPair) {
        const successLog: SyncLogEntry = {
          id: `log-${generateId()}`,
          pairId: id,
          pairName: currentPair.name,
          timestamp: new Date(),
          level: 'success',
          message: '同步完成',
        };
        setLogs(prev => [successLog, ...prev]);
      }
    }, 3000);
  }, [pairs]);

  const stopSync = useCallback((id: string) => {
    setPairs(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'idle' as SyncStatus } : p
    ));
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    pairs,
    logs,
    settings,
    addPair,
    updatePair,
    deletePair,
    togglePair,
    startSync,
    stopSync,
    updateSettings,
    clearLogs,
  };
}
