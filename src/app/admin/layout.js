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

  const isSystemAdmin = user && (
    profile?.is_admin === true ||
    (BOOTSTRAP_EMAILS.length > 0 && BOOTSTRAP_EMAILS.includes(user.email))
  );
  const isCourseAdmin = isSystemAdmin || (user && profile?.is_course_admin === true);
  const isShopAdmin   = isSystemAdmin || (user && profile?.is_shop_admin === true);
  const canAccess     = isSystemAdmin || isCourseAdmin || isShopAdmin;

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && profile !== undefined && !canAccess) router.push('/');
  }, [loading, user, profile, canAccess, router]);

  if (loading || (user && profile === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !canAccess) return null;

  const tabs = [
    isSystemAdmin && { href: '/admin/users',   label: '帳號管理' },
    isCourseAdmin && { href: '/admin/courses',  label: '課程管理' },
    isShopAdmin   && { href: '/admin/shops',    label: '店家管理' },
  ].filter(Boolean);

  const roleLabel = isSystemAdmin ? '系統管理員'
    : [isCourseAdmin && '課程', isShopAdmin && '商家'].filter(Boolean).join('＋') + '管理員';

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
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block">{roleLabel}</span>
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">← 回前台</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
