import { AspirationCategory, UrgencyLevel } from '@/types';

export interface ClassificationResult {
  category: AspirationCategory;
  confidence: number; // 0 - 100
  urgency: UrgencyLevel;
  urgencyReason: string;
  detectedKeywords: string[];
  scores: Record<AspirationCategory, number>;
}

// Kamus kata kunci tertimbang untuk analisis aspirasi SMK IT Baitul Aziz
const CATEGORY_DICTIONARY: Record<AspirationCategory, { weight: number; words: string[] }[]> = {
  sarpras: [
    { weight: 3, words: ['proyektor', 'infocus', 'komputer', 'pc', 'lab', 'bengkel', 'wifi', 'internet', 'ac', 'kipas'] },
    { weight: 2.5, words: ['toilet', 'wc', 'kran', 'meja', 'kursi', 'atap', 'bocor', 'lampu', 'pintu', 'jendela', 'listrik', 'stopkontak', 'saklar', 'kabel'] },
    { weight: 2, words: ['rusak', 'mati', 'patah', 'pecah', 'fasilitas', 'lapangan', 'parkiran', 'parkir', 'gerbang', 'musholla', 'gedung', 'sarana', 'prasarana', 'alat'] },
    { weight: 1, words: ['panas', 'gelap', 'kotor', 'bau', 'sempit', 'perbaikan', 'renovasi'] }
  ],
  akademik: [
    { weight: 3, words: ['guru', 'pengajar', 'nilai', 'rapor', 'ujian', 'uts', 'uas', 'asesmen', 'tugas', 'pr', 'kbm'] },
    { weight: 2.5, words: ['kurikulum', 'jadwal', 'jam kosong', 'pkl', 'magang', 'prakerin', 'lsp', 'sertifikasi', 'ujikom'] },
    { weight: 2, words: ['materi', 'modul', 'buku', 'pelajaran', 'mapel', 'remedial', 'praktik', 'teori', 'kejuruan', 'jurusan', 'rpl', 'tkj'] },
    { weight: 1, words: ['metode', 'tenggat', 'deadline', 'tuntutan', 'belajar', 'mengajar'] }
  ],
  kesiswaan: [
    { weight: 4, words: ['bully', 'bullying', 'perundungan', 'pukul', 'dipukul', 'hajar', 'ancam', 'diancam', 'palak', 'dipalak', 'pelecehan'] },
    { weight: 3, words: ['tawuran', 'rokok', 'vape', 'miras', 'bolos', 'kelahi', 'berantem', 'intimidasi', 'diskriminasi'] },
    { weight: 2.5, words: ['osis', 'ekskul', 'ekstrakurikuler', 'razia', 'seragam', 'sepatu', 'rambut', 'tata tertib', 'kedisiplinan', 'bk'] },
    { weight: 1.5, words: ['teman', 'siswa', 'angkatan', 'senior', 'junior', 'geng', 'sanksi', 'hukuman'] }
  ],
  keuangan: [
    { weight: 3.5, words: ['spp', 'beasiswa', 'pip', 'bsm', 'tunggakan', 'kwitansi', 'iuran', 'angsuran', 'cicilan'] },
    { weight: 2.5, words: ['daftar ulang', 'ijazah', 'uang gedung', 'biaya seragam', 'biaya pkl', 'biaya ujian', 'bendahara'] },
    { weight: 2, words: ['biaya', 'bayar', 'pembayaran', 'administrasi', 'uang', 'keuangan', 'mahal', 'potongan', 'keringanan'] },
    { weight: 1, words: ['tagihan', 'struk', 'lunas', 'subsidi'] }
  ],
  lingkungan: [
    { weight: 3, words: ['kantin', 'makanan', 'basi', 'kebersihan', 'sampah', 'bau got', 'limbah', 'polusi', 'debu'] },
    { weight: 2.5, words: ['satpam', 'security', 'keamanan', 'helm hilang', 'pencurian', 'warga', 'tetangga', 'lingkungan'] },
    { weight: 2, words: ['industri', 'mitra', 'dudi', 'kerjasama', 'kunjungan industri', 'bising', 'lalu lintas', 'jalan raya'] },
    { weight: 1, words: ['tertib', 'nyaman', 'sejuk', 'kesehatan', 'taman', 'hijau'] }
  ]
};

// Pola kata kunci tingkat urgensi
const EMERGENCY_KEYWORDS = [
  'ancaman', 'ancam', 'nyawa', 'pukul', 'dipukul', 'hajar', 'berdarah', 'luka', 
  'pelecehan', 'konslet', 'kebakaran', 'bakar', 'roboh', 'runtuh', 'bahaya sekali', 
  'menjalar', 'senjata', 'tajam', 'pemerasan', 'dipalak keras'
];

const HIGH_URGENCY_KEYWORDS = [
  'bully', 'perundungan', 'intimidasi', 'tawuran', 'rusak parah', 'mati total', 
  'tidak bisa ujian', 'ditahan ijazah', 'tidak bisa makan', 'razia sepihak', 'depresi', 
  'ketakutan', 'tidak masuk sekolah', 'ancam dikeluarkan'
];

const MEDIUM_URGENCY_KEYWORDS = [
  'rusak', 'kotor', 'bocor', 'panas', 'mati', 'hilang', 'terlambat', 'tidak ada guru', 
  'jam kosong berulang', 'ac mati', 'proyektor mati', 'antrean', 'mahal'
];

export function classifyAspiration(text: string): ClassificationResult {
  const normalized = text.toLowerCase();
  
  const scores: Record<AspirationCategory, number> = {
    sarpras: 0,
    akademik: 0,
    kesiswaan: 0,
    keuangan: 0,
    lingkungan: 0
  };

  const detectedKeywords: string[] = [];

  for (const [cat, groups] of Object.entries(CATEGORY_DICTIONARY)) {
    const categoryKey = cat as AspirationCategory;
    for (const group of groups) {
      for (const word of group.words) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(normalized)) {
          scores[categoryKey] += group.weight;
          if (!detectedKeywords.includes(word)) {
            detectedKeywords.push(word);
          }
        }
      }
    }
  }

  let topCategory: AspirationCategory = 'sarpras';
  let highestScore = 0;
  let totalScore = 0;

  for (const [cat, score] of Object.entries(scores)) {
    totalScore += score;
    if (score > highestScore) {
      highestScore = score;
      topCategory = cat as AspirationCategory;
    }
  }

  let confidence = 50;
  if (totalScore > 0) {
    const ratio = highestScore / totalScore;
    confidence = Math.min(98, Math.round(55 + (ratio * 40)));
  }

  let urgency: UrgencyLevel = 'rendah';
  let urgencyReason = 'Aspirasi bersifat saran umum atau masukan pengembangan.';

  for (const word of EMERGENCY_KEYWORDS) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(normalized)) {
      urgency = 'darurat';
      urgencyReason = `Terdeteksi indikasi situasi darurat / bahaya keselamatan ("${word}"). Memerlukan penanganan segera oleh manajemen sekolah.`;
      break;
    }
  }

  if (urgency !== 'darurat') {
    for (const word of HIGH_URGENCY_KEYWORDS) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(normalized)) {
        urgency = 'tinggi';
        urgencyReason = `Terdeteksi isu sensitif atau kendala berdampak signifikan ("${word}"). Perlu perhatian khusus.`;
        break;
      }
    }
  }

  if (urgency === 'rendah') {
    for (const word of MEDIUM_URGENCY_KEYWORDS) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(normalized)) {
        urgency = 'sedang';
        urgencyReason = `Keluhan operasional atau kenyamanan belajar ("${word}").`;
        break;
      }
    }
  }

  if (highestScore === 0) {
    topCategory = 'sarpras';
    confidence = 45;
    urgencyReason = 'Aspirasi umum mengenai fasilitas dan sarana sekolah.';
  }

  return {
    category: topCategory,
    confidence,
    urgency,
    urgencyReason,
    detectedKeywords,
    scores
  };
}

export const CATEGORY_DETAILS: Record<AspirationCategory, {
  label: string;
  department: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}> = {
  sarpras: {
    label: 'Sarana & Prasarana',
    department: 'Waka Bidang Sarpras & Toolman',
    description: 'Fasilitas gedung, lab komputer, bengkel praktik, kelistrikan, sanitasi, dan alat belajar.',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-500'
  },
  akademik: {
    label: 'Akademik & Kurikulum',
    department: 'Waka Bidang Kurikulum & Kaprogli',
    description: 'KBM, jadwal pelajaran, guru pengajar, sertifikasi kejuruan, ujian, dan magang PKL.',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-500'
  },
  kesiswaan: {
    label: 'Kesiswaan & Bimbingan Konseling',
    department: 'Waka Kesiswaan, Pembina OSIS & Guru BK',
    description: 'Tata tertib, pencegahan perundungan (bullying), kedisiplinan, ekskul, dan konseling siswa.',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-500'
  },
  keuangan: {
    label: 'Keuangan & Administrasi',
    department: 'Kepala Tata Usaha & Bendahara Sekolah',
    description: 'Administrasi pembayaran, SPP, dana bantuan/PIP, legalisir surat, dan ijazah.',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-500'
  },
  lingkungan: {
    label: 'Hubungan Industri & Lingkungan',
    department: 'Waka Humas & Hubungan Industri (Hubin)',
    description: 'Kemitraan dunia kerja (DUDI), kantin sehat, keamanan satpam, dan ketertiban lingkungan.',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    badgeText: 'text-slate-700',
    borderColor: 'border-slate-500'
  }
};

export const URGENCY_DETAILS: Record<UrgencyLevel, {
  label: string;
  badgeBg: string;
  dotColor: string;
}> = {
  rendah: {
    label: 'Rendah',
    badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
    dotColor: 'bg-slate-400'
  },
  sedang: {
    label: 'Sedang',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500'
  },
  tinggi: {
    label: 'Prioritas Tinggi',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
    dotColor: 'bg-orange-500'
  },
  darurat: {
    label: 'Mendesak / Darurat',
    badgeBg: 'bg-red-50 text-red-700 border-red-300 font-bold animate-pulse',
    dotColor: 'bg-red-600'
  }
};
