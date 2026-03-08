import type { SyncPair, SyncStatus, SyncDirection } from '../types';
import {
  Play,
  Square,
  Pause,
  RefreshCw,
  Trash2,
  Edit2,
  ArrowRight,
  ArrowLeftRight,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

interface SyncPairCardProps {
  pair: SyncPair;
  onStart: () => void;
  onStop: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const statusConfig: Record<SyncStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  idle: { label: '空闲', icon: <Clock className="w-4 h-4" />, color: 'text-slate-500', bg: 'bg-slate-100' },
  syncing: { label: '同步中', icon: <RefreshCw className="w-4 h-4 animate-spin" />, color: 'text-blue-600', bg: 'bg-blue-50' },
  success: { label: '已完成', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-50' },
  error: { label: '错误', icon: <XCircle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-50' },
  paused: { label: '已暂停', icon: <Pause className="w-4 h-4" />, color: 'text-amber-600', bg: 'bg-amber-50' },
};

const directionConfig: Record<SyncDirection, { label: string; icon: React.ReactNode }> = {
  'one-way': { label: '单向同步', icon: <ArrowRight className="w-4 h-4" /> },
  'two-way': { label: '双向同步', icon: <ArrowLeftRight className="w-4 h-4" /> },
  'mirror': { label: '镜像同步', icon: <Copy className="w-4 h-4" /> },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return '从未';
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

export function SyncPairCard({
  pair,
  onStart,
  onStop,
  onToggle,
  onEdit,
  onDelete,
  onClick,
}: SyncPairCardProps) {
  const status = statusConfig[pair.status];
  const direction = directionConfig[pair.direction];
  const progress = pair.filesTotal > 0 ? (pair.filesSynced / pair.filesTotal) * 100 : 0;

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
        pair.status === 'error' ? 'border-red-200' : 'border-slate-100 hover:border-blue-200'
      } ${!pair.enabled ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-slate-800 text-base truncate">{pair.name}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bg} shrink-0`}>
              {status.icon}
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0" onClick={e => e.stopPropagation()}>
            {pair.status === 'syncing' ? (
              <button
                onClick={onStop}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="停止同步"
              >
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onStart}
                disabled={!pair.enabled}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="立即同步"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="编辑"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paths */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs text-slate-400 w-6 shrink-0 font-medium">源</span>
            <span className="text-slate-600 bg-slate-50 rounded px-2 py-0.5 font-mono text-xs truncate flex-1">
              {pair.sourcePath}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs text-slate-400 w-6 shrink-0 font-medium">目标</span>
            <span className="text-slate-600 bg-slate-50 rounded px-2 py-0.5 font-mono text-xs truncate flex-1">
              {pair.destPath}
            </span>
          </div>
        </div>

        {/* Direction & Schedule */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            {direction.icon}
            {direction.label}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {pair.schedule === 'manual' ? '手动' :
             pair.schedule === 'realtime' ? '实时' :
             pair.schedule === '5min' ? '每5分钟' :
             pair.schedule === '15min' ? '每15分钟' :
             pair.schedule === '30min' ? '每30分钟' :
             pair.schedule === '1hour' ? '每小时' :
             pair.schedule === '6hour' ? '每6小时' : '每天'}
          </span>
          <span className="text-slate-300">·</span>
          <span>上次: {formatRelativeTime(pair.lastSync)}</span>
        </div>

        {/* Progress */}
        {pair.status === 'syncing' && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{pair.filesSynced} / {pair.filesTotal} 文件</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <div className="text-xs text-slate-400">
            {formatBytes(pair.bytesSynced)} / {formatBytes(pair.bytesTotal)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">启用</span>
            <button
              onClick={onToggle}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                pair.enabled ? 'bg-blue-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
                  pair.enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {pair.status === 'error' && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg p-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>同步失败，请检查目标路径是否可访问</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}
