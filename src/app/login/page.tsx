'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  User, 
  ArrowLeft, 
  AlertCircle, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { authenticate, getStoredSession } from '@/lib/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const current = getStoredSession();
    if (current) {
      router.push(redirectUrl);
    }
  }, [redirectUrl, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = authenticate(username, password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
      } else {
        setError(result.error || 'Autentikasi gagal');
        setLoading(false);
      }
    }, 400);
  };

  const fillQuickAccount = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(249,115,22,0.18),rgba(255,255,255,0))]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-orange-200 p-7 sm:p-9 shadow-lg shadow-orange-500/10 space-y-6">
          
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                <polygon points="50,4 94,32 78,88 22,88 6,32" fill="#0F766E" stroke="#1E293B" strokeWidth="3" />
                <polygon points="50,11 87,35 73,82 27,82 13,35" fill="#F59E0B" />
                <polygon points="50,17 81,38 69,76 31,76 19,38" fill="#0284C7" />
                <rect x="36" y="44" width="28" height="20" rx="3" fill="#FFFFFF" />
                <path d="M50 44 L50 64" stroke="#0284C7" strokeWidth="2" />
                <path d="M40 50 Q50 48 50 60 Q40 58 40 50" fill="#F97316" />
                <path d="M60 50 Q50 48 50 60 Q60 58 60 50" fill="#F97316" />
                <circle cx="50" cy="33" r="6" fill="#FDE047" stroke="#0F766E" strokeWidth="1.5" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Login <span className="text-orange-600">Petugas</span>
            </h1>
            <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium pt-1">
              Portal Manajemen & Verifikasi Aspirasi SMK IT Baitul Aziz
            </p>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-300 text-xs font-bold text-red-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Alert Success */}
          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-xs font-black text-emerald-950 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>Login berhasil! Mengalihkan ke portal...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 border-l-3 border-orange-500 pl-2">
                Username / Email Petugas
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-orange-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin atau email sekolah"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 border-l-3 border-orange-500 pl-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-orange-600 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md shadow-orange-500/25 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Portal'}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-orange-600" />
              Pilih Akun Demo Uji Coba:
            </span>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin', 'admin123')}
                className="w-full p-2.5 rounded-xl border border-orange-300 bg-orange-50/80 hover:bg-orange-100 text-left text-xs transition flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <strong className="text-orange-950 font-black">Super Admin</strong>: <code>admin</code> / <code>admin123</code>
                  <p className="text-[11px] text-slate-700 font-medium">Akses penuh seluruh divisi & aspirasi</p>
                </div>
                <span className="text-xs font-black text-orange-700 group-hover:underline">Gunakan</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('bk', 'bk123')}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-orange-50 text-left text-xs transition flex items-center justify-between group"
              >
                <div>
                  <strong className="text-slate-950 font-black">Guru BK</strong>: <code>bk</code> / <code>bk123</code>
                  <p className="text-[11px] text-slate-700 font-medium">Khusus kesiswaan & laporan bullying</p>
                </div>
                <span className="text-xs font-black text-orange-700 group-hover:underline">Gunakan</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('sarpras', 'sarpras123')}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-orange-50 text-left text-xs transition flex items-center justify-between group"
              >
                <div>
                  <strong className="text-slate-950 font-black">Tim Sarpras</strong>: <code>sarpras</code> / <code>sarpras123</code>
                  <p className="text-[11px] text-slate-700 font-medium">Fasilitas lab komputer, AC & gedung</p>
                </div>
                <span className="text-xs font-black text-orange-700 group-hover:underline">Gunakan</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
