'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { getStoredSession, clearSession, AdminUser } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const session = getStoredSession();
    setCurrentUser(session);
  }, [pathname]);

  const handleLogout = () => {
    if (confirm('Keluar dari akun petugas?')) {
      clearSession();
      setCurrentUser(null);
      router.push('/');
    }
  };

  const baseLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/buat-aspirasi', label: 'Kirim Aspirasi' },
    { href: '/lacak', label: 'Lacak Tiket' }
  ];

  const adminLinks = currentUser ? [
    { href: '/aspirasi-publik', label: 'Aspirasi Publik' },
    { href: '/admin', label: 'Portal Petugas' }
  ] : [];

  const navLinks = [...baseLinks, ...adminLinks];

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-orange-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & School Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/Logo SMK.jpeg"
                alt="Logo SMK IT Baitul Aziz"
                width={48}
                height={48}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-950 leading-tight">
                SMK IT Baitul Aziz
              </span>
              <span className="text-xs text-orange-700 font-bold tracking-wide">
                Portal Aspirasi & Layanan Terpadu
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links dengan kontras tinggi */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm transition-all ${isActive
                      ? 'border border-orange-300 bg-orange-100/80 text-orange-950 font-bold rounded-full shadow-xs'
                      : 'text-slate-800 hover:text-orange-700 font-semibold rounded-full hover:bg-orange-50'
                    }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Login / Admin User Badge */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-300 text-xs font-bold text-orange-950 hover:bg-orange-200 transition"
                >
                  <UserCheck className="w-4 h-4 text-orange-700" />
                  <span>{currentUser.name.split(' ')[0]} ({currentUser.username})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full border border-slate-300 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 transition"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/25 active:scale-95 transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                <span>Login Petugas</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!currentUser ? (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm"
              >
                Login
              </Link>
            ) : (
              <Link
                href="/admin"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-orange-950 bg-orange-100 border border-orange-300"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-orange-50 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-orange-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm ${isActive
                    ? 'bg-orange-100 text-orange-950 font-bold border border-orange-300'
                    : 'text-slate-800 font-semibold hover:bg-orange-50'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-200">
            {currentUser ? (
              <div className="flex items-center justify-between p-2">
                <span className="text-xs font-bold text-slate-900">Petugas: {currentUser.name}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs font-bold text-red-700 hover:underline"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                <span>Login Petugas Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
