'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTopOnNavigate — inner component yang menggunakan usePathname.
 * Harus dibungkus Suspense karena usePathname() bersifat dinamis di Next.js 16.
 */
function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    // Setiap navigasi halaman (termasuk refresh): langsung scroll ke atas
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/**
 * ScrollRestoreGuard
 *
 * Komponen ini memastikan:
 * 1. Browser tidak menyimpan posisi scroll lama saat halaman di-refresh
 *    (mematikan scroll restoration otomatis browser)
 * 2. Setiap kali rute berubah ATAU halaman di-refresh, posisi scroll
 *    langsung kembali ke paling atas (top: 0)
 *
 * Dipasang satu kali di root layout agar berlaku untuk semua halaman.
 */
export default function ScrollRestoreGuard() {
  useEffect(() => {
    // Nonaktifkan perilaku default browser yang mengingat posisi scroll
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <Suspense fallback={null}>
      <ScrollToTopOnNavigate />
    </Suspense>
  );
}
