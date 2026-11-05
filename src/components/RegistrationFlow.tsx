import React from 'react';
import {
  CheckCircle2,
  FileEdit,
  MessageSquare,
  CalendarClock,
  Video
} from 'lucide-react';

interface RegistrationFlowProps {
  googleFormUrl?: string;
  onOpenBookingModal?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = () => {
  const steps = [
    {
      num: '01',
      title: 'Pilih Topik Konseling',
      icon: CalendarClock,
      desc: 'Tentukan kebutuhanmu (stres skripsi, overthinking masa depan, atau adaptasi pertemanan) dan pilih preferensi sesi: Daring (Google Meet) atau Tatap Muka di kampus.',
      tips: '100% Bebas biaya bagi seluruh mahasiswa aktif.',
    },
    {
      num: '02',
      title: 'Isi Google Form Resmi',
      icon: FileEdit,
      desc: 'Klik tombol pendaftaran untuk membuka Google Form. Kamu hanya perlu mengisi Nama, Program Studi, NIM (Nomor Induk Mahasiswa), nomor WhatsApp aktif, dan beberapa kalimat tentang kendalamu.',
      tips: 'Tanpa perlu membuat akun website baru, selesai dalam 2 menit.',
    },
    {
      num: '03',
      title: 'Konfirmasi via WhatsApp',
      icon: MessageSquare,
      desc: 'Tim admin kami akan menghubungi WhatsApp-mu untuk mencocokkan jadwal luang kuliahmu dengan jadwal sesi konseling.',
      tips: 'Jadwal fleksibel di sela-sela jam perkuliahanmu.',
    },
    {
      num: '04',
      title: 'Mulai Sesi Konseling',
      icon: Video,
      desc: 'Tautan Google Meet pribadi akan dikirimkan sebelum sesi, atau staf kami siap menyambutmu di ruang konseling kampus. Ceritakan semua bebanmu dalam ruang yang 100% rahasia.',
      tips: 'Konselor mendampingi dengan tenang tanpa menghakimi.',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F3456] dark:text-white transition-colors">
          Cara Mendaftar Konseling via Google Form
        </h2>
        <p className="text-sm sm:text-base text-stone-600 dark:text-sky-100/80 transition-colors">
          Kami sengaja menggunakan sistem pendaftaran Google Form resmi agar kamu dapat mendaftar dengan praktis, aman, dan tanpa hambatan teknis akun.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F243C]/95 border border-stone-200/90 dark:border-sky-800/70 shadow-2xs flex flex-col justify-between hover:border-stone-300 dark:hover:border-sky-600/70 transition-colors relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold font-mono text-[#0EA5E9]/40 dark:text-sky-400/45 tabular-nums">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] dark:bg-[#15304E] border border-stone-200 dark:border-sky-700/60 text-[#0EA5E9] dark:text-sky-300 flex items-center justify-center shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-sky-800/60 text-[11px] text-stone-500 dark:text-slate-400 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9] dark:text-sky-400 shrink-0 mt-0.5" />
                <span>{step.tips}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
