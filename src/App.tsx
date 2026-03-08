import { useState } from 'react';
import { useFolderSync } from './hooks/useFolderSync';
import { SyncPairCard } from './components/SyncPairCard';
import { AddEditPairModal } from './components/AddEditPairModal';
import { SyncLogs } from './components/SyncLogs';
import { Settings } from './components/Settings';
import { Dashboard } from './components/Dashboard';
import type { SyncPair } from './types';
import {
  LayoutDashboard,
  FolderSync,
  ScrollText,
  Settings2,
  Plus,
  Folders,
  AlertCircle,
} from 'lucide-react';

type Tab = 'dashboard' | 'pairs' | 'logs' | 'settings';

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: '概览', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'pairs', label: '同步任务', icon: <Folders className="w-5 h-5" /> },
  { id: 'logs', label: '同步日志', icon: <ScrollText className="w-5 h-5" /> },
  { id: 'settings', label: '设置', icon: <Settings2 className="w-5 h-5" /> },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [editingPair, setEditingPair] = useState<SyncPair | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
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
  } = useFolderSync();

  const errorCount = pairs.filter(p => p.status === 'error').length;
  const syncingCount = pairs.filter(p => p.status === 'syncing').length;

  const handleOpenAdd = () => {
    setEditingPair(null);
    setShowModal(true);
  };

  const handleOpenEdit = (pair: SyncPair) => {
    setEditingPair(pair);
    setShowModal(true);
  };

  const handleSave = (data: Omit<SyncPair, 'id' | 'status' | 'lastSync' | 'nextSync' | 'filesTotal' | 'filesSynced' | 'bytesTotal' | 'bytesSynced'>) => {
    if (editingPair) {
      updatePair(editingPair.id, data);
    } else {
      addPair(data);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deletePair(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <FolderSync className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-base leading-tight">FolderSync</div>
              <div className="text-xs text-slate-400 leading-tight">文件夹同步工具</div>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        {(syncingCount > 0 || errorCount > 0) && (
          <div className="px-4 py-3 space-y-1.5">
            {syncingCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                {syncingCount} 个任务同步中
              </div>
            )}
            {errorCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorCount} 个任务出错
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'logs' && logs.length > 0 && (
                <span className="ml-auto text-xs bg-slate-200 text-slate-500 rounded-full px-1.5 py-0.5 min-w-5 text-center">
                  {logs.length > 99 ? '99+' : logs.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Add Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleOpenAdd}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            新建同步任务
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <Dashboard pairs={pairs} />
          )}

          {/* Sync Pairs Tab */}
          {activeTab === 'pairs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-800">同步任务</h1>
                  <p className="text-sm text-slate-500 mt-0.5">管理您的文件夹同步配置</p>
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  新建任务
                </button>
              </div>

              {pairs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Folders className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-600 mb-2">暂无同步任务</h3>
                  <p className="text-sm text-slate-400 mb-6">点击"新建任务"开始配置您的第一个文件夹同步任务</p>
                  <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    新建同步任务
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pairs.map(pair => (
                    <SyncPairCard
                      key={pair.id}
                      pair={pair}
                      onStart={() => startSync(pair.id)}
                      onStop={() => stopSync(pair.id)}
                      onToggle={() => togglePair(pair.id)}
                      onEdit={() => handleOpenEdit(pair)}
                      onDelete={() => handleDelete(pair.id)}
                      onClick={() => handleOpenEdit(pair)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <SyncLogs logs={logs} onClear={clearLogs} />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Settings settings={settings} onUpdate={updateSettings} />
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <AddEditPairModal
          pair={editingPair}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeletingId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">确认删除</h3>
              <p className="text-sm text-slate-500 mb-6">
                此操作将删除同步任务"<strong>{pairs.find(p => p.id === deletingId)?.name}</strong>"，无法撤销。
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
