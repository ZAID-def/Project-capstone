'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function LacakIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setError('Masukkan kode tiket Anda');
      return;
    }
    router.push(`/lacak/${clean}`);
  };

  const sampleTickets = [
    { code: 'SMK-8X2K91', label: 'AC Lab Komputer RPL 2 Mati (Sarpras)' },
    { code: 'SMK-4M7P02', label: 'Laporan Dugaan Pemalakan Siswa (Kesiswaan & BK)' },
    { code: 'SMK-1V9Q33', label: 'Sosialisasi Magang PKL Industri TKJ (Akademik)' },
    { code: 'SMK-7K3N88', label: 'Alur Keringanan SPP / Bantuan PIP (Keuangan)' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mx-auto shadow-xs border border-orange-300">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Lacak Status <span className="text-orange-600">Aspirasi</span>
        </h1>
        <div className="w-14 h-1 bg-orange-500 mx-auto rounded-full" />
        <p className="text-sm text-slate-800 font-medium max-w-lg mx-auto pt-1">
          Masukkan kode tiket unik yang Anda peroleh saat mengirim aduan untuk memantau proses tindak lanjut dan berkomunikasi dengan manajemen SMK IT Baitul Aziz.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-200 shadow-sm space-y-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 border-l-3 border-orange-500 pl-2">
              Kode Unik Tiket
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-orange-600 absolute left-4 top-3.5" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="Misal: SMK-8X2K91"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-orange-300 bg-white text-base sm:text-lg font-mono font-black uppercase tracking-wider text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {error && <p className="text-xs text-red-600 font-bold mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md shadow-orange-500/25 transition"
          >
            Lacak Status Tiket
          </button>
        </form>

        {/* Demo Ticket Samples for Quick Testing */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            Contoh Kode Tiket Uji Coba (Klik untuk Lacak):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleTickets.map((t) => (
              <button
                key={t.code}
                type="button"
                onClick={() => router.push(`/lacak/${t.code}`)}
                className="p-3 rounded-2xl border border-orange-200 hover:border-orange-500 text-left text-xs bg-orange-50/60 hover:bg-orange-100 transition group flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-black text-orange-700 text-sm">{t.code}</span>
                  <p className="text-xs text-slate-800 font-medium truncate max-w-[220px]">{t.label}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Info Card */}
      <div className="p-5 rounded-2xl bg-orange-50 border border-orange-300 flex items-start gap-3.5 text-xs text-orange-950">
        <CheckCircle2 className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium text-slate-800">
          Tanggapan resmi dari tim sarpras, guru BK, waka kurikulum, atau tata usaha SMK IT Baitul Aziz akan langsung muncul di halaman tiket. Anda dapat memberikan respon klarifikasi balik tanpa harus login.
        </p>
      </div>

    </div>
  );
}
