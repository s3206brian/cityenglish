'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAdmin = user && (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(user.email));

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && !isAdmin) router.push('/');
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <Link href="/admin/courses" className="font-bold text-gray-800 text-sm">管理後台</Link>
        <span className="text-gray-300">/</span>
        <Link href="/admin/courses" className="text-sm text-gray-500 hover:text-gray-800 transition">課程管理</Link>
        <div className="ml-auto">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">← 回前台</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
