import type { AppSettings } from '../types';
import { Bell, Moon, Monitor, Sun, ChevronDown } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-slate-200'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${value ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

export function Settings({ settings, onUpdate }: SettingsProps) {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">设置</h2>
        <p className="text-sm text-slate-500 mt-0.5">管理应用偏好设置</p>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-700">外观</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {/* Theme */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-slate-700">主题</div>
              <div className="text-xs text-slate-500 mt-0.5">选择界面主题</div>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {([
                { value: 'light', icon: <Sun className="w-4 h-4" />, label: '浅色' },
                { value: 'dark', icon: <Moon className="w-4 h-4" />, label: '深色' },
                { value: 'system', icon: <Monitor className="w-4 h-4" />, label: '系统' },
              ] as const).map(t => (
                <button
                  key={t.value}
                  onClick={() => onUpdate({ theme: t.value })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    settings.theme === t.value
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-slate-700">语言</div>
              <div className="text-xs text-slate-500 mt-0.5">界面显示语言</div>
            </div>
            <div className="relative">
              <select
                value={settings.language}
                onChange={e => onUpdate({ language: e.target.value as 'zh' | 'en' })}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-700 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            通知
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-slate-700">启用通知</div>
              <div className="text-xs text-slate-500 mt-0.5">同步完成或出错时发送系统通知</div>
            </div>
            <Toggle value={settings.notifications} onChange={v => onUpdate({ notifications: v })} />
          </div>
        </div>
      </div>

      {/* System */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-700">系统</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-slate-700">开机自启动</div>
              <div className="text-xs text-slate-500 mt-0.5">系统启动时自动运行 FolderSync</div>
            </div>
            <Toggle value={settings.startWithSystem} onChange={v => onUpdate({ startWithSystem: v })} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-slate-700">最小化到托盘</div>
              <div className="text-xs text-slate-500 mt-0.5">关闭窗口时最小化到系统托盘</div>
            </div>
            <Toggle value={settings.minimizeToTray} onChange={v => onUpdate({ minimizeToTray: v })} />
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-700">性能</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-slate-700">最大并发同步数</div>
              <div className="text-xs text-slate-500 mt-0.5">同时运行的同步任务数量上限</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdate({ maxConcurrentSyncs: Math.max(1, settings.maxConcurrentSyncs - 1) })}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-lg leading-none flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold text-slate-700">{settings.maxConcurrentSyncs}</span>
              <button
                onClick={() => onUpdate({ maxConcurrentSyncs: Math.min(10, settings.maxConcurrentSyncs + 1) })}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-lg leading-none flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-slate-700">日志保留天数</div>
              <div className="text-xs text-slate-500 mt-0.5">超过此天数的日志将自动清理</div>
            </div>
            <div className="relative">
              <select
                value={settings.logRetentionDays}
                onChange={e => onUpdate({ logRetentionDays: Number(e.target.value) })}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400"
              >
                <option value={7}>7 天</option>
                <option value={14}>14 天</option>
                <option value={30}>30 天</option>
                <option value={60}>60 天</option>
                <option value={90}>90 天</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Version */}
      <div className="text-center text-xs text-slate-400 pb-4">
        FolderSync v1.0.0 · 轻量级文件夹同步工具
      </div>
    </div>
  );
}
