import { Article, PsychologicalTest, FaqItem } from '../types';
import { ARTICLES, PSYCHOLOGICAL_TESTS, FAQS } from './mockData';

export const ADMIN_AUTH_STORAGE_KEY = 'upb_admin_auth_user';
export const ADMIN_DATA_STORAGE_KEY = 'upb_counseling_admin_data';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  loggedAt: string;
}

export interface RegistrationStep {
  num?: string;
  title: string;
  desc: string;
  tips?: string;
}

export const DEFAULT_REGISTRATION_STEPS: RegistrationStep[] = [
  {
    num: '01',
    title: 'Pilih Topik Konseling',
    desc: 'Tentukan kebutuhanmu (stres skripsi, overthinking masa depan, atau adaptasi pertemanan) dan pilih preferensi sesi: Daring (Google Meet) atau Tatap Muka di kampus.',
    tips: '100% Bebas biaya bagi seluruh mahasiswa aktif.',
  },
  {
    num: '02',
    title: 'Isi Google Form',
    desc: 'Klik tombol pendaftaran untuk membuka Google Form. Kamu hanya perlu mengisi Nama, Program Studi, NIM (Nomor Induk Mahasiswa), nomor WhatsApp aktif, dan beberapa kalimat tentang kendalamu.',
    tips: 'Tanpa perlu membuat akun website baru, selesai dalam 2 menit.',
  },
  {
    num: '03',
    title: 'Konfirmasi via WhatsApp',
    desc: 'Tim admin kami akan menghubungi WhatsApp-mu untuk mencocokkan jadwal luang kuliahmu dengan jadwal sesi konseling.',
    tips: 'Jadwal fleksibel di sela-sela jam perkuliahanmu.',
  },
  {
    num: '04',
    title: 'Mulai Sesi Konseling',
    desc: 'Tautan Google Meet pribadi akan dikirimkan sebelum sesi, atau staf kami siap menyambutmu di ruang konseling kampus. Ceritakan semua bebanmu dalam ruang yang 100% rahasia.',
    tips: 'Konselor mendampingi dengan tenang tanpa menghakimi.',
  },
];

export interface RegistrationSettings {
  googleFormUrl: string;
  adminWhatsApp: string;
  operatingHours: string;
  clinicAddress: string;
  headerTitle: string;
  headerSubtitle: string;
  steps: RegistrationStep[];
}

export const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  googleFormUrl: 'https://docs.google.com/forms/d/1TL92gXenIiGsvvb6LE3p3pYMWhQ57fdQl2Tw8B8DGEc/edit',
  adminWhatsApp: '6285158804981',
  operatingHours: 'Senin – Jumat | 09.00 – 16.00 WIB',
  clinicAddress: 'Direktorat Kemahasiswaan dan Alumni, Lt. 2, Gedung B Universitas Pelita Bangsa',
  headerTitle: 'Cara Mendaftar Konseling via Google Form',
  headerSubtitle: 'Kami sengaja menggunakan sistem pendaftaran Google Form agar kamu dapat mendaftar dengan praktis, aman, dan tanpa hambatan teknis akun.',
  steps: DEFAULT_REGISTRATION_STEPS,
};

export interface AdminStoredData {
  articles: Article[];
  assessments: PsychologicalTest[];
  registrationSettings?: RegistrationSettings;
  faqs?: FaqItem[];
  updatedAt: string;
}

// Provisioned Admin Accounts from data akun (Protected with SHA-256 password hashing)
export interface ProvisionedAdmin {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}

export const PROVISIONED_ADMINS: ProvisionedAdmin[] = [
  {
    name: 'Khansa Nadya Atika Rahma, S.Psi., M.M.',
    email: 'ndy.data@gmail.com',
    role: 'Pengelola Layanan Konseling',
    passwordHash: '7fee2972f2bce957b6244feb76b150d4d36be148c2eb0a31eaade4160ae62c66', // Khansa_8029
  },
  {
    name: 'Taufiqillah Sapto Nugroho, S.M',
    email: 'tsnugroho@pelitabangsa.ac.id',
    role: 'Administrator Sistem DIRMAWA',
    passwordHash: '64b97efce4ad72d26446380031bd16df04911978bfdab0544542d277f62c5f7e', // Taufiq_0480
  },
  {
    name: 'Arfianda Firsta Satritama',
    email: 'arfiandafirsta@gmail.com',
    role: 'Staf Pengelola Konseling',
    passwordHash: 'a63dbd6c03eca97a4c58b9255445440e789fdd2f9490973aae02de696366274f', // Arfianda_0377
  },
];

// Browser-native SHA-256 hashing helper
export async function sha256Hex(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Helper to get stored admin data or initialize from mockData
export function getAdminStoredData(): AdminStoredData {
  try {
    const raw = localStorage.getItem(ADMIN_DATA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.articles) && Array.isArray(parsed.assessments)) {
        const mergedArticles = parsed.articles.map((art: Article) => {
          const defaultMatch = ARTICLES.find((a) => a.id === art.id);
          return {
            ...art,
            viewsCount: typeof art.viewsCount === 'number' ? art.viewsCount : (defaultMatch?.viewsCount ?? 0),
            likesCount: typeof art.likesCount === 'number' ? art.likesCount : (defaultMatch?.likesCount ?? 0),
          };
        });

        const mergedSettings: RegistrationSettings = parsed.registrationSettings ? {
          ...DEFAULT_REGISTRATION_SETTINGS,
          ...parsed.registrationSettings,
          steps: Array.isArray(parsed.registrationSettings.steps) && parsed.registrationSettings.steps.length > 0 
            ? parsed.registrationSettings.steps 
            : DEFAULT_REGISTRATION_STEPS,
        } : DEFAULT_REGISTRATION_SETTINGS;

        const mergedFaqs: FaqItem[] = Array.isArray(parsed.faqs) && parsed.faqs.length > 0
          ? parsed.faqs
          : FAQS;

        return {
          ...parsed,
          articles: mergedArticles,
          registrationSettings: mergedSettings,
          faqs: mergedFaqs,
        };
      }
    }
  } catch (err) {
    console.error('Gagal membaca admin stored data:', err);
  }

  // Initial fallback to mockData
  const initialData: AdminStoredData = {
    articles: ARTICLES,
    assessments: PSYCHOLOGICAL_TESTS,
    registrationSettings: DEFAULT_REGISTRATION_SETTINGS,
    faqs: FAQS,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(ADMIN_DATA_STORAGE_KEY, JSON.stringify(initialData));
  } catch {}

  return initialData;
}

// Helper to save admin data and dispatch storage event
export function saveAdminStoredData(data: AdminStoredData): void {
  try {
    data.updatedAt = new Date().toISOString();
    localStorage.setItem(ADMIN_DATA_STORAGE_KEY, JSON.stringify(data));
    // Dispatch a custom event in same window so active React components update immediately
    window.dispatchEvent(new Event('upb_admin_data_updated'));
  } catch (err) {
    console.error('Gagal menyimpan admin stored data:', err);
  }
}

// Helper to check logged in admin
export function getLoggedInAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function saveLoggedInAdmin(admin: AdminUser): void {
  try {
    localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(admin));
  } catch {}
}

export function clearLoggedInAdmin(): void {
  try {
    localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  } catch {}
}

// ==============================================================
// ARTICLE VIEWS & LIKES TRACKING
// ==============================================================

const LIKED_ARTICLES_STORAGE_KEY = 'upb_liked_article_ids';

export function isArticleLiked(articleId: string): boolean {
  try {
    const raw = localStorage.getItem(LIKED_ARTICLES_STORAGE_KEY);
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      return Array.isArray(ids) && ids.includes(articleId);
    }
  } catch {}
  return false;
}

export function incrementArticleView(articleId: string): void {
  try {
    const data = getAdminStoredData();
    let hasChanged = false;
    const updated = data.articles.map((art) => {
      if (art.id === articleId) {
        hasChanged = true;
        return {
          ...art,
          viewsCount: (art.viewsCount || 0) + 1,
        };
      }
      return art;
    });

    if (hasChanged) {
      saveAdminStoredData({
        ...data,
        articles: updated,
      });
    }
  } catch (err) {
    console.error('Gagal menambah view artikel:', err);
  }
}

export function toggleArticleLike(articleId: string): { isLiked: boolean; newLikesCount: number } {
  try {
    let likedIds: string[] = [];
    try {
      const raw = localStorage.getItem(LIKED_ARTICLES_STORAGE_KEY);
      if (raw) likedIds = JSON.parse(raw);
    } catch {}

    const currentlyLiked = likedIds.includes(articleId);
    let nextLikedIds: string[];
    let delta = 0;

    if (currentlyLiked) {
      nextLikedIds = likedIds.filter((id) => id !== articleId);
      delta = -1;
    } else {
      nextLikedIds = [...likedIds, articleId];
      delta = 1;
    }

    try {
      localStorage.setItem(LIKED_ARTICLES_STORAGE_KEY, JSON.stringify(nextLikedIds));
    } catch {}

    const data = getAdminStoredData();
    let calculatedCount = 0;
    const updated = data.articles.map((art) => {
      if (art.id === articleId) {
        const current = art.likesCount || 0;
        calculatedCount = Math.max(0, current + delta);
        return {
          ...art,
          likesCount: calculatedCount,
        };
      }
      return art;
    });

    saveAdminStoredData({
      ...data,
      articles: updated,
    });

    return {
      isLiked: !currentlyLiked,
      newLikesCount: calculatedCount,
    };
  } catch (err) {
    console.error('Gagal memperbarui like artikel:', err);
    return { isLiked: false, newLikesCount: 0 };
  }
}

