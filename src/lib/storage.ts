import { AspirationTicket, TicketResponse, TicketStatus, AspirationCategory, Role } from '@/types';
import { classifyAspiration } from './nlpClassifier';

const STORAGE_KEY = 'aspirasi_smk_baitul_aziz_stakeholder_v1';

// Data awal realistis untuk Guru & Pegawai SMK IT Baitul Aziz
export const INITIAL_TICKETS: AspirationTicket[] = [
  {
    id: 'tk-001',
    ticketCode: 'SMK-8X2K91',
    title: 'AC di Lab Komputer RPL 2 Mati dan Mengganggu Praktik Pembelajaran',
    description: 'Mohon bantuan dari unit Sarpras SMK IT Baitul Aziz, pendingin ruangan (AC) di Lab RPL 2 mati total sejak 2 hari lalu. Saat KBM praktik pemrograman web berlangsung, suhu ruangan sangat panas dan menyebabkan 4 unit PC workstation mati mendadak (overheat). Mohon perbaikan secepatnya agar pembelajaran produktif siswa tidak terganggu.',
    category: 'sarpras',
    urgency: 'tinggi',
    status: 'ditindaklanjuti',
    senderRole: 'guru',
    senderName: 'Drs. Hendro Wibowo, M.Kom',
    senderContact: 'hendro.wibowo@smkitbaitulaziz.sch.id',
    senderIdentifier: 'NIP. 197805122005011003',
    privacy: 'publik',
    location: 'Lab Komputer RPL 2 (Lantai 2 Gedung B)',
    assignedDepartment: 'Waka Bidang Sarpras & Toolman',
    aiConfidence: 94,
    aiSuggestedCategory: 'sarpras',
    aiDetectedKeywords: ['komputer', 'lab', 'ac', 'rusak', 'panas', 'sarpras'],
    aiUrgencyReason: 'Terdeteksi kendala sarana vital ("komputer", "ac") yang mengganggu aktivitas praktik belajar mengajar.',
    createdAt: '2026-10-15T08:30:00.000Z',
    updatedAt: '2026-10-16T10:15:00.000Z',
    responses: [
      {
        id: 'resp-001',
        ticketId: 'tk-001',
        senderName: 'Pak Hendra (Toolman Sarpras)',
        senderRole: 'Tim Sarpras',
        message: 'Terima kasih atas laporannya Pak Hendro. Teknisi servis AC telah dihubungi dan dijadwalkan tiba besok pagi pukul 09.00 WIB untuk penggantian sparepart kapasitor kompresor.',
        isOfficial: true,
        isInternalNote: false,
        createdAt: '2026-10-15T11:00:00.000Z'
      },
      {
        id: 'resp-002',
        ticketId: 'tk-001',
        senderName: 'Drs. Hendro Wibowo, M.Kom',
        senderRole: 'Pelapor (Guru)',
        message: 'Baik Pak Hendra, terima kasih atas respons cepatnya. Kami tunggu perbaikannya besok pagi.',
        isOfficial: false,
        isInternalNote: false,
        createdAt: '2026-10-15T12:20:00.000Z'
      }
    ]
  },
  {
    id: 'tk-002',
    ticketCode: 'SMK-4M7P02',
    title: 'Usulan Penguatan Patroli & Penambahan Titik CCTV Area Belakang Bengkel',
    description: 'Sebagai guru piket, saya memperhatikan area belakang bengkel otomotif dan kantin belakang sangat minim pencahayaan saat sore hari dan rawan menjadi tempat berkumpul tanpa pengawasan. Diperlukan penambahan unit CCTV dan jadwal piket keamanan teratur dari satpam sekolah guna mencegah potensi pelanggaran kedisiplinan.',
    category: 'kesiswaan',
    urgency: 'tinggi',
    status: 'didisposisi',
    senderRole: 'guru',
    senderName: 'Anonim',
    privacy: 'anonim',
    location: 'Belakang Bengkel & Sudut Kantin Belakang',
    assignedDepartment: 'Waka Kesiswaan, Pembina OSIS & Guru BK',
    aiConfidence: 96,
    aiSuggestedCategory: 'kesiswaan',
    aiDetectedKeywords: ['ancaman', 'kekerasan', 'keamanan', 'kedisiplinan'],
    aiUrgencyReason: 'Usulan pengamanan ketertiban dan pencegahan kerawanan disiplin kesiswaan.',
    createdAt: '2026-10-16T13:45:00.000Z',
    updatedAt: '2026-10-16T14:30:00.000Z',
    responses: [
      {
        id: 'resp-003',
        ticketId: 'tk-002',
        senderName: 'Ibu Ratna, S.Pd (Guru BK)',
        senderRole: 'Guru Bimbingan Konseling',
        message: 'Laporan dan usulan telah diterima oleh Tim Satgas Kesiswaan dan Guru BK SMK IT Baitul Aziz. Mulai hari ini petugas keamanan sekolah ditugaskan meningkatkan patroli berkala di titik rawan tersebut. Identitas pelapor dijamin 100% aman dan rahasia.',
        isOfficial: true,
        isInternalNote: false,
        createdAt: '2026-10-16T14:30:00.000Z'
      }
    ]
  },
  {
    id: 'tk-003',
    ticketCode: 'SMK-1V9Q33',
    title: 'Penyelarasan Modul Praktik TKJ dengan Kebutuhan Mitra Industri Telekomunikasi',
    description: 'Berdasarkan hasil koordinasi dengan mitra industri PT Telkom Akses dan ISP rekanan, terdapat kebutuhan pengayaan materi praktikum fiber optic splicing dan konfigurasi routing MikroTik tingkat lanjut. Kami dari rumpun guru kejuruan mengusulkan penambahan modul workshop praktikum ini dalam silabus semester genap.',
    category: 'akademik',
    urgency: 'sedang',
    status: 'selesai',
    senderRole: 'guru',
    senderName: 'Siti Aminah, S.Kom (Guru Kejuruan TKJ)',
    senderContact: 'siti.aminah@smkitbaitulaziz.sch.id',
    senderIdentifier: 'NUPTK: 8241762663210082',
    privacy: 'publik',
    location: 'Ruang Guru Kejuruan TI',
    assignedDepartment: 'Waka Bidang Kurikulum & Kaprogli',
    aiConfidence: 91,
    aiSuggestedCategory: 'akademik',
    aiDetectedKeywords: ['magang', 'pkl', 'industri', 'guru', 'kurikulum', 'praktik'],
    aiUrgencyReason: 'Usulan penyelarasan kurikulum kejuruan dengan industri mitra.',
    createdAt: '2026-10-12T09:10:00.000Z',
    updatedAt: '2026-10-14T15:00:00.000Z',
    responses: [
      {
        id: 'resp-004',
        ticketId: 'tk-003',
        senderName: 'Bpk. Ahmad Fauzi (Waka Kurikulum)',
        senderRole: 'Waka Kurikulum & Kaprogli',
        message: 'Ibu Siti Aminah yang terhormat, terima kasih atas inisiatifnya. Tim Kurikulum telah menyetujui pengayaan materi tersebut. Modul praktikum fiber optic akan dimasukkan ke silabus semester genap dan alat penunjang akan diajukan ke Sarpras.',
        isOfficial: true,
        isInternalNote: false,
        createdAt: '2026-10-13T10:00:00.000Z'
      },
      {
        id: 'resp-005',
        ticketId: 'tk-003',
        senderName: 'Siti Aminah, S.Kom',
        senderRole: 'Pelapor (Guru)',
        message: 'Terima kasih banyak atas dukungannya Pak Waka Kurikulum. Modul ajar siap kami siapkan bersama tim MGMP sekolah.',
        isOfficial: false,
        isInternalNote: false,
        createdAt: '2026-10-14T15:00:00.000Z'
      }
    ]
  },
  {
    id: 'tk-004',
    ticketCode: 'SMK-7K3N88',
    title: 'Permohonan Pengadaan Kertas Sertifikat & Toner Printer Layanan Administrasi TU',
    description: 'Menjelang pencetakan dokumen kelulusan, rapor semester, dan surat keterangan aktif siswa, persediaan toner printer laserjet di loket pelayanan Tata Usaha tersisa tipis. Kami mengajukan permohonan pengadaan toner cadangan dan 5 rim kertas concord resmi agar pelayanan administrasi tidak terhambat.',
    category: 'keuangan',
    urgency: 'sedang',
    status: 'selesai',
    senderRole: 'pegawai',
    senderName: 'Rudi Hartono (Staf Tata Usaha)',
    senderContact: '081298765432',
    senderIdentifier: 'NIPTT: TU-2023-018',
    privacy: 'publik',
    location: 'Kantor Tata Usaha (Loket Pelayanan)',
    assignedDepartment: 'Kepala Tata Usaha & Bendahara Sekolah',
    aiConfidence: 92,
    aiSuggestedCategory: 'keuangan',
    aiDetectedKeywords: ['administrasi', 'biaya', 'keuangan', 'tu'],
    aiUrgencyReason: 'Kebutuhan logistik operasional administrasi kerja staf tata usaha.',
    createdAt: '2026-10-10T11:00:00.000Z',
    updatedAt: '2026-10-11T13:00:00.000Z',
    responses: [
      {
        id: 'resp-006',
        ticketId: 'tk-004',
        senderName: 'Ibu Rina (Kepala TU & Bendahara)',
        senderRole: 'Kepala Tata Usaha',
        message: 'Pengajuan logistik ATK telah disetujui. Pembelian toner dan kertas telah diproses oleh bagian perlengkapan dan dapat diambil di gudang inventaris hari ini.',
        isOfficial: true,
        isInternalNote: false,
        createdAt: '2026-10-11T13:00:00.000Z'
      }
    ]
  }
];

export function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SMK-${code}`;
}

export function getAllTickets(): AspirationTicket[] {
  if (typeof window === 'undefined') {
    return INITIAL_TICKETS;
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const tickets: AspirationTicket[] = JSON.parse(data);

    // Sanitasi data agar peran senderRole selalu valid ('guru' | 'pegawai')
    let hasChanges = false;
    const sanitized = tickets.map(t => {
      if (t.senderRole !== 'guru' && t.senderRole !== 'pegawai') {
        hasChanges = true;
        return {
          ...t,
          senderRole: 'guru' as Role
        };
      }
      return t;
    });

    if (hasChanges) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }

    return sanitized;
  } catch (err) {
    console.error('Failed reading tickets from storage:', err);
    return INITIAL_TICKETS;
  }
}

export function deleteTicket(ticketIdOrCode: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const clean = ticketIdOrCode.trim().toUpperCase();
    const tickets = getAllTickets();
    const updated = tickets.filter(
      t => t.id !== ticketIdOrCode && t.ticketCode.toUpperCase() !== clean
    );
    saveTickets(updated);
    return true;
  } catch (err) {
    console.error('Failed deleting ticket:', err);
    return false;
  }
}

export function saveTickets(tickets: AspirationTicket[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.error('Failed saving tickets to storage:', err);
  }
}

export function getTicketByCode(code: string): AspirationTicket | undefined {
  const cleanCode = code.trim().toUpperCase();
  const tickets = getAllTickets();
  return tickets.find(t => t.ticketCode.toUpperCase() === cleanCode);
}

export function createNewTicket(input: {
  title: string;
  description: string;
  senderRole: Role;
  senderName: string;
  senderContact?: string;
  senderIdentifier?: string;
  privacy: AspirationTicket['privacy'];
  location?: string;
  manualCategory?: AspirationCategory;
  evidenceUrl?: string;
}): AspirationTicket {
  const analysis = classifyAspiration(input.title + ' ' + input.description);
  const category = input.manualCategory || analysis.category;
  
  let department = 'Waka Bidang Sarpras & Toolman';
  if (category === 'akademik') department = 'Waka Bidang Kurikulum & Kaprogli';
  else if (category === 'kesiswaan') department = 'Waka Kesiswaan, Pembina OSIS & Guru BK';
  else if (category === 'keuangan') department = 'Kepala Tata Usaha & Bendahara Sekolah';
  else if (category === 'lingkungan') department = 'Waka Humas & Hubungan Industri (Hubin)';

  const newTicket: AspirationTicket = {
    id: 'tk-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    ticketCode: generateTicketCode(),
    title: input.title,
    description: input.description,
    category: category,
    urgency: analysis.urgency,
    status: 'terkirim',
    senderRole: input.senderRole,
    senderName: input.privacy === 'anonim' ? 'Anonim' : input.senderName,
    senderContact: input.senderContact,
    senderIdentifier: input.senderIdentifier,
    privacy: input.privacy,
    location: input.location,
    assignedDepartment: department,
    evidenceUrl: input.evidenceUrl,
    aiConfidence: analysis.confidence,
    aiSuggestedCategory: analysis.category,
    aiDetectedKeywords: analysis.detectedKeywords,
    aiUrgencyReason: analysis.urgencyReason,
    responses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const tickets = getAllTickets();
  const updated = [newTicket, ...tickets];
  saveTickets(updated);
  return newTicket;
}

export function addTicketResponse(
  ticketId: string, 
  response: Omit<TicketResponse, 'id' | 'ticketId' | 'createdAt'>
): AspirationTicket | null {
  const tickets = getAllTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  const newResp: TicketResponse = {
    ...response,
    id: 'resp-' + Date.now().toString(36),
    ticketId: ticketId,
    createdAt: new Date().toISOString()
  };

  tickets[index].responses.push(newResp);
  tickets[index].updatedAt = new Date().toISOString();
  
  if (response.isOfficial && (tickets[index].status === 'terkirim' || tickets[index].status === 'diverifikasi' || tickets[index].status === 'didisposisi')) {
    tickets[index].status = 'ditindaklanjuti';
  }

  saveTickets(tickets);
  return tickets[index];
}

export function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus,
  assignedDepartment?: string
): AspirationTicket | null {
  const tickets = getAllTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  tickets[index].status = newStatus;
  if (assignedDepartment) {
    tickets[index].assignedDepartment = assignedDepartment;
  }
  tickets[index].updatedAt = new Date().toISOString();
  saveTickets(tickets);
  return tickets[index];
}

export function getSystemStats() {
  const tickets = getAllTickets();
  const total = tickets.length;
  const selesai = tickets.filter(t => t.status === 'selesai').length;
  const proses = tickets.filter(t => t.status === 'ditindaklanjuti' || t.status === 'didisposisi' || t.status === 'diverifikasi').length;
  const baru = tickets.filter(t => t.status === 'terkirim').length;
  const darurat = tickets.filter(t => t.urgency === 'darurat' || t.urgency === 'tinggi').length;
  
  const completionRate = total > 0 ? Math.round((selesai / total) * 100) : 0;

  const categoryCounts: Record<AspirationCategory, number> = {
    sarpras: tickets.filter(t => t.category === 'sarpras').length,
    akademik: tickets.filter(t => t.category === 'akademik').length,
    kesiswaan: tickets.filter(t => t.category === 'kesiswaan').length,
    keuangan: tickets.filter(t => t.category === 'keuangan').length,
    lingkungan: tickets.filter(t => t.category === 'lingkungan').length
  };

  return {
    total,
    selesai,
    proses,
    baru,
    darurat,
    completionRate,
    categoryCounts
  };
}
