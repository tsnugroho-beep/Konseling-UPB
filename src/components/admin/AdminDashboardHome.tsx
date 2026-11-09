import React from 'react';
import { 
  BookOpen, 
  Brain, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ExternalLink,
  Eye,
  Heart
} from 'lucide-react';
import { Article, PsychologicalTest } from '../../types';
import { DEFAULT_GOOGLE_FORM_URL } from '../../data/mockData';

interface AdminDashboardHomeProps {
  articles: Article[];
  assessments: PsychologicalTest[];
  googleFormUrl?: string;
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  articles,
  assessments,
  googleFormUrl = DEFAULT_GOOGLE_FORM_URL,
  onNavigateTab,
}) => {
  // Aggregate views and likes
  const totalViews = articles.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + (a.likesCount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0284C7] to-[#0F3456] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat Datang di Panel Pengelola Konseling
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-normal">
            Kelola konten artikel edukasi psikologi, instrumen asesmen kuesioner mahasiswa dari Excel, serta pantau statistik keterbacaan artikel dan respon mahasiswa.
          </p>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Artikel */}
        <div 
          onClick={() => onNavigateTab('artikel')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0EA5E9]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Artikel Edukasi</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">{articles.length}</span>
            <span className="text-xs text-slate-400 ml-1.5">materi aktif</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0284C7] font-semibold">
            <span>Kelola Artikel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metric 2: Total Dilihat */}
        <div 
          onClick={() => onNavigateTab('artikel')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0EA5E9]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Dilihat</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">{totalViews}</span>
            <span className="text-xs text-slate-400 ml-1.5">kali dibaca</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
            <span>Keterbacaan Artikel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metric 3: Total Disukai */}
        <div 
          onClick={() => onNavigateTab('artikel')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-rose-400/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Disukai</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">{totalLikes}</span>
            <span className="text-xs text-slate-400 ml-1.5">respon suka</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold">
            <span>Apresiasi Mahasiswa</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metric 4: Asesmen Psikologi */}
        <div 
          onClick={() => onNavigateTab('asesmen')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0EA5E9]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asesmen Psikologi</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">{assessments.length}</span>
            <span className="text-xs text-slate-400 ml-1.5">alat tes aktif</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
            <span>Kelola Asesmen</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Live Form Shortcut Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Google Form Pendaftaran Konseling</h4>
            <p className="text-xs text-slate-500">Lihat dan tanggapi data reservasi sesi konseling mahasiswa.</p>
          </div>
        </div>

        <a
          href={googleFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>Buka Google Form Editor</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Tabel Rincian Statistik Keterbacaan & Respon Suka Artikel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Statistik Keterbacaan & Respon Artikel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian jumlah pembaca (views) dan jumlah apresiasi suka (likes) per artikel.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('artikel')}
            className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Tulis atau Edit Artikel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table of Articles with Views & Likes */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Judul Artikel</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>Dilihat</span>
                  </span>
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Disukai</span>
                  </span>
                </th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 max-w-xs sm:max-w-md">
                    <span className="font-semibold text-slate-900 block leading-snug truncate">
                      {art.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Terbit: {art.publishedDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                    {art.category}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{art.viewsCount || 0}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{art.likesCount || 0}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigateTab('artikel')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0284C7] hover:bg-sky-50 transition-colors cursor-pointer"
                    >
                      Kelola
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
