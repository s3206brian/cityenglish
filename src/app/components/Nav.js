'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, supabase } = useAuth();
  const BOOTSTRAP_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
  const isAdmin = user && (
    profile?.is_admin === true ||
    (BOOTSTRAP_EMAILS.length > 0 && BOOTSTRAP_EMAILS.includes(user.email))
  );

  const links = [
    { href: '/', label: '首頁' },
    { href: '/cities/taitung', label: '探索城市' },
    { href: '/shops', label: '🏪 英語店家' },
    { href: '/courses', label: '🎬 課程' },
    { href: '/leaderboard/global', label: '🏆 排行榜' },
    { href: '/progress', label: '我的進度' },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-blue-600 text-lg tracking-tight">
          CityEnglish
        </Link>

        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hidden sm:block ${
                pathname === l.href ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {l.label}
            </Link>
          ))}

          {loading && (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          )}

          {!loading && !user && (
            <Link
              href="/login"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
            >
              登入
            </Link>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || ''}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              {isAdmin && (
                <Link
                  href="/admin/courses"
                  className="text-xs text-gray-400 hover:text-blue-600 transition hidden sm:block"
                >
                  管理
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="text-xs text-gray-400 hover:text-gray-700 transition hidden sm:block"
              >
                登出
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
