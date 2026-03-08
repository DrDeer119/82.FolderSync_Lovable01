import type { SyncPair } from '../types';
import { CheckCircle, XCircle, RefreshCw, Pause, Clock, HardDrive, FileText, Activity } from 'lucide-react';

interface DashboardProps {
  pairs: SyncPair[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function Dashboard({ pairs }: DashboardProps) {
  const totalPairs = pairs.length;
  const activePairs = pairs.filter(p => p.enabled).length;
  const syncingPairs = pairs.filter(p => p.status === 'syncing').length;
  const errorPairs = pairs.filter(p => p.status === 'error').length;
  const successPairs = pairs.filter(p => p.status === 'success').length;
  const totalFiles = pairs.reduce((sum, p) => sum + p.filesTotal, 0);
  const totalBytes = pairs.reduce((sum, p) => sum + p.bytesTotal, 0);

  const stats = [
    {
      label: '同步任务',
      value: `${activePairs}/${totalPairs}`,
      subLabel: '已启用',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: '正在同步',
      value: syncingPairs,
      subLabel: '个任务',
      icon: <RefreshCw className={`w-5 h-5 ${syncingPairs > 0 ? 'animate-spin' : ''}`} />,
      color: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      label: '同步完成',
      value: successPairs,
      subLabel: '个任务',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: '同步错误',
      value: errorPairs,
      subLabel: '个任务',
      icon: <XCircle className="w-5 h-5" />,
      color: 'bg-red-500',
      lightBg: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.lightBg} ${stat.textColor} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label} · {stat.subLabel}</div>
          </div>
        ))}
      </div>

      {/* Storage Overview */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-500" />
          存储概览
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-2xl font-bold text-slate-800">{formatBytes(totalBytes)}</div>
            <div className="text-xs text-slate-500 mt-1">总管理数据量</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-2xl font-bold text-slate-800">{totalFiles.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">总文件数量</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          任务状态一览
        </h3>
        <div className="space-y-3">
          {pairs.map(pair => {
            const progress = pair.filesTotal > 0 ? (pair.filesSynced / pair.filesTotal) * 100 : 0;
            return (
              <div key={pair.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  pair.status === 'syncing' ? 'bg-blue-500' :
                  pair.status === 'success' ? 'bg-green-500' :
                  pair.status === 'error' ? 'bg-red-500' :
                  pair.status === 'paused' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <span className="text-sm text-slate-700 w-28 shrink-0 truncate">{pair.name}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pair.status === 'error' ? 'bg-red-400' :
                      pair.status === 'syncing' ? 'bg-blue-500' :
                      pair.status === 'paused' ? 'bg-amber-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-8 text-right">{Math.round(progress)}%</span>
                <div className="w-5 h-5 shrink-0">
                  {pair.status === 'syncing' && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
                  {pair.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {pair.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                  {pair.status === 'paused' && <Pause className="w-4 h-4 text-amber-500" />}
                  {pair.status === 'idle' && <Clock className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
