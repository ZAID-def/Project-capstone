export type Role = 'siswa' | 'orang_tua' | 'masyarakat' | 'guru' | 'admin';

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

export interface TicketResponse {
  id: string;
  ticketId: string;
  senderName: string;
  senderRole: string; // 'Waka Sarpras', 'Guru BK', 'Pelapor', dll
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
  senderIdentifier?: string; // NISN siswa atau NIK jika bersedia
  privacy: PrivacyLevel;
  
  location?: string; // e.g. "Lab Komputer 3", "Kantin Barat"
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
