'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, LogIn } from 'lucide-react';
import { getStoredSession, AdminUser } from '@/lib/auth';

interface AdminGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function AdminGuard({
  children,
  title = 'Akses Khusus Petugas & Manajemen',
  description = 'Halaman ini dilindungi dan hanya dapat diakses oleh administrator resmi SMK IT Baitul Aziz.'
}: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setCurrentUser(session);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-800 font-bold">Memverifikasi hak akses petugas...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mx-auto shadow-sm border border-orange-300">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-950">
            {title}
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full" />
          <p className="text-xs sm:text-sm text-slate-800 font-medium pt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 text-xs text-orange-950 text-left">
          <p className="font-black text-orange-900 mb-1 text-sm">Perlindungan Data Sekolah:</p>
          <p className="font-medium text-slate-800 leading-relaxed">
            Sesuai kebijakan tata kelola SMK IT Baitul Aziz, informasi aduan, data identitas, dan tindakan disposisi hanya dapat dikelola oleh staf berwenang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md shadow-orange-500/25 transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Login Petugas Sekarang</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-800 hover:bg-slate-100 text-sm font-bold transition border border-slate-300"
          >
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
