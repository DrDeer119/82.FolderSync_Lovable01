import { useState } from 'react';
import type { SyncPair, SyncDirection, SyncSchedule } from '../types';
import { X, FolderOpen, ChevronDown } from 'lucide-react';

interface AddEditPairModalProps {
  pair?: SyncPair | null;
  onSave: (data: Omit<SyncPair, 'id' | 'status' | 'lastSync' | 'nextSync' | 'filesTotal' | 'filesSynced' | 'bytesTotal' | 'bytesSynced'>) => void;
  onClose: () => void;
}

const SCHEDULES: { value: SyncSchedule; label: string }[] = [
  { value: 'manual', label: '手动' },
  { value: 'realtime', label: '实时监控' },
  { value: '5min', label: '每 5 分钟' },
  { value: '15min', label: '每 15 分钟' },
  { value: '30min', label: '每 30 分钟' },
  { value: '1hour', label: '每小时' },
  { value: '6hour', label: '每 6 小时' },
  { value: '24hour', label: '每天' },
];

const DIRECTIONS: { value: SyncDirection; label: string; desc: string }[] = [
  { value: 'one-way', label: '单向同步', desc: '从源复制到目标，不删除目标中的额外文件' },
  { value: 'two-way', label: '双向同步', desc: '两个文件夹之间相互同步变更' },
  { value: 'mirror', label: '镜像同步', desc: '使目标完全镜像源（删除目标中多余文件）' },
];

export function AddEditPairModal({ pair, onSave, onClose }: AddEditPairModalProps) {
  const [name, setName] = useState(pair?.name ?? '');
  const [sourcePath, setSourcePath] = useState(pair?.sourcePath ?? '');
  const [destPath, setDestPath] = useState(pair?.destPath ?? '');
  const [direction, setDirection] = useState<SyncDirection>(pair?.direction ?? 'one-way');
  const [schedule, setSchedule] = useState<SyncSchedule>(pair?.schedule ?? 'manual');
  const [excludePatterns, setExcludePatterns] = useState(pair?.excludePatterns?.join('\n') ?? '');
  const [enabled, setEnabled] = useState(pair?.enabled ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '请输入同步任务名称';
    if (!sourcePath.trim()) errs.sourcePath = '请输入源文件夹路径';
    if (!destPath.trim()) errs.destPath = '请输入目标文件夹路径';
    if (sourcePath.trim() === destPath.trim()) errs.destPath = '源路径和目标路径不能相同';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      sourcePath: sourcePath.trim(),
      destPath: destPath.trim(),
      direction,
      schedule,
      enabled,
      excludePatterns: excludePatterns.split('\n').map(s => s.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-slate-800">
            {pair ? '编辑同步任务' : '新建同步任务'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">任务名称</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：文档备份"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                errors.name ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 focus:border-blue-400 focus:bg-blue-50/30'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Source Path */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">源文件夹</label>
            <div className="relative">
              <input
                type="text"
                value={sourcePath}
                onChange={e => setSourcePath(e.target.value)}
                placeholder="C:\Users\Admin\Documents"
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm font-mono outline-none transition-colors ${
                  errors.sourcePath ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 focus:border-blue-400 focus:bg-blue-50/30'
                }`}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-500 transition-colors">
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>
            {errors.sourcePath && <p className="mt-1 text-xs text-red-500">{errors.sourcePath}</p>}
          </div>

          {/* Dest Path */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">目标文件夹</label>
            <div className="relative">
              <input
                type="text"
                value={destPath}
                onChange={e => setDestPath(e.target.value)}
                placeholder="D:\Backup\Documents"
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm font-mono outline-none transition-colors ${
                  errors.destPath ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 focus:border-blue-400 focus:bg-blue-50/30'
                }`}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-500 transition-colors">
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>
            {errors.destPath && <p className="mt-1 text-xs text-red-500">{errors.destPath}</p>}
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">同步方向</label>
            <div className="space-y-2">
              {DIRECTIONS.map(d => (
                <label
                  key={d.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    direction === d.value ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="direction"
                    value={d.value}
                    checked={direction === d.value}
                    onChange={() => setDirection(d.value)}
                    className="mt-0.5 accent-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{d.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{d.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">同步频率</label>
            <div className="relative">
              <select
                value={schedule}
                onChange={e => setSchedule(e.target.value as SyncSchedule)}
                className="w-full px-3 py-2.5 pr-8 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400 appearance-none bg-white"
              >
                {SCHEDULES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Exclude Patterns */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              排除规则
              <span className="text-slate-400 font-normal ml-1">(每行一条，支持通配符)</span>
            </label>
            <textarea
              value={excludePatterns}
              onChange={e => setExcludePatterns(e.target.value)}
              placeholder={'*.tmp\nnode_modules\n~$*'}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-mono outline-none focus:border-blue-400 resize-none"
            />
          </div>

          {/* Enabled */}
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <div>
              <div className="text-sm font-medium text-slate-700">启用此任务</div>
              <div className="text-xs text-slate-500 mt-0.5">禁用后将停止自动同步</div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            {pair ? '保存更改' : '创建任务'}
          </button>
        </div>
      </div>
    </div>
  );
}
