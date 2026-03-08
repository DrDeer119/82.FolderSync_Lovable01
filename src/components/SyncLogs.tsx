import type { SyncLogEntry, LogLevel } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Info, Trash2, Download } from 'lucide-react';

interface SyncLogsProps {
  logs: SyncLogEntry[];
  onClear: () => void;
}

const levelConfig: Record<LogLevel, { icon: React.ReactNode; color: string; bg: string; badge: string }> = {
  success: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-700',
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-600',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-700',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
  },
};

const levelLabels: Record<LogLevel, string> = {
  success: '成功',
  error: '错误',
  warning: '警告',
  info: '信息',
};

function formatTimestamp(date: Date): string {
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function SyncLogs({ logs, onClear }: SyncLogsProps) {
  const handleExport = () => {
    const content = logs
      .map(l => `[${formatTimestamp(l.timestamp)}] [${l.level.toUpperCase()}] ${l.pairName}: ${l.message}${l.details ? '\n  ' + l.details : ''}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `folder-sync-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">同步日志</h2>
          <p className="text-sm text-slate-500 mt-0.5">共 {logs.length} 条记录</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
          <button
            onClick={onClear}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        </div>
      </div>

      {/* Log List */}
      {logs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <Info className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">暂无日志记录</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          {logs.map(log => {
            const cfg = levelConfig[log.level];
            return (
              <div key={log.id} className={`rounded-xl border border-transparent p-4 ${cfg.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${cfg.color}`}>{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-800 text-sm">{log.pairName}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cfg.badge}`}>
                        {levelLabels[log.level]}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">{formatTimestamp(log.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{log.message}</p>
                    {log.details && (
                      <p className="text-xs text-slate-500 mt-1 font-mono bg-white/60 rounded px-2 py-1">{log.details}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
