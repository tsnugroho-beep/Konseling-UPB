import React from 'react';
import { 
  ArrowUpRight, 
  Calendar, 
  CheckCircle2, 
  GraduationCap, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Clock 
} from 'lucide-react';
import { DEDICATED_COUNSELOR } from '../data/mockData';

interface PsychologistTeamProps {
  onOpenBooking: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const PsychologistTeam: React.FC<PsychologistTeamProps> = ({ 
  onOpenBooking,
  onNavigateTab
}) => {
  const counselor = DEDICATED_COUNSELOR;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-semibold">
          <UserCheck className="w-4 h-4" />
          <span>Konselor Khusus Mahasiswa</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F3456]">
          Pendampingan Konselor Profesional
        </h2>
        <p className="text-sm sm:text-base text-stone-600">
          Layanan konseling mahasiswa didampingi oleh konselor profesional.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/90 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Avatar & Quick Badges */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-[#F0F9FF] border border-stone-200/80">
            {/* Compassionate Avatar */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8] text-white flex items-center justify-center font-bold text-4xl shadow-md border-4 border-white">
                <UserCheck className="w-12 h-12" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-xs" title="Konselor Mahasiswa">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-stone-900 leading-snug">
              {counselor.name}
            </h3>
            <p className="text-xs font-semibold text-[#0EA5E9] mt-1">
              {counselor.title}
            </p>

            <div className="w-full mt-4 pt-4 border-t border-stone-200/80 space-y-2 text-xs text-stone-600 text-left">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span>Magister Psikologi Profesi Klinis</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span>{counselor.sipp}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span>{counselor.himpsiNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span className="font-semibold text-emerald-700">Layanan 100% Gratis untuk Mahasiswa</span>
              </div>
            </div>

            <div className="w-full mt-6">
              <button
                onClick={onOpenBooking}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-xs transition-colors cursor-pointer"
              >
                <span>Jadwalkan Konseling via Google Form</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Bio, Message, Approaches & Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Welcome Quote */}
            <div className="p-5 rounded-2xl bg-[#0EA5E9]/8 border border-[#0EA5E9]/20 text-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">
                <Heart className="w-4 h-4" />
                <span>Pesan Hangat dari Tim Konselor:</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed italic text-stone-700 font-serif">
                "Halo teman-teman mahasiswa! Masa perkuliahan sering kali dipenuhi oleh ekspektasi tinggi, skripsi yang melelahkan, dan kecemasan akan masa depan. Merasa kewalahan dengan semua ini bukan berarti kamu gagal atau lemah. Di ruang konseling ini, saya hadir sebagai teman bicara yang mendengarkan tanpa menghakimi. Ceritakan apa saja yang mengganjal di hatimu; ruang ini sepenuhnya aman dan 100% rahasia untukmu."
              </p>
            </div>

            {/* Detailed Bio */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Tentang Konselor
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {counselor.bio}
              </p>
            </div>

            {/* Specializations Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Fokus Isu Mahasiswa yang Kerap Didampingi:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {counselor.specializations.map((spec, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 bg-stone-50 border border-stone-200/80 p-2.5 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approaches & Methods */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Pendekatan Konseling:
              </h4>
              <p className="text-xs sm:text-sm text-stone-600">
                {counselor.therapeuticApproach.join(' · ')}
              </p>
            </div>

            {/* Schedule & Availability Box */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
              <div className="space-y-1">
                <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>Jadwal Praktik Konseling:</span>
                </span>
                <span>{counselor.schedule} (Daring Google Meet & Tatap Muka Kampus)</span>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => onNavigateTab('alur-daftar')}
                  className="text-xs font-semibold text-[#0EA5E9] hover:underline cursor-pointer"
                >
                  Lihat Cara Mendaftar →
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
