import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigateTab }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-16 text-center space-y-8 animate-in fade-in duration-300">
      
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F3456] dark:text-white leading-[1.18] text-balance transition-colors">
        Ruang Aman Mahasiswa untuk Bernapas, Bercerita, dan Bertumbuh.
      </h1>

      <p className="text-base sm:text-lg text-slate-600 dark:text-sky-100/80 leading-relaxed max-w-2xl mx-auto font-normal transition-colors">
        Kamu tidak perlu memikul sendirian tekanan tugas yang menumpuk, kebuntuan saat menyusun skripsi, maupun rasa cemas akan masa depan. Didampingi konselor profesional, temukan kembali ketenangan batinmu melalui sesi konseling yang suportif, gratis, dan dijamin kerahasiaannya 100%.
      </p>

      {/* Strategic CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        <button
          onClick={onOpenBooking}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <span>Daftar Konseling (Google Form)</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>

        <button
          onClick={() => onNavigateTab('tes-psikologi')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-[#0369A1] dark:text-sky-200 bg-white dark:bg-[#112844] hover:bg-sky-50 dark:hover:bg-[#173458] border border-sky-200 dark:border-sky-700/70 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <span>Ikuti Tes Psikologi Singkat</span>
        </button>
      </div>

    </div>
  );
};

