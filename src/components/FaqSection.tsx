import React, { useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { FAQS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F3456] dark:text-white transition-colors">
          Semua yang Perlu Kamu Ketahui
        </h2>
        <p className="text-sm sm:text-base text-stone-600 dark:text-sky-100/80 transition-colors">
          Transparansi alur pendaftaran Google Form, jaminan bebas biaya (free), dan perlindungan kerahasiaan ceritamu.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-stone-200 dark:border-sky-800/70 rounded-2xl overflow-hidden transition-all bg-white dark:bg-[#0F243C]/95 shadow-2xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 dark:hover:bg-[#132C49]/80 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-white leading-snug">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full bg-[#F0F9FF] dark:bg-[#15304E] border border-stone-200 dark:border-sky-700/60 flex items-center justify-center shrink-0 text-stone-600 dark:text-sky-200 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0EA5E9] dark:text-sky-400' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed border-t border-stone-100 dark:border-sky-800/60 pt-4 animate-in fade-in duration-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ethical commitment notice */}
      <div className="p-6 rounded-3xl bg-[#0EA5E9]/8 dark:bg-[#0F243C]/90 border border-[#0EA5E9]/20 dark:border-sky-700/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#0EA5E9] dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-stone-900 dark:text-white block mb-1">Jaminan Kerahasiaan Sesuai Kode Etik HIMPSI:</strong>
          Seluruh percakapanmu dalam sesi konseling bersifat rahasia mutlak. Ceritamu tidak akan dibocorkan ke dosen pengajar, pihak dekanat, maupun orang tua.
        </div>
      </div>

    </div>
  );
};
