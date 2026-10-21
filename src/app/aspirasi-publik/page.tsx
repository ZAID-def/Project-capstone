'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Search, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { getAllTickets } from '@/lib/storage';
import { AspirationTicket, AspirationCategory } from '@/types';
import { CATEGORY_DETAILS } from '@/lib/nlpClassifier';
import AdminGuard from '@/components/AdminGuard';

export default function AspirasiPublikPage() {
  const [tickets, setTickets] = useState<AspirationTicket[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const all = getAllTickets().filter(t => t.privacy === 'publik');
    setTickets(all);
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesCat = selectedCategory === 'semua' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'semua' || 
      (selectedStatus === 'selesai' ? t.status === 'selesai' : t.status !== 'selesai');
    const matchesQuery = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesStatus && matchesQuery;
  });

  return (
    <AdminGuard
      title="Akses Khusus Petugas Sekolah"
      description="Sesuai kebijakan SMK IT Baitul Aziz, katalog rekapitulasi aspirasi ini diproteksi dan hanya dapat diakses oleh staf/petugas terdaftar."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-950 border border-orange-300">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-700" />
            <span>Katalog Aspirasi Terdaftar (Akses Terverifikasi)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Katalog Aspirasi <span className="text-orange-600">Publik</span>
          </h1>
          <div className="w-14 h-1 bg-orange-500 rounded-full sm:mx-0 mx-auto" />
          <p className="text-sm text-slate-700 font-medium max-w-2xl pt-1">
            Daftar aspirasi dan masukan publik yang telah diverifikasi dan ditindaklanjuti oleh unit penanggung jawab SMK IT Baitul Aziz.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-200 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-orange-600 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari aspirasi berdasarkan judul, fasilitas, atau kode..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-orange-300 bg-white text-sm font-semibold text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 shrink-0">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 rounded-full border border-orange-300 bg-orange-50/50 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="semua">Semua Status</option>
                <option value="proses">Sedang Diproses</option>
                <option value="selesai">Sudah Tuntas (Selesai)</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('semua')}
              className={`px-4 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
                selectedCategory === 'semua'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-orange-100 hover:text-orange-950 border border-slate-200'
              }`}
            >
              Semua Kategori ({tickets.length})
            </button>
            
            {(Object.keys(CATEGORY_DETAILS) as AspirationCategory[]).map((catKey) => {
              const count = tickets.filter(t => t.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-4 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
                    selectedCategory === catKey
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-800 hover:bg-orange-100 hover:text-orange-950 border border-slate-200'
                  }`}
                >
                  {CATEGORY_DETAILS[catKey].label} ({count})
                </button>
              );
            })}
          </div>

        </div>

        {/* Ticket Grid */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-orange-200 space-y-3">
            <Layers className="w-10 h-10 text-orange-400 mx-auto" />
            <h3 className="text-base font-black text-slate-950">Tidak Ada Aspirasi yang Cocok</h3>
            <p className="text-xs text-slate-700 font-medium max-w-sm mx-auto">
              Coba ubah kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => {
              const cat = CATEGORY_DETAILS[ticket.category];
              const isCompleted = ticket.status === 'selesai';

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-3xl border border-orange-200 p-6 shadow-2xs hover:shadow-sm transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    
                    {/* Category & Status Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeBg}`}>
                        {cat.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCompleted 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-orange-100 text-orange-950 border border-orange-300'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <Clock className="w-3 h-3 text-orange-700" />}
                        {isCompleted ? 'Selesai' : 'Dalam Tindak Lanjut'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-extrabold text-base text-slate-950 line-clamp-2 leading-snug">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-slate-800 font-medium line-clamp-3 leading-relaxed">
                      {ticket.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-1.5 pt-1 text-xs text-slate-700 font-medium">
                      {ticket.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          <span className="truncate">{ticket.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                  </div>

                  {/* Footer Card */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                      <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                      <span>{ticket.responses.length} Respon</span>
                    </div>

                    <Link
                      href={`/lacak/${ticket.ticketCode}`}
                      className="inline-flex items-center gap-1 text-xs font-black text-orange-700 hover:text-orange-800"
                    >
                      <span>Buka Percakapan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </AdminGuard>
  );
}
