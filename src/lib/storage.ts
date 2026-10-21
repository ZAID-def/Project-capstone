import { AspirationTicket, TicketResponse, TicketStatus, AspirationCategory } from '@/types';
import { classifyAspiration } from './nlpClassifier';

const STORAGE_KEY = 'aspirasi_smk_baitul_aziz_v2';

// Data awal realistis untuk SMK IT Baitul Aziz
export const INITIAL_TICKETS: AspirationTicket[] = [
  {
    id: 'tk-001',
    ticketCode: 'SMK-8X2K91',
    title: 'AC di Lab RPL 2 Mati dan Komputer Sering Overheat',
    description: 'Mohon bantuannya bapak/ibu tim sarpras SMK IT Baitul Aziz, sudah 3 hari ini pendingin ruangan (AC) di Lab Komputer RPL 2 tidak menyala sama sekali. Saat praktik pemrograman web, ruangan terasa sangat panas dan beberapa CPU komputer sering mati mendadak (overheating) karena suhu ruangan terlalu panas.',
    category: 'sarpras',
    urgency: 'tinggi',
    status: 'ditindaklanjuti',
    senderRole: 'siswa',
    senderName: 'M. Rizky Pratama',
    senderContact: 'rizky.rpl@smkitbaitulaziz.sch.id',
    senderIdentifier: '0076231920',
    privacy: 'publik',
    location: 'Lab Komputer RPL 2 (Lantai 2 Gedung B)',
    assignedDepartment: 'Waka Bidang Sarpras & Toolman',
    aiConfidence: 94,
    aiSuggestedCategory: 'sarpras',
    aiDetectedKeywords: ['komputer', 'lab', 'ac', 'rusak', 'panas', 'sarpras'],
    aiUrgencyReason: 'Terdeteksi kendala sarana vital ("komputer", "ac") yang mengganggu aktivitas praktik belajar.',
    createdAt: '2026-10-15T08:30:00.000Z',
    updatedAt: '2026-10-16T10:15:00.000Z',
    responses: [
      {
        id: 'resp-001',
        ticketId: 'tk-001',
        senderName: 'Pak Hendra (Toolman Sarpras)',
        senderRole: 'Tim Sarpras',
        message: 'Terima kasih atas laporannya. Teknisi pendingin ruangan eksternal telah dihubungi dan dijadwalkan datang besok pagi pukul 09.00 WIB untuk penggantian kapasitor kompresor AC. Sementara waktu siswa dipersilakan membuka jendela samping lab.',
        isOfficial: true,
        isInternalNote: false,
        createdAt: '2026-10-15T11:00:00.000Z'
      },
      {
        id: 'resp-002',
        ticketId: 'tk-001',
        senderName: 'M. Rizky Pratama',
        senderRole: 'Pelapor (Siswa)',
        message: 'Baik pak terima kasih banyak atas respons cepatnya, kami tunggu penanganannya.',
        isOfficial: false,
        isInternalNote: false,
        createdAt: '2026-10-15T12:20:00.000Z'
      }
    ]
  },
  {
    id: 'tk-002',
    ticketCode: 'SMK-4M7P02',
    title: 'Laporan Dugaan Pemalakan dan Intimidasi di Belakang Bengkel',
    description: 'Saya ingin melaporkan secara rahasia kepada pihak SMK IT Baitul Aziz. Sering ada gerombolan siswa yang nongkrong di dekat kantin pojok belakang saat jam istirahat kedua dan meminta paksa uang jajan adik kelas dengan ancaman kekerasan. Mohon ada patroli guru piket di area tersebut karena kami takut melintas.',
    category: 'kesiswaan',
    urgency: 'darurat',
    status: 'didisposisi',
    senderRole: 'siswa',
    senderName: 'Anonim',
    privacy: 'anonim',
    location: 'Belakang Bengkel & Kantin Pojok',
    assignedDepartment: 'Waka Kesiswaan, Pembina OSIS & Guru BK',
    aiConfidence: 96,
    aiSuggestedCategory: 'kesiswaan',
    aiDetectedKeywords: ['ancaman', 'kekerasan', 'dipalak', 'senior'],
    aiUrgencyReason: 'Terdeteksi indikasi situasi darurat / ancaman kekerasan fisik dan pemalakan di lingkungan sekolah.',
    createdAt: '2026-10-16T13:45:00.000Z',
    updatedAt: '2026-10-16T14:30:00.000Z',
    responses: [
      {
        id: 'resp-003',
        ticketId: 'tk-002',
        senderName: 'Ibu Ratna, S.Pd (Guru BK)',
        senderRole: 'Guru Bimbingan Konseling',
        message: 'Laporan telah diterima secara privat oleh Tim Satgas Kesiswaan dan Guru BK SMK IT Baitul Aziz. Mulai hari ini guru piket dan satpam telah ditugaskan melakukan patroli rutin di titik rawan tersebut. Identitas pelapor dijamin 100% aman dan rahasia.',
        isOfficial: true,
        isInternalNote: false,
        createdAt: '2026-10-16T14:30:00.000Z'
      }
    ]
  },
  {
    id: 'tk-003',
    ticketCode: 'SMK-1V9Q33',
    title: 'Permohonan Transparansi dan Sosialisasi Tempat Magang / PKL Industri',
    description: 'Selamat siang bapak/ibu guru SMK IT Baitul Aziz. Kami sebagai orang tua siswa kelas XI jurusan Teknik Komputer Jaringan ingin menanyakan kejelasan jadwal pemberangkatan PKL ke industri. Apakah ada daftar perusahaan mitra industri yang sudah bekerja sama dengan sekolah agar kami bisa mempersiapkan transportasi dan akomodasi anak kami?',
    category: 'akademik',
    urgency: 'sedang',
    status: 'selesai',
    senderRole: 'orang_tua',
    senderName: 'Bambang Sudarmono (Wali Murid)',
    senderContact: 'bambang.sdm@gmail.com',
    privacy: 'publik',
    location: 'Ruang Hubin / Kurikulum',
    assignedDepartment: 'Waka Bidang Kurikulum & Kaprogli',
    aiConfidence: 89,
    aiSuggestedCategory: 'akademik',
    aiDetectedKeywords: ['magang', 'pkl', 'industri', 'guru', 'jadwal'],
    aiUrgencyReason: 'Pertanyaan persiapan kurikulum magang/PKL industri.',
    createdAt: '2026-10-12T09:10:00.000Z',
    updatedAt: '2026-10-14T15:00:00.000Z',
    responses: [
      {
        id: 'resp-004',
        ticketId: 'tk-003',
        senderName: 'Bpk. Ahmad Fauzi (Ketua Pokja PKL & Humas)',
        senderRole: 'Waka Humas & Hubin',
        message: 'Bapak Bambang yang terhormat, terima kasih atas atensinya. Surat edaran resmi mengenai daftar 24 mitra industri dan panduan PKL TKJ telah kami kirimkan via grup wali murid kelas XI dan dapat diunduh di portal sekolah. Sosialisasi luring akan diadakan Sabtu ini pukul 09.00 WIB di aula SMK IT Baitul Aziz.',
        isOfficial: true,
        isInternalNote: false,
        createdAt: '2026-10-13T10:00:00.000Z'
      },
      {
        id: 'resp-005',
        ticketId: 'tk-003',
        senderName: 'Bambang Sudarmono (Wali Murid)',
        senderRole: 'Pelapor (Orang Tua)',
        message: 'Terima kasih informasinya Pak Ahmad. Sangat jelas dan membantu kami.',
        isOfficial: false,
        isInternalNote: false,
        createdAt: '2026-10-14T15:00:00.000Z'
      }
    ]
  },
  {
    id: 'tk-004',
    ticketCode: 'SMK-7K3N88',
    title: 'Informasi Alur Pengajuan Keringanan SPP / Bantuan PIP',
    description: 'Mohon info dari bagian tata usaha mengenai persyaratan pengajuan bantuan Program Indonesia Pintar (PIP) bagi siswa yatim berprestasi di SMK IT Baitul Aziz. Syarat apa saja yang harus diserahkan ke ruang tata usaha?',
    category: 'keuangan',
    urgency: 'sedang',
    status: 'selesai',
    senderRole: 'siswa',
    senderName: 'Siti Nurhaliza',
    senderContact: '081298765432',
    privacy: 'publik',
    location: 'Kantor Tata Usaha',
    assignedDepartment: 'Kepala Tata Usaha & Bendahara Sekolah',
    aiConfidence: 92,
    aiSuggestedCategory: 'keuangan',
    aiDetectedKeywords: ['spp', 'pip', 'biaya', 'administrasi', 'bantuan'],
    aiUrgencyReason: 'Konsultasi administrasi beasiswa/PIP sekolah.',
    createdAt: '2026-10-10T11:00:00.000Z',
    updatedAt: '2026-10-11T13:00:00.000Z',
    responses: [
      {
        id: 'resp-006',
        ticketId: 'tk-004',
        senderName: 'Ibu Rina (Staff Tata Usaha)',
        senderRole: 'Tata Usaha',
        message: 'Halo Siti, silakan membawa fotokopi Kartu Keluarga, SKTM dari kelurahan setempat, dan fotokopi raport semester lalu ke loket TU pada hari kerja jam 08.00 - 14.00 WIB untuk diverifikasi ke sistem Dapodik.',
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
    // Otomatis hapus aspirasi SMK-Q9LN3F dan SMK-ENV5RG jika ada di storage browser
    const filtered = tickets.filter(
      t => t.ticketCode !== 'SMK-Q9LN3F' && t.ticketCode !== 'SMK-ENV5RG'
    );
    if (filtered.length !== tickets.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    }
    return tickets;
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
  senderRole: AspirationTicket['senderRole'];
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
