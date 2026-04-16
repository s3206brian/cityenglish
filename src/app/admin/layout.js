'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';

const BOOTSTRAP_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

export default function AdminLayout({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 允許進入：profile.is_admin=true 或 email 在 bootstrap 清單中
  const isAdmin = user && (
    profile?.is_admin === true ||
    (BOOTSTRAP_EMAILS.length > 0 && BOOTSTRAP_EMAILS.includes(user.email))
  );

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && profile !== undefined && !isAdmin) router.push('/');
  }, [loading, user, profile, isAdmin, router]);

  if (loading || (user && profile === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const tabs = [
    { href: '/admin/courses', label: '課程管理' },
    { href: '/admin/users', label: '帳號管理' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-0 flex items-center gap-0">
        <Link href="/admin" className="font-bold text-gray-800 text-sm mr-6 py-4">管理後台</Link>
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-sm px-4 py-4 border-b-2 transition ${
              pathname.startsWith(tab.href)
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <div className="ml-auto">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">← 回前台</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
