'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquarePlus, 
  Search, 
  Wrench, 
  BookOpen, 
  HeartHandshake, 
  CreditCard, 
  Building2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Users,
  Award,
  BellRing,
  X
} from 'lucide-react';
import { getAllTickets, getSystemStats } from '@/lib/storage';
import { AspirationTicket } from '@/types';
import { CATEGORY_DETAILS } from '@/lib/nlpClassifier';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [ticketSearchCode, setTicketSearchCode] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('sarpras');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [stats, setStats] = useState({
    total: 0,
    selesai: 0,
    proses: 0,
    completionRate: 0
  });
  const [recentTickets, setRecentTickets] = useState<AspirationTicket[]>([]);

  useEffect(() => {
    // Nonaktifkan browser scroll restoration agar saat refresh
    // halaman selalu kembali ke posisi paling atas (bukan posisi terakhir)
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Paksa scroll ke paling atas pada setiap mount/refresh
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Trigger smooth page entrance animation
    setMounted(true);
    
    // Tampilkan notifikasi sambutan singkat setelah halaman dimuat
    const toastTimer = setTimeout(() => {
      setShowWelcomeToast(true);
    }, 800);

    const s = getSystemStats();
    setStats({
      total: s.total,
      selesai: s.selesai,
      proses: s.proses,
      completionRate: s.completionRate
    });

    const all = getAllTickets().filter(t => t.privacy === 'publik').slice(0, 3);
    setRecentTickets(all);

    return () => {
      clearTimeout(toastTimer);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearchCode.trim()) return;
    router.push(`/lacak/${ticketSearchCode.trim().toUpperCase()}`);
  };

  const handleQuickCodeClick = (code: string) => {
    setTicketSearchCode(code);
    router.push(`/lacak/${code}`);
  };

  const categories = [
    {
      key: 'sarpras',
      title: 'Sarana & Prasarana',
      shortTitle: 'Sarana Prasarana',
      desc: 'Lab komputer, ruang kelas, pendingin AC, kelistrikan & sanitasi',
      icon: Wrench,
      badge: 'Tim Sarpras',
      sla: 'Maks. 2x24 Jam',
      pj: 'Waka Sarpras & Teknisi Sekolah',
      contoh: 'AC Lab Komputer mati, proyektor redup, perbaikan pintu kelas'
    },
    {
      key: 'akademik',
      title: 'Akademik & Kurikulum',
      shortTitle: 'Akademik & PKL',
      desc: 'Jadwal KBM, materi pelajaran, magang PKL industri & sertifikasi',
      icon: BookOpen,
      badge: 'Kurikulum & Kaprogli',
      sla: 'Maks. 1x24 Jam',
      pj: 'Waka Kurikulum & Kepala Program Keahlian',
      contoh: 'Kendala tempat magang PKL, jadwal ujian, modul kejuruan TI'
    },
    {
      key: 'kesiswaan',
      title: 'Kesiswaan & BK',
      shortTitle: 'Kesiswaan & BK',
      desc: 'Kedisiplinan, pencegahan bullying, OSIS, ekskul & konseling siswa',
      icon: HeartHandshake,
      badge: 'Kesiswaan & BK',
      sla: 'Segera / Prioritas Tinggi',
      pj: 'Guru BK & Pembina Kesiswaan',
      contoh: 'Laporan perundungan, konsultasi kesulitan belajar, kegiatan ekskul'
    },
    {
      key: 'keuangan',
      title: 'Keuangan & Administrasi',
      shortTitle: 'Keuangan & TU',
      desc: 'Informasi bantuan PIP, administrasi TU, surat izin & ijazah',
      icon: CreditCard,
      badge: 'Tata Usaha',
      sla: 'Maks. 1x24 Jam',
      pj: 'Kepala Tata Usaha & Bendahara Sekolah',
      contoh: 'Pencairan dana PIP, surat keterangan siswa aktif, legalisir rapor'
    },
    {
      key: 'lingkungan',
      title: 'Hubungan Industri & Lingkungan',
      shortTitle: 'Hubin & Lingkungan',
      desc: 'Kemitraan DUDI, kantin sehat, keamanan satpam & lingkungan sekolah',
      icon: Building2,
      badge: 'Hubin & Humas',
      sla: 'Maks. 2x24 Jam',
      pj: 'Waka Hubin & Koordinator Humas',
      contoh: 'Kerjasama rekrutmen kerja industri, kebersihan kantin, parkir kendaraan'
    }
  ];

  const activeCategoryData = categories.find(c => c.key === activeCategoryTab) || categories[0];

  const faqs = [
    {
      q: 'Apakah identitas pelapor benar-benar aman jika memilih mode Anonim?',
      a: 'Sangat aman. Saat Anda memilih opsi Anonim, sistem SMK IT Baitul Aziz sama sekali tidak menyimpan nama maupun kontak Anda ke publik. Anda akan mendapatkan Kode Tiket unik untuk memantau perkembangan dan membalas pesan petugas tanpa perlu mengungkap data diri.'
    },
    {
      q: 'Berapa lama rata-rata waktu respons tindak lanjut aspirasi?',
      a: 'Setiap aspirasi yang masuk akan diverifikasi oleh sistem dan didisposisikan kepada unit penanggung jawab dalam waktu kurang dari 24 jam kerja. Untuk aduan darurat seperti perundungan atau fasilitas rusak parah, petugas akan memberikan tindakan prioritas.'
    },
    {
      q: 'Bagaimana jika saya ingin menambahkan bukti foto tambahan setelah mengirim tiket?',
      a: 'Cukup masukkan Kode Tiket Anda pada menu Lacak Aspirasi. Di halaman riwayat tiket tersebut, Anda dapat berdiskusi secara dua arah dengan petugas dan mengirimkan penjelasan tambahan kapan saja.'
    },
    {
      q: 'Siapa saja yang berhak mengirimkan aspirasi di portal ini?',
      a: 'Seluruh warga sekolah: Siswa aktif, Orang Tua / Wali Murid, Alumni, serta Masyarakat umum sekitar lingkungan SMK IT Baitul Aziz.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 relative">
      
      {/* Toast Sambutan Muncul Halus dari Sudut Bawah */}
      {showWelcomeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-white border-2 border-orange-400 shadow-2xl animate-fade-in-up flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-300">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
          <div className="space-y-1 text-xs">
            <h5 className="font-extrabold text-slate-950">Selamat Datang di Portal SMK IT Baitul Aziz</h5>
            <p className="text-slate-700 font-medium leading-relaxed">
              Sampaikan aspirasi Anda atau lacak tiket dengan cepat melalui halaman ini.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowWelcomeToast(false)}
            className="text-slate-500 hover:text-slate-900 p-1 -mt-1 -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Section dengan Ambient Glow, Grid Pattern & Staggered Entrance Animation */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-orange-200 bg-grid-pattern">
        
        {/* Ambient Animated Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-orange-300/15 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Live Indicator Status Badge (Entrance Anim: Slide Down) */}
          <div 
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-orange-300 text-orange-950 text-xs sm:text-sm font-extrabold shadow-sm backdrop-blur-sm transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-95'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <Compass className="w-4 h-4 text-orange-600" />
            <span>Portal Komunikasi Resmi SMK IT Baitul Aziz • Aktif 24 Jam</span>
          </div>

          {/* Main Hero Title (Entrance Anim: Fade In Up) */}
          <div 
            className={`space-y-4 max-w-4xl mx-auto transition-all duration-700 delay-100 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.15]">
              Saluran Aspirasi & Pelayanan <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600">
                SMK IT Baitul Aziz
              </span>
            </h1>
            
            {/* Orange bar accent with decorative dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              <span className="w-16 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            </div>

            <p className="text-base sm:text-lg text-slate-800 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
              Wadah komunikasi dua arah yang terstruktur dan terukur. Sampaikan keluhan sarana, masukan kurikulum, atau konsultasi kesiswaan secara transparan dan aman.
            </p>
          </div>

          {/* Interactive Quick Category Selector Tabs (Entrance Anim: Fade In Up Delay 200) */}
          <div 
            className={`space-y-3 pt-2 transition-all duration-700 delay-200 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xs font-black uppercase tracking-wider text-slate-700">
              Pilih Bidang Pelayanan yang Ingin Dituju:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {categories.map((cat) => {
                const isActive = activeCategoryTab === cat.key;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategoryTab(cat.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-500/30 scale-105 border border-orange-700'
                        : 'bg-white hover:bg-orange-50 text-slate-900 border border-orange-200 hover:border-orange-400 shadow-2xs'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-600'}`} />
                    <span>{cat.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Interactive Spotlight Box for Selected Category (Entrance Anim: Scale In) */}
            <div 
              className={`max-w-2xl mx-auto mt-4 p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-orange-300 shadow-md text-left transition-all duration-500 ease-out ${
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700 shrink-0 font-bold shadow-2xs">
                    <activeCategoryData.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-950">
                      {activeCategoryData.title}
                    </h4>
                    <p className="text-xs text-orange-800 font-bold">
                      Penanggung Jawab: {activeCategoryData.pj}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    SLA: {activeCategoryData.sla}
                  </span>
                </div>
              </div>
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <p className="text-slate-700 font-medium">
                  <strong className="text-slate-900">Contoh aduan:</strong> {activeCategoryData.contoh}
                </p>
                <Link
                  href={`/buat-aspirasi?kategori=${activeCategoryData.key}`}
                  className="inline-flex items-center gap-1.5 font-bold text-orange-700 hover:text-orange-900 underline shrink-0"
                >
                  <span>Buat Aduan di Bidang Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Action Buttons & Quick Search Bar (Entrance Anim: Fade In Up Delay 300) */}
          <div 
            className={`max-w-xl mx-auto space-y-4 pt-4 transition-all duration-700 delay-300 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/buat-aspirasi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-black text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 shadow-lg shadow-orange-500/25 transition duration-200"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span>Kirim Aspirasi Sekarang</span>
              </Link>
              <Link
                href="/lacak"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-slate-900 bg-white hover:bg-orange-50 border border-orange-300 shadow-xs hover:border-orange-500 transition"
              >
                <Search className="w-4 h-4 text-orange-600" />
                <span>Lacak Status Tiket</span>
              </Link>
            </div>

            {/* Quick Ticket Tracker Search Box */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="relative flex items-center shadow-md rounded-full bg-white border-2 border-orange-300 p-1.5 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition">
                <Search className="w-5 h-5 text-orange-600 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={ticketSearchCode}
                  onChange={(e) => setTicketSearchCode(e.target.value)}
                  placeholder="Masukkan Kode Tiket (cth: SMK-8X2K91)"
                  className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none text-slate-950 font-bold placeholder:text-slate-500 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs sm:text-sm font-black transition shrink-0 shadow-sm active:scale-95 cursor-pointer"
                >
                  Lacak
                </button>
              </div>

              {/* Quick sample chips */}
              <div className="flex items-center justify-center gap-2 mt-2.5 text-xs text-slate-700 font-medium">
                <span>Coba kode contoh:</span>
                <button
                  type="button" 
                  onClick={() => handleQuickCodeClick('SMK-8X2K91')}
                  className="font-mono font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-2 py-0.5 rounded border border-orange-300 transition cursor-pointer"
                >
                  SMK-8X2K91
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCodeClick('SMK-7Y3M20')}
                  className="font-mono font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-2 py-0.5 rounded border border-orange-300 transition cursor-pointer"
                >
                  SMK-7Y3M20
                </button>
              </div>
            </form>

          </div>

          {/* Stats Bar dengan Staggered Card Entrance */}
          <div className="pt-6 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div 
              className={`p-4 sm:p-5 rounded-2xl bg-white border border-orange-200 shadow-sm card-hover-effect transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-orange-600">
                {stats.total}+
              </div>
              <div className="text-xs sm:text-sm text-slate-900 font-bold mt-1">Aspirasi Diterima</div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">Siswa, Ortu & Warga</p>
            </div>

            <div 
              className={`p-4 sm:p-5 rounded-2xl bg-white border border-orange-200 shadow-sm card-hover-effect transition-all duration-700 delay-400 ${
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-emerald-700">
                {stats.completionRate}%
              </div>
              <div className="text-xs sm:text-sm text-slate-900 font-bold mt-1">Tingkat Penanganan</div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">Diselesaikan Tuntas</p>
            </div>

            <div 
              className={`p-4 sm:p-5 rounded-2xl bg-white border border-orange-200 shadow-sm card-hover-effect transition-all duration-700 delay-500 ${
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-amber-600">
                &lt; 24 Jam
              </div>
              <div className="text-xs sm:text-sm text-slate-900 font-bold mt-1">Kecepatan Respons</div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">Disposisi Petugas</p>
            </div>

            <div 
              className={`p-4 sm:p-5 rounded-2xl bg-white border border-orange-200 shadow-sm card-hover-effect transition-all duration-700 delay-600 ${
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                100%
              </div>
              <div className="text-xs sm:text-sm text-slate-900 font-bold mt-1">Privasi Terjaga</div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">Opsi Anonim Tersedia</p>
            </div>

          </div>

        </div>
      </section>

      {/* 5 Kategori Layanan Terstruktur dengan Card Hover Effect & Staggered Reveal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
            Bidang Pelayanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 pt-1">
            Kategori Layanan <span className="text-orange-600">Aspirasi</span>
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-700 font-medium pt-1">
            Setiap aduan dikelompokkan secara terstruktur agar langsung diterima oleh unit penanggung jawab SMK IT Baitul Aziz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className={`group p-5 rounded-2xl bg-white border border-orange-200 hover:border-orange-500 shadow-xs card-hover-effect flex flex-col justify-between transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 border border-orange-300 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-950 group-hover:text-orange-700 transition">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-orange-950 bg-orange-100 px-2.5 py-1 rounded-full border border-orange-200 inline-block">
                    {cat.badge}
                  </span>
                  <Link
                    href={`/buat-aspirasi?kategori=${cat.key}`}
                    className="flex items-center justify-between text-xs font-bold text-orange-700 group-hover:text-orange-800 pt-1"
                  >
                    <span>Lapor ke unit ini</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nilai Utama Sistem Komunikasi Dua Arah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-3xl p-8 sm:p-12 border border-orange-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
              Komitmen Sekolah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Mengapa Saluran Dua Arah Ini Dibuat?
            </h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full" />
            <p className="text-sm text-slate-700 font-medium pt-1">
              Meninggalkan kotak saran konvensional yang pasif dan lambat. Sistem ini menghadirkan dialog nyata antara warga sekolah dan pihak pengelola.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-orange-200 shadow-2xs space-y-3 card-hover-effect">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 border border-orange-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-950">
                Kerahasiaan Terjamin
              </h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Pilihan pelaporan Anonim dan Privat melindungi data pribadi Anda sepenuhnya dari jangkauan publik.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-orange-200 shadow-2xs space-y-3 card-hover-effect">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-950">
                Dialog Terbuka Dua Arah
              </h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Bukan sekadar pesan satu arah. Anda dapat membalas klarifikasi dari guru atau staf hingga solusi tuntas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-orange-200 shadow-2xs space-y-3 card-hover-effect">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-950">
                Standar Mutu Pelayanan
              </h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Setiap tiket tercatat di log audit manajemen sekolah untuk memastikan tidak ada aspirasi yang terbengkalai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Komunikasi Dua Arah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-10">
            
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Prosedur Penanganan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Alur Tindak Lanjut Aspirasi Dua Arah
              </h2>
              <div className="w-12 h-1 bg-orange-500 rounded-full" />
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                SMK IT Baitul Aziz menerapkan tata kelola penanganan aspirasi digital yang transparan dan terukur untuk menyelesaikan setiap masukan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-orange-500 transition-all duration-200 space-y-3">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400 flex items-center justify-center font-black text-sm shadow-xs">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">Pengajuan Laporan</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Isi formulir pengaduan, pilih privasi (Publik / Privat / Anonim), dan lampirkan bukti foto kendala.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-orange-500 transition-all duration-200 space-y-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 flex items-center justify-center font-black text-sm shadow-xs">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">Klasifikasi & Tiket</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sistem mengelompokkan kategori bidang dan menerbitkan Kode Tiket Unik pelapor.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-orange-500 transition-all duration-200 space-y-3">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400 flex items-center justify-center font-black text-sm shadow-xs">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">Disposisi ke Petugas</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tiket diteruskan ke Waka Sarpras, Guru BK, Waka Kurikulum, atau Tata Usaha untuk tindakan perbaikan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-orange-500 transition-all duration-200 space-y-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400 flex items-center justify-center font-black text-sm shadow-xs">
                  4
                </div>
                <h4 className="font-bold text-sm text-white">Respon & Diskusi Balik</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sekolah memberikan konfirmasi resmi. Pelapor dapat membalas pesan secara dua arah hingga status tuntas.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Aspirasi Publik Terkini Preview */}
      {recentTickets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
                Keterbukaan Pelayanan
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 mt-1">
                Aspirasi Terkini yang <span className="text-orange-600">Ditindaklanjuti</span>
              </h2>
            </div>
            <Link
              href="/lacak"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-700 hover:text-orange-800"
            >
              <span>Lacak Tiket Anda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTickets.map((ticket) => {
              const cat = CATEGORY_DETAILS[ticket.category];
              return (
                <div
                  key={ticket.id}
                  className="rounded-2xl p-5 bg-white border border-orange-200 shadow-2xs card-hover-effect flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.badgeBg}`}>
                        {cat.label}
                      </span>
                      <span className="text-xs font-mono font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {ticket.ticketCode}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-950 line-clamp-2">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium line-clamp-3 leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {ticket.responses.length} Tanggapan Resmi
                    </span>
                    <Link
                      href={`/lacak/${ticket.ticketCode}`}
                      className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1"
                    >
                      <span>Lihat Riwayat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Interactive FAQ Section (Accordion) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
            Pusat Informasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full" />
          <p className="text-sm text-slate-700 font-medium pt-1">
            Panduan lengkap mengenai tata cara dan perlindungan hak pelapor di SMK IT Baitul Aziz.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-orange-200 bg-white overflow-hidden shadow-2xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-950 hover:text-orange-700 transition cursor-pointer"
                >
                  <span className="text-sm sm:text-base flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed border-t border-orange-100 bg-orange-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box dengan Warm Orange Gradient & Floating Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 p-8 sm:p-12 text-white shadow-xl shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ingin Menyampaikan Masukan untuk SMK IT Baitul Aziz?
            </h2>
            <p className="text-sm text-orange-50 font-medium max-w-xl leading-relaxed">
              Gunakan formulir aspirasi terpadu. Anda dapat memilih opsi anonim untuk perlindungan kerahasiaan penuh.
            </p>
          </div>
          <Link
            href="/buat-aspirasi"
            className="px-8 py-4 rounded-full bg-white text-orange-700 font-black hover:bg-orange-50 active:scale-95 shadow-md transition duration-200 shrink-0 relative z-10 cursor-pointer"
          >
            Kirim Aspirasi Sekarang
          </Link>
        </div>
      </section>

    </div>
  );
}
