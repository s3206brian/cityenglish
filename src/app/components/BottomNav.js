'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

const NAV_ITEMS = [
  {
    href: '/',
    label: '首頁',
    exact: true,
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/cities/taitung',
    label: '城市',
    match: '/cities',
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/leaderboard/taitung',
    label: '排行榜',
    match: '/leaderboard',
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/progress',
    label: '我的進度',
    match: '/progress',
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // 在練習頁面隱藏，避免擋住錄音按鈕
  if (pathname?.startsWith('/practice/')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur border-t border-gray-100 safe-area-pb">
      <div className="grid grid-cols-4 h-16">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.match || item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-60"
            >
              {item.icon(active)}
              <span className={`text-[10px] font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {/* 未登入時在「我的進度」顯示提示點 */}
              {item.match === '/progress' && !user && (
                <span className="absolute top-2 w-1.5 h-1.5 bg-red-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
