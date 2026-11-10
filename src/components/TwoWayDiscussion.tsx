'use client';

import React, { useState } from 'react';
import { TicketResponse } from '@/types';
import { MessageSquare, Send, ShieldCheck, User, Building, Lock } from 'lucide-react';

interface TwoWayDiscussionProps {
  responses: TicketResponse[];
  onSendReply: (message: string, senderName: string, isOfficial: boolean, isInternalNote: boolean) => void;
  isAdmin?: boolean;
  reporterName?: string;
  isClosed?: boolean;
}

export default function TwoWayDiscussion({
  responses,
  onSendReply,
  isAdmin = false,
  reporterName = 'Pelapor',
  isClosed = false
}: TwoWayDiscussionProps) {
  const [replyText, setReplyText] = useState('');
  const [senderNameInput, setSenderNameInput] = useState(isAdmin ? 'Tim Manajemen Sekolah' : reporterName);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    onSendReply(
      replyText.trim(),
      senderNameInput.trim() || (isAdmin ? 'Pihak Sekolah' : 'Pelapor'),
      isAdmin && !isInternalNote,
      isAdmin && isInternalNote
    );
    setReplyText('');
    setSubmitting(false);
  };

  const visibleResponses = responses.filter(r => !r.isInternalNote || isAdmin);

  return (
    <div className="bg-white rounded-2xl border border-orange-200 p-5 sm:p-6 shadow-2xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-200 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-950">
              Saluran Komunikasi Dua Arah
            </h3>
            <p className="text-xs text-slate-700 font-medium">
              Riwayat koordinasi dan respon resmi tindak lanjut
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-950 border border-orange-300">
          {visibleResponses.length} Pesan
        </span>
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {visibleResponses.length === 0 ? (
          <div className="text-center py-8 text-slate-600 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-orange-400" />
            <p className="text-sm font-bold text-slate-800">Belum ada respon tindak lanjut.</p>
            <p className="text-xs text-slate-600 font-medium">Tim SMK IT Baitul Aziz akan menanggapi laporan ini sesegera mungkin.</p>
          </div>
        ) : (
          visibleResponses.map((item) => {
            const isSchool = item.isOfficial;
            const isNote = item.isInternalNote;

            return (
              <div
                key={item.id}
                className={`flex gap-3 sm:gap-4 p-4 rounded-2xl transition ${
                  isNote
                    ? 'bg-amber-100/70 border border-amber-300'
                    : isSchool
                    ? 'bg-orange-50 border border-orange-300 ml-0 sm:ml-4'
                    : 'bg-slate-100 border border-slate-300 mr-0 sm:mr-4'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isNote
                      ? 'bg-amber-600 text-white'
                      : isSchool
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {isNote ? (
                    <Lock className="w-4 h-4" />
                  ) : isSchool ? (
                    <Building className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-slate-950">
                        {item.senderName}
                      </span>
                      {isSchool && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-200 text-orange-950 border border-orange-300">
                          <ShieldCheck className="w-3 h-3 text-orange-700" /> Resmi Sekolah
                        </span>
                      )}
                      {isNote && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-950 border border-amber-300">
                          Catatan Internal
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {new Date(item.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-900 font-medium whitespace-pre-line leading-relaxed pt-1">
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Form */}
      {!isClosed ? (
        <form onSubmit={handleSubmit} className="border-t border-orange-200 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              {isAdmin ? 'Tanggapi Laporan Sebagai Petugas SMK IT Baitul Aziz' : 'Kirim Balasan / Klarifikasi Tambahan'}
            </span>
            {isAdmin && (
              <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded border-slate-400 text-orange-600 focus:ring-orange-500"
                />
                Simpan sebagai Catatan Internal
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={senderNameInput}
              onChange={(e) => setSenderNameInput(e.target.value)}
              placeholder="Nama Anda / Identitas"
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="sm:col-span-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? "Tulis catatan koordinasi internal antar staf..." : "Tuliskan pesan balasan Anda di sini..."}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-black shadow-sm transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Pesan</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-3 rounded-xl bg-orange-100 text-xs text-orange-950 font-bold border border-orange-300">
          Tiket ini telah berstatus tuntas/selesai. Forum komunikasi resmi telah ditutup.
        </div>
      )}

    </div>
  );
}
