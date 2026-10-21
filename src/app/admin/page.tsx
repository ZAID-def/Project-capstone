'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  FileSpreadsheet, 
  Building2, 
  X, 
  Layers,
  LogOut,
  UserCheck,
  Trash2
} from 'lucide-react';
import { getAllTickets, updateTicketStatus, addTicketResponse, getSystemStats, deleteTicket } from '@/lib/storage';
import { AspirationTicket, TicketStatus } from '@/types';
import { CATEGORY_DETAILS, URGENCY_DETAILS } from '@/lib/nlpClassifier';
import { getStoredSession, clearSession, AdminUser } from '@/lib/auth';
import TimelineStatus from '@/components/TimelineStatus';
import TwoWayDiscussion from '@/components/TwoWayDiscussion';
import AdminGuard from '@/components/AdminGuard';
const SHORT_CATEGORY: Record<string, string> = {
  sarpras: 'Sarpras',
  akademik: 'Akademik',
  kesiswaan: 'Kesiswaan & BK',
  keuangan: 'Keuangan & TU',
  lingkungan: 'Hubin'
};

const SHORT_URGENCY: Record<string, string> = {
  darurat: 'Darurat',
  tinggi: 'Tinggi',
  sedang: 'Sedang',
  rendah: 'Rendah'
};

const STATUS_BADGES: Record<TicketStatus, { label: string; cls: string }> = {
  terkirim: { label: 'Terkirim', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
  diverifikasi: { label: 'Diverifikasi', cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  didisposisi: { label: 'Didisposisi', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
  ditindaklanjuti: { label: 'Diproses', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  selesai: { label: 'Selesai', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ditolak: { label: 'Ditolak', cls: 'bg-rose-50 text-rose-800 border-rose-200' }
};

export default function AdminPortalPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [tickets, setTickets] = useState<AspirationTicket[]>([]);
  const [stats, setStats] = useState(getSystemStats());
  const [selectedTicket, setSelectedTicket] = useState<AspirationTicket | null>(null);

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<string>('semua');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Disposisi & Status Modal State
  const [editStatus, setEditStatus] = useState<TicketStatus>('terkirim');
  const [editDept, setEditDept] = useState('');

  const refreshData = () => {
    const data = getAllTickets();
    setTickets(data);
    setStats(getSystemStats());
    const session = getStoredSession();
    if (session) setCurrentUser(session);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari akun petugas?')) {
      clearSession();
      router.push('/');
    }
  };

  const handleOpenDetail = (t: AspirationTicket) => {
    setSelectedTicket(t);
    setEditStatus(t.status);
    setEditDept(t.assignedDepartment || '');
  };

  const handleSaveDisposisi = () => {
    if (!selectedTicket) return;
    const updated = updateTicketStatus(selectedTicket.id, editStatus, editDept);
    if (updated) {
      setSelectedTicket({ ...updated });
      refreshData();
    }
  };

  const handleSendAdminReply = (message: string, senderName: string, isOfficial: boolean, isInternalNote: boolean) => {
    if (!selectedTicket) return;
    const updated = addTicketResponse(selectedTicket.id, {
      senderName,
      senderRole: currentUser?.roleLabel || senderName,
      message,
      isOfficial,
      isInternalNote
    });
    if (updated) {
      setSelectedTicket({ ...updated });
      refreshData();
    }
  };

  const handleDeleteTicket = (ticketId: string, ticketCode: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aspirasi [${ticketCode}]? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteTicket(ticketId);
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(null);
      }
      refreshData();
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchCat = categoryFilter === 'semua' || t.category === categoryFilter;
    const matchStatus = statusFilter === 'semua' || t.status === statusFilter;
    const matchUrgency = urgencyFilter === 'semua' || t.urgency === urgencyFilter;
    const matchQuery = searchQuery === '' || 
      t.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.senderName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchStatus && matchUrgency && matchQuery;
  });

  return (
    <AdminGuard
      title="Portal Manajemen SMK IT Baitul Aziz"
      description="Silakan login sebagai administrator atau tim manajemen sekolah untuk mengakses dashboard disposisi aspirasi."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Header & Dashboard Branding */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-950 border border-orange-300">
              <ShieldCheck className="w-4 h-4 text-orange-700" />
              <span>Manajemen SMK IT Baitul Aziz</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              Portal Penanganan <span className="text-orange-600">Aspirasi Terpadu</span>
            </h1>
            <div className="w-12 h-1 bg-orange-500 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium pt-1">
              Verifikasi aduan masuk, disposisi ke waka terkait, dan kirim tanggapan resmi dua arah.
            </p>
          </div>

          {/* User Account Info & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {currentUser && (
              <div className="px-4 py-2 rounded-2xl bg-orange-100 border border-orange-300 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <p className="font-black text-slate-950">{currentUser.name}</p>
                  <p className="text-[11px] text-orange-950 font-bold">{currentUser.roleLabel}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (confirm('Ekspor data rekapitulasi ke format CSV/Excel?')) {
                  alert('File laporan rekapitulasi aspirasi SMK IT Baitul Aziz berhasil diunduh.');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-orange-300 bg-white text-xs sm:text-sm font-black text-slate-900 hover:bg-orange-50 transition shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-orange-700" />
              <span>Ekspor Rekap</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-red-300 bg-red-100 text-xs font-black text-red-900 hover:bg-red-200 transition"
              title="Keluar dari akun admin"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Aduan</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">{stats.total}</div>
            <span className="text-xs text-slate-600 font-medium">Semua laporan terdaftar</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-2xs">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Perlu Tindak Lanjut</span>
            <div className="text-2xl sm:text-3xl font-black text-orange-700 mt-1">{stats.proses + stats.baru}</div>
            <span className="text-xs text-slate-600 font-medium">Dalam proses pengerjaan</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-2xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tuntas / Selesai</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{stats.selesai}</div>
            <span className="text-xs text-emerald-800 font-black">{stats.completionRate}% Tingkat Sukses</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-2xs">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Prioritas Mendesak</span>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-1 flex items-center gap-1.5">
              {stats.darurat}
              {stats.darurat > 0 && <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />}
            </div>
            <span className="text-xs text-rose-700 font-bold">Bullying / Fasilitas Bahaya</span>
          </div>

          <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-orange-100 uppercase tracking-wider">Klasifikasi Terpadu</span>
            <div className="text-xl font-black flex items-center gap-1.5 mt-1">
              <Layers className="w-5 h-5 text-white" />
              <span>Aktif & Akurat</span>
            </div>
            <span className="text-xs text-orange-100 font-medium">5 Bidang Sekolah</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-white border border-orange-200 shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-orange-600 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan kode tiket, judul aspirasi, atau nama pelapor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-orange-300 bg-white text-xs sm:text-sm font-semibold text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-full border border-orange-300 bg-orange-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="semua">Semua Kategori</option>
              <option value="sarpras">Sarana & Prasarana</option>
              <option value="akademik">Akademik & Kurikulum</option>
              <option value="kesiswaan">Kesiswaan & BK</option>
              <option value="keuangan">Keuangan & TU</option>
              <option value="lingkungan">Hubin & Lingkungan</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full border border-orange-300 bg-orange-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="semua">Semua Status</option>
              <option value="terkirim">Baru Masuk</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="didisposisi">Didisposisi</option>
              <option value="ditindaklanjuti">Dalam Tindak Lanjut</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-4 py-2 rounded-full border border-orange-300 bg-orange-50/50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="semua">Semua Urgensi</option>
              <option value="darurat">Mendesak/Darurat</option>
              <option value="tinggi">Prioritas Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
            </select>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-3xl border border-orange-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-orange-100 border-b border-orange-300 text-orange-950 uppercase font-black text-[11px] tracking-wider">
                <tr>
                  <th className="px-3 py-3.5 whitespace-nowrap">Kode & Tanggal</th>
                  <th className="px-3 py-3.5 min-w-[170px]">Judul Aspirasi</th>
                  <th className="px-2.5 py-3.5 whitespace-nowrap">Kategori</th>
                  <th className="px-2.5 py-3.5 whitespace-nowrap">Urgensi</th>
                  <th className="px-2.5 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-2.5 py-3.5 min-w-[120px] max-w-[160px]">Disposisi Ke</th>
                  <th className="px-3 py-3.5 text-right whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-700 font-bold">
                      Tidak ada tiket aspirasi yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => {
                    const cat = CATEGORY_DETAILS[t.category];
                    const urgency = URGENCY_DETAILS[t.urgency];
                    const statusInfo = STATUS_BADGES[t.status] || { label: t.status, cls: 'bg-slate-100 text-slate-800 border-slate-200' };

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-orange-50/70 transition cursor-pointer"
                        onClick={() => handleOpenDetail(t)}
                      >
                        {/* Code */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="font-mono font-black text-orange-800 text-xs">
                            {t.ticketCode}
                          </span>
                          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-3 py-3 max-w-[200px] lg:max-w-[260px]">
                          <div className="font-extrabold text-slate-950 text-xs sm:text-sm truncate" title={t.title}>
                            {t.title}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium truncate" title={`${t.senderName} (${t.senderRole}) • ${t.privacy}`}>
                            {t.senderName} ({t.senderRole}) • <span className="font-bold">{t.privacy}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-2.5 py-3 whitespace-nowrap">
                          <span 
                            className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-bold ${cat.badgeBg}`}
                            title={cat.label}
                          >
                            {SHORT_CATEGORY[t.category] || cat.label}
                          </span>
                        </td>

                        {/* Urgency */}
                        <td className="px-2.5 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${urgency.badgeBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${urgency.dotColor}`} />
                            {SHORT_URGENCY[t.urgency] || urgency.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-2.5 py-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-bold ${statusInfo.cls}`}>
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Disposisi */}
                        <td className="px-2.5 py-3 text-slate-700 font-semibold text-[11px] max-w-[150px] truncate" title={t.assignedDepartment || '-'}>
                          {t.assignedDepartment || '-'}
                        </td>

                        {/* Action */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(t);
                              }}
                              className="px-3 py-1.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 font-black text-xs transition shadow-2xs"
                            >
                              Tindak Lanjut
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTicket(t.id, t.ticketCode);
                              }}
                              className="p-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                              title="Hapus Aspirasi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL & ACTION MODAL */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full border border-orange-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-orange-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
                      {selectedTicket.ticketCode}
                    </span>
                    <span className="text-xs text-slate-800 font-medium">
                      Pelapor: <strong className="text-slate-950 font-black">{selectedTicket.senderName}</strong> ({selectedTicket.senderRole})
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-950 mt-1">
                    {selectedTicket.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-orange-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stepper Status */}
              <TimelineStatus
                status={selectedTicket.status}
                createdAt={selectedTicket.createdAt}
                updatedAt={selectedTicket.updatedAt}
                assignedDepartment={selectedTicket.assignedDepartment}
              />

              {/* Description & Location */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-900 border-l-3 border-orange-500 pl-2">
                  Isi Pengaduan / Aspirasi
                </h4>
                <p className="text-sm text-slate-900 font-medium whitespace-pre-line leading-relaxed">
                  {selectedTicket.description}
                </p>
                {selectedTicket.location && (
                  <p className="text-xs text-slate-700 font-medium pt-1">
                    Lokasi: <strong className="text-slate-950">{selectedTicket.location}</strong>
                  </p>
                )}
              </div>

              {/* Disposisi & Update Status Box */}
              <div className="p-5 rounded-2xl bg-orange-50/90 border-2 border-orange-300 space-y-4">
                <div className="flex items-center gap-2 text-orange-950">
                  <Building2 className="w-4 h-4 text-orange-700" />
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    Update Status & Disposisi Unit Penanggung Jawab
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Tahapan Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as TicketStatus)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="terkirim">Aspirasi Masuk (Terkirim)</option>
                      <option value="diverifikasi">Diverifikasi Admin</option>
                      <option value="didisposisi">Didisposisikan ke Bagian</option>
                      <option value="ditindaklanjuti">Sedang Ditindaklanjuti</option>
                      <option value="selesai">Selesai / Tuntas</option>
                      <option value="ditolak">Ditolak (Spam / Invalid)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Tugaskan Unit / Guru Terkait
                    </label>
                    <select
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Waka Bidang Sarpras & Toolman">Waka Bidang Sarpras & Toolman</option>
                      <option value="Waka Kesiswaan, Pembina OSIS & Guru BK">Waka Kesiswaan & Guru BK</option>
                      <option value="Waka Bidang Kurikulum & Kaprogli">Waka Kurikulum & Kaprogli</option>
                      <option value="Kepala Tata Usaha & Bendahara Sekolah">Kepala Tata Usaha & Keuangan</option>
                      <option value="Waka Humas & Hubungan Industri (Hubin)">Waka Humas & Hubin</option>
                      <option value="Satgas Anti-Kekerasan Sekolah">Satgas Anti-Kekerasan Sekolah</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDisposisi}
                    className="px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-sm transition"
                  >
                    Simpan Perubahan Status
                  </button>
                </div>
              </div>

              {/* Ruang Komunikasi Dua Arah & Catatan Internal */}
              <TwoWayDiscussion
                responses={selectedTicket.responses}
                onSendReply={handleSendAdminReply}
                isAdmin={true}
                reporterName={selectedTicket.privacy === 'anonim' ? 'Pelapor (Anonim)' : selectedTicket.senderName}
                isClosed={selectedTicket.status === 'selesai' || selectedTicket.status === 'ditolak'}
              />

              {/* Modal Close Footer */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteTicket(selectedTicket.id, selectedTicket.ticketCode)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Aspirasi Ini</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-6 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Tutup Jendela
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminGuard>
  );
}
