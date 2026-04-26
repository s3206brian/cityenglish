'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '../../components/AuthProvider';

const ROLES = [
  { key: 'is_admin',         label: '系統管理員', color: 'blue',   desc: '可存取所有後台功能' },
  { key: 'is_course_admin',  label: '課程管理員', color: 'purple', desc: '管理課程、認證學員' },
  { key: 'is_shop_admin',    label: '商家管理員', color: 'amber',  desc: '審核與編輯店家資料' },
];

function RoleToggle({ value, disabled, loading, onChange, color }) {
  const colors = {
    blue:   'bg-blue-600',
    purple: 'bg-purple-600',
    amber:  'bg-amber-500',
  };
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-40 ${value ? colors[color] : 'bg-gray-200'}`}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </span>
      ) : (
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      )}
    </button>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // { id, key }
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

  async function toggleRole(profile, roleKey) {
    if (profile.id === currentUser?.id && roleKey === 'is_admin') {
      alert('無法修改自己的系統管理員狀態');
      return;
    }
    setUpdating({ id: profile.id, key: roleKey });
    await supabase
      .from('profiles')
      .update({ [roleKey]: !profile[roleKey] })
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
  const courseAdminCount = users.filter(u => u.is_course_admin).length;
  const shopAdminCount = users.filter(u => u.is_shop_admin).length;

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">帳號管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            共 {users.length} 位用戶 · 系統管理員 {adminCount} · 課程管理員 {courseAdminCount} · 商家管理員 {shopAdminCount}
          </p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋 email 或名稱..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 w-56"
        />
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {ROLES.map(r => (
          <div key={r.key} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${r.color === 'blue' ? 'bg-blue-600' : r.color === 'purple' ? 'bg-purple-600' : 'bg-amber-500'}`} />
            <span className="text-sm font-medium text-gray-700">{r.label}</span>
            <span className="text-xs text-gray-400">{r.desc}</span>
          </div>
        ))}
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
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3 hidden sm:table-cell">Email</th>
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3 hidden md:table-cell">加入時間</th>
                <th className="text-center text-xs text-blue-500 font-medium px-3 py-3">系統</th>
                <th className="text-center text-xs text-purple-500 font-medium px-3 py-3">課程</th>
                <th className="text-center text-xs text-amber-500 font-medium px-3 py-3">商家</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                    {search ? '沒有符合的用戶' : '還沒有用戶'}
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-100" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                            {(u.display_name || u.email || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{u.display_name || '（未設定名稱）'}</p>
                          {u.id === currentUser?.id && <span className="text-xs text-blue-500">（你）</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">{u.email}</td>
                    <td className="px-5 py-3 text-sm text-gray-400 hidden md:table-cell">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('zh-TW') : '—'}
                    </td>
                    {ROLES.map(role => (
                      <td key={role.key} className="px-3 py-3 text-center">
                        <RoleToggle
                          value={!!u[role.key]}
                          color={role.color}
                          disabled={updating?.id === u.id || (u.id === currentUser?.id && role.key === 'is_admin')}
                          loading={updating?.id === u.id && updating?.key === role.key}
                          onChange={() => toggleRole(u, role.key)}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
