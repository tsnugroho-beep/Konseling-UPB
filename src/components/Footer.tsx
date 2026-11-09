import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { CLINIC_ADDRESS, CLINIC_EMAIL, ADMIN_WHATSAPP_NUMBER, ADMIN_WHATSAPP_DISPLAY } from '../data/mockData';

interface FooterProps {
  onOpenBooking?: () => void;
  onNavigateTab?: (tabId: string) => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  return (
    <footer className="bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#075985] dark:from-[#071629] dark:via-[#0A1E36] dark:to-[#061222] text-sky-100 pt-16 pb-12 border-t border-sky-400/40 dark:border-sky-800/65 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-sky-300/25 dark:border-sky-800/50">

          {/* Brand & Mission Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 border border-white/30 shadow-xs shrink-0 overflow-hidden">
                <img
                  src="/assets/aistudio/Konsep_1_c7a81a4a.jpg"
                  alt="Logo DIRMAWA Universitas Pelita Bangsa"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/public/assets/aistudio/Konsep_1_c7a81a4a.jpg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-tight">
                  Konseling Mahasiswa
                </span>
                <span className="text-[11px] text-sky-100/90 font-medium leading-tight mt-0.5">
                  Direktorat Kemahasiswaan dan Alumni
                </span>
                <span className="text-[11px] text-sky-100/90 font-medium leading-tight">
                  Universitas Pelita Bangsa
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed max-w-lg">
              Layanan konseling psikologi mahasiswa yang 100% bebas biaya (free), suportif, dan menjaga privasi secara mutlak. Didampingi langsung oleh konselor profesional.
            </p>
          </div>

          {/* Contact & Physical Clinic */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kontak & Lokasi Konseling
            </h4>
            <div className="space-y-2.5 text-xs text-sky-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7DD3FC] shrink-0 mt-0.5" />
                <span>{CLINIC_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7DD3FC] shrink-0" />
                <a
                  href={`mailto:${CLINIC_EMAIL}`}
                  className="hover:text-white transition-colors"
                >
                  {CLINIC_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7DD3FC] shrink-0" />
                <a
                  href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Admin: {ADMIN_WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Confidentiality Policy */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-200/85">
          <p>
            © {new Date().getFullYear()} Konseling Mahasiswa · Direktorat Kemahasiswaan dan Alumni (DIRMAWA) Universitas Pelita Bangsa.
          </p>
          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center sm:justify-end">
            <span>100% Free untuk Mahasiswa</span>
            <span aria-hidden="true">·</span>
            <span>Kode Etik HIMPSI</span>
            <span aria-hidden="true">·</span>
            <span>Hotline Darurat: 119 ext. 8</span>
            {onOpenAdminLogin && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="text-sky-300 hover:text-white underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-medium"
                >
                  Portal Admin
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
