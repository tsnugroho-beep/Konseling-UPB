import React, { useState } from 'react';
import { PhoneCall, AlertCircle, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { CRISIS_HOTLINES } from '../data/mockData';

export const CrisisBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative z-10 bg-[#075985] dark:bg-[#071629] border-b border-sky-600/40 dark:border-sky-800/70 text-sky-100 text-xs py-2 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-400 animate-pulse" aria-hidden="true" />
            <p className="font-medium tracking-wide text-sky-100">
              Sedang dalam kondisi krisis emosional atau butuh pertolongan darurat? Bantuan selalu tersedia.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="text-white hover:text-sky-200 underline underline-offset-4 font-semibold transition-colors cursor-pointer"
            >
              Lihat Hotline Krisis (24 Jam)
            </button>
            <span className="text-sky-300/60 hidden sm:inline" aria-hidden="true">·</span>
            <a
              href="tel:119"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#0EA5E9] hover:bg-[#0284C7] px-2.5 py-0.5 rounded text-white font-medium transition-colors shadow-xs"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Hubungi 119 ext. 8</span>
            </a>
          </div>
        </div>
      </div>

      {/* Crisis Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crisis-dialog-title"
        >
          <div className="bg-white dark:bg-[#0F243C] max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-sky-800/70 text-[#232F2A] dark:text-slate-100 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-sky-900/60 rounded-full transition-colors cursor-pointer"
              aria-label="Tutup jendela darurat"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 id="crisis-dialog-title" className="text-xl font-bold text-stone-900 dark:text-white">
                  Layanan Tanggap Darurat & Krisis
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">Anda tidak sendirian. Silakan hubungi layanan di bawah ini secara bebas pulsa.</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 dark:text-slate-300 mb-5 leading-relaxed">
              Jika Anda atau seseorang yang Anda kenal sedang mengalami pikiran untuk menyakiti diri, krisis emosi yang luar biasa berat, atau memerlukan bantuan seketika, harap segera menghubungi salah satu saluran darurat berikut:
            </p>

            <div className="space-y-3 mb-6">
              {CRISIS_HOTLINES.map((hotline, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-sky-200/80 dark:border-sky-800/60 bg-sky-50/50 dark:bg-[#15304E]/75 hover:bg-sky-50 dark:hover:bg-[#18375A] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{hotline.name}</span>
                    <span className="text-xs text-[#0284C7] dark:text-sky-200 font-medium bg-sky-100 dark:bg-sky-900/80 px-2 py-0.5 rounded">
                      {hotline.hours}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{hotline.description}</p>
                  <a
                    href={`tel:${hotline.number.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Panggil: {hotline.number}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/45 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 mb-6">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
              <p>
                Layanan konseling reguler di website ini diperuntukkan bagi kasus non-darurat. Untuk kondisi gawat darurat medis, silakan datangi IGD Rumah Sakit terdekat.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-stone-700 dark:text-sky-100 bg-stone-100 dark:bg-sky-900/60 hover:bg-stone-200 dark:hover:bg-sky-800/70 rounded-xl transition-colors cursor-pointer"
              >
                Saya Mengerti, Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
