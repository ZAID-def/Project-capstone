'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  User, 
  AlertCircle, 
  Copy, 
  Check, 
  EyeOff,
  Tag
} from 'lucide-react';
import { getTicketByCode, addTicketResponse } from '@/lib/storage';
import { AspirationTicket } from '@/types';
import { CATEGORY_DETAILS, URGENCY_DETAILS } from '@/lib/nlpClassifier';
import TimelineStatus from '@/components/TimelineStatus';
import TwoWayDiscussion from '@/components/TwoWayDiscussion';

function TicketContent() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string)?.toUpperCase() || '';

  const [ticket, setTicket] = useState<AspirationTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      const data = getTicketByCode(code);
      if (data) {
        setTicket(data);
      }
      setLoading(false);
    }
  }, [code]);

  const handleCopyCode = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendReply = (message: string, senderName: string, isOfficial: boolean, isInternalNote: boolean) => {
    if (!ticket) return;
    const updated = addTicketResponse(ticket.id, {
      senderName,
      senderRole: senderName,
      message,
      isOfficial,
      isInternalNote
    });
    if (updated) {
      setTicket({ ...updated });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-800 font-bold">Memuat data tiket aspirasi...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto border border-red-300">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-950">
            Tiket Tidak Ditemukan
          </h2>
          <p className="text-sm text-slate-700 font-medium">
            Kode tiket <span className="font-mono font-black text-slate-950">"{code}"</span> tidak terdaftar dalam database SMK IT Baitul Aziz.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/lacak"
            className="px-6 py-2.5 rounded-full bg-orange-600 text-white text-xs sm:text-sm font-black hover:bg-orange-700 transition shadow-sm"
          >
            Cari Tiket Lain
          </Link>
          <Link
            href="/buat-aspirasi"
            className="px-6 py-2.5 rounded-full bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold hover:bg-slate-200 transition border border-slate-300"
          >
            Kirim Aspirasi Baru
          </Link>
        </div>
      </div>
    );
  }

  const catDetail = CATEGORY_DETAILS[ticket.category];
  const urgencyDetail = URGENCY_DETAILS[ticket.urgency];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <Link
          href="/lacak"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pencarian</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-orange-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
                {ticket.ticketCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded-md text-slate-600 hover:text-orange-700 transition"
                title="Salin Kode"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 font-bold" /> : <Copy className="w-4 h-4" />}
              </button>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catDetail.badgeBg}`}>
                {catDetail.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${urgencyDetail.badgeBg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${urgencyDetail.dotColor}`} />
                {urgencyDetail.label}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 pt-1">
              {ticket.title}
            </h1>
          </div>

          <div className="text-xs text-slate-700 space-y-1 sm:text-right shrink-0">
            <div className="flex sm:justify-end items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-medium">Dibuat: {new Date(ticket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex sm:justify-end items-center gap-1.5">
              {ticket.privacy === 'anonim' ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-black text-amber-900">Pelapor Anonim</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span>Pelapor: <strong className="text-slate-950 font-black">{ticket.senderName}</strong> ({ticket.senderRole})</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Timeline Status Tindak Lanjut */}
      <TimelineStatus
        status={ticket.status}
        createdAt={ticket.createdAt}
        updatedAt={ticket.updatedAt}
        assignedDepartment={ticket.assignedDepartment}
      />

      {/* Isi Detail Aspirasi & Bukti */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Konten Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-orange-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-l-3 border-orange-500 pl-2">
              Uraian Aspirasi / Aduan
            </h3>
            
            <p className="text-sm sm:text-base text-slate-900 font-medium whitespace-pre-line leading-relaxed">
              {ticket.description}
            </p>

            {ticket.location && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-xs text-orange-950 font-bold">
                <MapPin className="w-3.5 h-3.5 text-orange-700" />
                <span>Lokasi: <strong>{ticket.location}</strong></span>
              </div>
            )}

            {/* Lampiran Foto Bukti */}
            {ticket.evidenceUrl && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800">Lampiran Bukti:</span>
                <div className="rounded-xl overflow-hidden border border-orange-200 max-w-sm">
                  <img
                    src={ticket.evidenceUrl}
                    alt="Bukti Pengaduan"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Saluran Komunikasi Dua Arah (Thread) */}
          <TwoWayDiscussion
            responses={ticket.responses}
            onSendReply={handleSendReply}
            reporterName={ticket.privacy === 'anonim' ? 'Pelapor (Anonim)' : ticket.senderName}
            isClosed={ticket.status === 'selesai' || ticket.status === 'ditolak'}
          />
        </div>

        {/* Sidebar Info & Detail Disposisi */}
        <div className="space-y-6">
          
          {/* Card Disposisi & Topik */}
          <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-2xl border-2 border-orange-300 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-700" />
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-950">
                Informasi Penugasan Unit
              </h4>
            </div>

            <div className="text-xs space-y-2 text-slate-800">
              <p>
                <strong>Tingkat Relevansi:</strong>{' '}
                <span className="font-black text-orange-800">{ticket.aiConfidence || 90}%</span>
              </p>
              <p>
                <strong>Unit Penanggung Jawab:</strong><br />
                <span className="font-black text-slate-950 text-sm">{ticket.assignedDepartment}</span>
              </p>
              {ticket.aiUrgencyReason && (
                <p className="text-xs text-slate-800 font-medium bg-white p-3 rounded-xl border border-orange-200">
                  {ticket.aiUrgencyReason}
                </p>
              )}
            </div>

            {ticket.aiDetectedKeywords && ticket.aiDetectedKeywords.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1">
                {ticket.aiDetectedKeywords.map((kw, i) => (
                  <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 font-bold border border-orange-200">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Jaminan Kerahasiaan Card */}
          <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-orange-700">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Perlindungan Pelapor</h4>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Seluruh data percakapan pada saluran ini dilindungi oleh SOP Kerahasiaan SMK IT Baitul Aziz. Identitas pelapor tidak akan dipublikasikan ke pihak luar tanpa persetujuan.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function LacakDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-800 font-bold">Memuat data tiket aspirasi...</p>
      </div>
    }>
      <TicketContent />
    </Suspense>
  );
}
