import React from 'react';
import { ArrowUpRight, CheckCircle2, Clock, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { COUNSELING_SERVICES } from '../data/mockData';
import { CounselingService } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: CounselingService) => void;
  onNavigateTab: (tabId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectService, 
  onNavigateTab 
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Layanan Konseling Mahasiswa 100% Bebas Biaya (Free)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F3456]">
          Fokus Pendampingan Masalah Mahasiswa
        </h2>
        <p className="text-sm sm:text-base text-stone-600">
          Seluruh sesi konseling didampingi langsung oleh konselor profesional. Bebas biaya bagi mahasiswa aktif cukup dengan mengisi Google Form.
        </p>
      </div>

      {/* Free Benefit Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0EA5E9]/8 border border-[#0EA5E9]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold shrink-0">
            FREE
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Disediakan Khusus untuk Kesejahteraan Mahasiswa</span>
            <span className="text-stone-600 text-xs">Tanpa dipungut biaya sepeserpun. Cukup cantumkan Nama & NIM pada Google Form.</span>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('alur-daftar')}
          className="px-4 py-2 text-xs font-semibold text-[#0EA5E9] bg-white border border-[#0EA5E9]/30 hover:bg-stone-50 rounded-xl transition-colors shrink-0 self-start sm:self-center cursor-pointer"
        >
          Lihat Alur Pendaftaran →
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {COUNSELING_SERVICES.map((service) => (
          <div
            key={service.id}
            className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all bg-white border ${
              service.isPopular
                ? 'border-[#0EA5E9]/50 shadow-sm ring-1 ring-[#0EA5E9]/15 relative'
                : 'border-stone-200/90 shadow-2xs hover:border-stone-300'
            }`}
          >
            <div>
              {/* Popular / Student Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  100% Free / Bebas Biaya
                </span>
                {service.isPopular && (
                  <span className="text-[11px] text-[#0EA5E9] font-semibold">
                    Topik Paling Sering
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                {service.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#0EA5E9] font-medium mb-4">
                {service.subtitle}
              </p>

              {/* Metadata strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 py-3 border-y border-stone-100 mb-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{service.duration}</span>
                </span>
                <span className="text-stone-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{service.format}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 font-normal">
                {service.description}
              </p>

              {/* Target Audience */}
              <div className="mb-6 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-700">
                <span className="font-semibold text-stone-900">Ditujukan untuk: </span>
                <span>{service.targetAudience}</span>
              </div>

              {/* Key Outcomes */}
              <div className="space-y-2 mb-8">
                <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Hasil yang Ingin Dicapai:
                </p>
                <ul className="space-y-2">
                  {service.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600">
                      <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Free Action Footer */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-500 block">Biaya Sesi:</span>
                <span className="text-sm font-bold text-emerald-700">100% GRATIS / Free</span>
              </div>

              <button
                onClick={() => onSelectService(service)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-xs transition-all cursor-pointer"
              >
                <span>Daftar via Google Form</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
