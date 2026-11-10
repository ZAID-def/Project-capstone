export type Role = 'guru' | 'pegawai';

export type PrivacyLevel = 'publik' | 'privat' | 'anonim';

export type AspirationCategory = 
  | 'sarpras' 
  | 'akademik' 
  | 'kesiswaan' 
  | 'keuangan' 
  | 'lingkungan';

export type UrgencyLevel = 'rendah' | 'sedang' | 'tinggi' | 'darurat';

export type TicketStatus = 
  | 'terkirim'
  | 'diverifikasi'
  | 'didisposisi'
  | 'ditindaklanjuti'
  | 'selesai'
  | 'ditolak';

export interface RoleConfig {
  id: Role;
  label: string;
  shortLabel: string;
  subtitle: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  description: string;
}

export const STAKEHOLDER_ROLES: Record<Role, RoleConfig> = {
  guru: {
    id: 'guru',
    label: 'Guru / Tenaga Pendidik',
    shortLabel: 'Guru',
    subtitle: 'Dewan Guru SMK IT Baitul Aziz',
    identifierLabel: 'NIP / NUPTK / Kode Guru',
    identifierPlaceholder: 'Contoh: 198204122006041005 / NUPTK / Kode Guru',
    description: 'Guru mata pelajaran umum, kejuruan/produktif, wali kelas & guru BK'
  },
  pegawai: {
    id: 'pegawai',
    label: 'Pegawai / Tenaga Kependidikan',
    shortLabel: 'Pegawai',
    subtitle: 'Staf & Karyawan Sekolah',
    identifierLabel: 'NIP / NIPTT / Unit Kerja',
    identifierPlaceholder: 'Contoh: Tata Usaha / Laboran TI / Teknisi Sarpras',
    description: 'Staf Tata Usaha, laboran, teknisi/toolman, tenaga kebersihan & sekuriti'
  }
};

export interface TicketResponse {
  id: string;
  ticketId: string;
  senderName: string;
  senderRole: string; // 'Waka Sarpras', 'Guru BK', 'Pelapor (Guru)', dll
  message: string;
  isOfficial: boolean; // Tanggapan resmi dari pihak sekolah
  isInternalNote: boolean; // Hanya bisa dibaca oleh admin/guru
  createdAt: string;
  attachments?: string[];
}

export interface AspirationTicket {
  id: string;
  ticketCode: string; // Misal: SMK-8X2K9P
  title: string;
  description: string;
  category: AspirationCategory;
  urgency: UrgencyLevel;
  status: TicketStatus;
  
  senderRole: Role;
  senderName: string;
  senderContact?: string; // No WA / Email untuk update
  senderIdentifier?: string; // NIP/NUPTK untuk guru atau NIP/Unit Kerja untuk pegawai
  privacy: PrivacyLevel;
  
  location?: string; // e.g. "Lab Komputer 3", "Ruang Guru", "Kantor TU"
  assignedDepartment?: string; // e.g. "Waka Sarpras", "Guru BK"
  evidenceUrl?: string; // URL bukti gambar/dokumen
  
  // Fitur Analisis Topik Otomatis
  aiConfidence?: number; // 0 - 100
  aiSuggestedCategory?: AspirationCategory;
  aiDetectedKeywords?: string[];
  aiUrgencyReason?: string;
  
  responses: TicketResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: AspirationCategory;
  label: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}
