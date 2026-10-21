import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, HeartHandshake, PhoneCall, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 shrink-0">
                <Image
                  src="/Logo SMK.jpeg"
                  alt="Logo SMK IT Baitul Aziz"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  SMK IT <span className="text-orange-400">Baitul Aziz</span>
                </span>
                <p className="text-xs text-orange-300 font-bold">Saluran Aspirasi &amp; Pengaduan Terpadu</p>
              </div>
            </div>
            <p className="text-sm text-slate-200 max-w-md leading-relaxed">
              Membangun saluran komunikasi dua arah yang terstruktur untuk mengumpulkan, mengklasifikasi, dan menindaklanjuti aspirasi dari siswa, orang tua, dan masyarakat kepada manajemen SMK IT Baitul Aziz.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-orange-400/50 text-xs text-orange-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Jaminan Privasi Penuh & Kerahasiaan Pelapor Anonim</span>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Navigasi Layanan
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-200">
              <li>
                <Link href="/buat-aspirasi" className="hover:text-orange-400 transition font-medium">Kirim Aspirasi Baru</Link>
              </li>
              <li>
                <Link href="/lacak" className="hover:text-orange-400 transition font-medium">Cek Status Tiket Aduan</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-400 transition font-medium">Login Petugas Sekolah</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-400 transition font-medium">Portal Manajemen</Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Layanan Khusus */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Layanan Bantuan & BK
            </h4>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-300 font-medium">Lokasi Kampus</p>
                  <p className="font-bold text-white">SMK IT Baitul Aziz</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-300 font-medium">Layanan Informasi / Satgas</p>
                  <p className="font-bold text-white">Sekretariat Hubin & Kesiswaan</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-300 font-medium">Konseling Siswa</p>
                  <p className="font-bold text-white">Ruang Bimbingan Konseling (BK)</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© 2026 SMK IT Baitul Aziz - Sistem Saluran Aspirasi & Pengaduan Terpadu.</p>
          <p className="text-orange-300 font-semibold">Mewujudkan Sekolah Terbuka, Transparan, dan Responsif</p>
        </div>
      </div>
    </footer>
  );
}
