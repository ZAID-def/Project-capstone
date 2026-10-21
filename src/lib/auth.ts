export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'superadmin' | 'waka_sarpras' | 'guru_bk' | 'waka_kurikulum' | 'tata_usaha';
  roleLabel: string;
  avatarUrl?: string;
}

export const DEFAULT_ADMIN: AdminUser = {
  id: 'adm-001',
  name: 'Administrator SMK IT Baitul Aziz',
  username: 'admin',
  email: 'admin@smkitbaitulaziz.sch.id',
  role: 'superadmin',
  roleLabel: 'Super Admin / Manajemen Sekolah'
};

const AUTH_STORAGE_KEY = 'smk_baitul_aziz_admin_session';

export function getStoredSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca sesi login:', err);
    return null;
  }
}

export function saveSession(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    // Set a lightweight cookie so Next.js or route handlers can also check if needed
    document.cookie = `smk_admin_logged=true; path=/; max-age=86400; SameSite=Lax`;
  } catch (err) {
    console.error('Gagal menyimpan sesi:', err);
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `smk_admin_logged=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (err) {
    console.error('Gagal menghapus sesi:', err);
  }
}

export function authenticate(usernameOrEmail: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
  const cleanInput = usernameOrEmail.trim().toLowerCase();
  
  // Validasi kredensial default
  const isValidUsername = cleanInput === 'admin' || cleanInput === 'admin@smkitbaitulaziz.sch.id';
  const isValidPassword = password === 'admin123' || password === 'smkhebat2026';

  if (isValidUsername && isValidPassword) {
    saveSession(DEFAULT_ADMIN);
    return { success: true, user: DEFAULT_ADMIN };
  }

  // Akun Petugas Khusus Bimbingan Konseling
  if ((cleanInput === 'bk' || cleanInput === 'bk@smkitbaitulaziz.sch.id') && (password === 'bk123')) {
    const bkUser: AdminUser = {
      id: 'adm-002',
      name: 'Ibu Ratna, S.Pd (Guru BK)',
      username: 'bk',
      email: 'bk@smkitbaitulaziz.sch.id',
      role: 'guru_bk',
      roleLabel: 'Guru Bimbingan Konseling & Satgas Kesiswaan'
    };
    saveSession(bkUser);
    return { success: true, user: bkUser };
  }

  // Akun Petugas Sarana Prasarana
  if ((cleanInput === 'sarpras' || cleanInput === 'sarpras@smkitbaitulaziz.sch.id') && (password === 'sarpras123')) {
    const sarprasUser: AdminUser = {
      id: 'adm-003',
      name: 'Bpk. Hendra (Koordinator Sarpras)',
      username: 'sarpras',
      email: 'sarpras@smkitbaitulaziz.sch.id',
      role: 'waka_sarpras',
      roleLabel: 'Waka Bidang Sarana & Prasarana'
    };
    saveSession(sarprasUser);
    return { success: true, user: sarprasUser };
  }

  return {
    success: false,
    error: 'Username atau kata sandi tidak sesuai. Silakan gunakan kredensial resmi SMK IT Baitul Aziz.'
  };
}
