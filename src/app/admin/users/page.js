'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '../../components/AuthProvider';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useAuth();
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleAdmin(profile) {
    if (profile.id === currentUser?.id) {
      alert('無法修改自己的管理員狀態');
      return;
    }
    setUpdating(profile.id);
    await supabase
      .from('profiles')
      .update({ is_admin: !profile.is_admin })
      .eq('id', profile.id);
    await load();
    setUpdating(null);
  }

  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.is_admin).length;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">帳號管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            共 {users.length} 位用戶 · {adminCount} 位管理員
          </p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋 email 或名稱..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 w-56"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">用戶</th>
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">加入時間</th>
                <th className="text-center text-xs text-gray-500 font-medium px-5 py-3">管理員</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                    {search ? '沒有符合的用戶' : '還沒有用戶'}
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <img
                            src={u.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                            {(u.display_name || u.email || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {u.display_name || '（未設定名稱）'}
                          </p>
                          {u.id === currentUser?.id && (
                            <span className="text-xs text-blue-500">（你）</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('zh-TW') : '—'}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleAdmin(u)}
                        disabled={updating === u.id || u.id === currentUser?.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-40 ${
                          u.is_admin ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        title={u.id === currentUser?.id ? '無法修改自己的管理員狀態' : (u.is_admin ? '取消管理員' : '設為管理員')}
                      >
                        {updating === u.id ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </span>
                        ) : (
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            u.is_admin ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        管理員可進入後台管理課程與帳號。無法修改自己的管理員狀態。
      </p>
    </main>
  );
}
