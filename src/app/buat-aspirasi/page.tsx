'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  MessageSquarePlus, 
  User, 
  Users, 
  Building, 
  GraduationCap, 
  ShieldCheck, 
  EyeOff, 
  Globe, 
  MapPin, 
  UploadCloud, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  Info,
  Send
} from 'lucide-react';
import { Role, PrivacyLevel, AspirationCategory } from '@/types';
import { createNewTicket } from '@/lib/storage';
import { classifyAspiration } from '@/lib/nlpClassifier';
import LiveAIPrediction from '@/components/LiveAIPrediction';

export default function BuatAspirasiPage() {
  const router = useRouter();

  // Form State
  const [role, setRole] = useState<Role>('siswa');
  const [privacy, setPrivacy] = useState<PrivacyLevel>('privat');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [manualCategory, setManualCategory] = useState<AspirationCategory | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);

  // Topic Analysis State
  const [prediction, setPrediction] = useState<ReturnType<typeof classifyAspiration> | null>(null);
  
  // Submission Result State
  const [submittedTicketCode, setSubmittedTicketCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const combined = `${title} ${description}`.trim();
    if (combined.length > 5) {
      const res = classifyAspiration(combined);
      setPrediction(res);
    } else {
      setPrediction(null);
    }
  }, [title, description]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    try {
      const ticket = createNewTicket({
        title: title.trim(),
        description: description.trim(),
        senderRole: role,
        senderName: privacy === 'anonim' ? 'Anonim' : (name.trim() || 'Warga Sekolah'),
        senderContact: contact.trim() || undefined,
        senderIdentifier: identifier.trim() || undefined,
        privacy: privacy,
        location: location.trim() || undefined,
        manualCategory: manualCategory || undefined,
        evidenceUrl: evidencePreview || undefined
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmittedTicketCode(ticket.ticketCode);
    } catch (err) {
      console.error('Gagal mengirim aspirasi:', err);
      alert('Terjadi kendala saat mengirim aspirasi. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!submittedTicketCode) return;
    navigator.clipboard.writeText(submittedTicketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SUCCESS VIEW
  if (submittedTicketCode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Aspirasi Berhasil Terkirim!
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-800 font-medium max-w-md mx-auto pt-1">
            Laporan Anda telah tercatat pada sistem penanganan SMK IT Baitul Aziz. Simpan kode tiket unik di bawah ini:
          </p>
        </div>

        {/* Ticket Code Card */}
        <div className="p-6 rounded-3xl bg-white border-2 border-dashed border-orange-400 max-w-md mx-auto shadow-sm space-y-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nomor Tiket Pelaporan
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono text-orange-700 tracking-wider">
            {submittedTicketCode}
          </div>
          
          <button
            onClick={handleCopyCode}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-slate-900 bg-orange-100 hover:bg-orange-200 border border-orange-300 transition"
          >
            <Copy className="w-4 h-4 text-orange-700" />
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode Tiket'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50 text-orange-950 text-xs max-w-md mx-auto text-left flex items-start gap-3 border border-orange-300">
          <Info className="w-4 h-4 shrink-0 text-orange-700 mt-0.5" />
          <p className="font-medium text-slate-800">
            Gunakan kode ini di menu <strong>Lacak Tiket</strong> untuk melihat perkembangan penanganan dan mengirim balasan dua arah kepada pihak sekolah.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href={`/lacak/${submittedTicketCode}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold shadow-md transition"
          >
            <span>Buka Ruang Komunikasi Tiket</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              setSubmittedTicketCode(null);
              setTitle('');
              setDescription('');
              setManualCategory(null);
              setEvidencePreview(null);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-800 hover:bg-orange-50 font-bold text-sm transition border border-slate-300"
          >
            Kirim Aspirasi Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-950 border border-orange-300">
          <MessageSquarePlus className="w-3.5 h-3.5 text-orange-600" />
          <span>Saluran Aspirasi & Pengaduan Terbuka</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Formulir <span className="text-orange-600">Aspirasi</span> & Pengaduan
        </h1>
        <div className="w-12 h-1 bg-orange-500 rounded-full sm:mx-0 mx-auto" />
        <p className="text-sm text-slate-800 font-medium max-w-2xl pt-1">
          Sampaikan saran fasilitas, masukan akademik, atau laporan situasi kesiswaan kepada pihak manajemen SMK IT Baitul Aziz.
        </p>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Section 1: Profil Pelapor & Privasi */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-3 border-orange-500 pl-2">
            1. Peran & Pengaturan Kerahasiaan
          </h3>

          {/* Role Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'siswa', label: 'Siswa / Siswi', icon: GraduationCap },
              { id: 'orang_tua', label: 'Orang Tua / Wali', icon: Users },
              { id: 'masyarakat', label: 'Masyarakat / DUDI', icon: Building },
              { id: 'guru', label: 'Guru / Karyawan', icon: User }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id as Role)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition ${
                    isSelected
                      ? 'border-orange-500 bg-orange-100/90 text-orange-950 font-black shadow-xs ring-2 ring-orange-400/30'
                      : 'border-slate-300 text-slate-800 font-bold hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5 text-orange-600" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Privacy Level Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              {
                id: 'privat',
                label: 'Privat (Hanya Sekolah)',
                desc: 'Nama Anda hanya dibaca oleh tim sekolah.',
                icon: ShieldCheck,
                color: 'text-orange-700'
              },
              {
                id: 'anonim',
                label: 'Anonim (100% Rahasia)',
                desc: 'Nama disamarkan, identitas Anda tidak disimpan.',
                icon: EyeOff,
                color: 'text-amber-700'
              },
              {
                id: 'publik',
                label: 'Aspirasi Publik',
                desc: 'Dapat dilihat publik setelah diverifikasi.',
                icon: Globe,
                color: 'text-emerald-700'
              }
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = privacy === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrivacy(opt.id as PrivacyLevel)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-100/70'
                      : 'border-slate-300 hover:bg-orange-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${opt.color}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-950">{opt.label}</h4>
                    <p className="text-[11px] text-slate-700 font-medium leading-snug mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Identity Inputs (Hidden if Anonymous) */}
          {privacy !== 'anonim' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Nama Lengkap Pelapor *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Kontak (WhatsApp / Email)
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Untuk informasi perkembangan (opsional)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* Specific identifier for student (NISN) */}
          {role === 'siswa' && privacy !== 'anonim' && (
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                NISN / Kelas (Opsional)
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Contoh: 0078912345 / XII RPL 1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
        </div>

        {/* Section 2: Isi Aspirasi */}
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-3 border-orange-500 pl-2">
            2. Detail Aspirasi / Pengaduan
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Judul Aspirasi / Pokok Masalah *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: AC Lab Komputer RPL 2 Mati"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Lokasi Terkait di SMK IT Baitul Aziz (Opsional)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-orange-600 absolute left-3.5 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Lab Komputer RPL 2, Kantin Belakang, Bengkel, Lapangan"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Deskripsi Lengkap Aspirasi / Aduan *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara rinci kronologi kendala atau usulan perbaikan yang Anda harapkan..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Real-time Category Recommendation Widget */}
          <LiveAIPrediction
            prediction={prediction}
            manualCategory={manualCategory}
            onSelectCategory={(cat) => setManualCategory(cat)}
          />

          {/* Upload Lampiran Bukti */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Lampirkan Bukti Foto / Dokumen Pendukung (Opsional)
            </label>
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-orange-300 border-dashed rounded-2xl hover:border-orange-600 transition relative bg-orange-50/20">
              <div className="space-y-2 text-center">
                <UploadCloud className="mx-auto h-8 w-8 text-orange-600" />
                <div className="flex text-xs text-slate-800 font-medium justify-center">
                  <label className="relative cursor-pointer font-bold text-orange-700 hover:underline">
                    <span>Pilih Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">atau seret file ke sini</p>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">PNG, JPG, JPEG hingga 5MB</p>
              </div>
            </div>

            {/* Preview image */}
            {evidencePreview && (
              <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-orange-300 shadow-sm">
                <img
                  src={evidencePreview}
                  alt="Bukti Lampiran"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setEvidencePreview(null)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 text-[10px] hover:bg-black"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs text-slate-700 font-medium">
            Aspirasi akan diverifikasi sesuai SOP tata kelola SMK IT Baitul Aziz.
          </p>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-sm shadow-md shadow-orange-500/25 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses...' : 'Kirim Aspirasi'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
