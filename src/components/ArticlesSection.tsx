import React, { useState } from 'react';
import { Search, BookOpen, Clock, Calendar, ArrowRight, X, UserCheck, Heart, Sparkles, Share2, GraduationCap } from 'lucide-react';
import { ARTICLES } from '../data/mockData';
import { Article } from '../types';

interface ArticlesSectionProps {
  onOpenBooking: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ 
  onOpenBooking,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [shareToast, setShareToast] = useState(false);

  const categories = [
    'Semua',
    'Regulasi Emosi',
    'Karir & Akademik',
    'Hubungan & Relasi',
    'Self-Compassion',
    'Panduan Konseling',
  ];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'Semua' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.intro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = (article: Article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F3456] dark:text-white transition-colors">
            Wawasan & Tips Merawat Diri di Kampus
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-sky-100/80 transition-colors">
            Panduan praktis berbasis psikologi yang disusun untuk menemanimu melewati masa perkuliahan.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik skripsi, stres, dll..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#0F243C] border border-stone-200 dark:border-sky-800/70 focus:outline-hidden focus:border-[#0EA5E9] dark:focus:border-sky-400 transition-all text-stone-900 dark:text-white dark:placeholder:text-slate-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#0EA5E9] text-white shadow-2xs'
                  : 'bg-white dark:bg-[#0F243C] text-stone-600 dark:text-sky-100/85 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-sky-800/70 hover:bg-stone-50 dark:hover:bg-[#15304E]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="group rounded-3xl p-6 bg-white dark:bg-[#0F243C]/95 border border-stone-200/90 dark:border-sky-800/70 flex flex-col justify-between hover:border-[#0EA5E9]/40 dark:hover:border-sky-500/60 hover:shadow-sm transition-all cursor-pointer"
            >
              <div>
                {/* Zero-Pill Clean Metadata */}
                <div className="flex items-center gap-2 text-xs text-[#0EA5E9] dark:text-sky-400 font-semibold mb-3">
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-500 dark:text-slate-400 font-normal">{article.readTime}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white group-hover:text-[#0EA5E9] dark:group-hover:text-sky-300 transition-colors leading-snug mb-3">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-sky-800/60 flex items-center justify-between">
                <div className="text-xs text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#0EA5E9] dark:text-sky-400" />
                  <span className="font-medium text-stone-800 dark:text-sky-100 truncate max-w-[170px]">{article.author.name}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0EA5E9] dark:text-sky-400 group-hover:text-[#0284C7] dark:group-hover:text-sky-300 transition-colors">
                  <span>Baca</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F243C]/90 rounded-2xl border border-dashed border-stone-300 dark:border-sky-800/70 p-8">
          <p className="text-stone-600 dark:text-slate-300 font-medium text-sm">Tidak ada artikel yang cocok dengan pencarian "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
            className="mt-3 text-xs font-semibold text-[#0EA5E9] dark:text-sky-400 hover:underline cursor-pointer"
          >
            Reset filter pencarian
          </button>
        </div>
      )}

      {/* Full Article Reading Modal */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0F243C] max-w-3xl w-full rounded-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-stone-200 dark:border-sky-800/70 text-[#1E3348] dark:text-slate-100 relative my-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="sticky top-0 float-right z-10 p-2 text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white bg-white/90 dark:bg-[#15304E]/90 hover:bg-stone-100 dark:hover:bg-sky-800/80 rounded-full transition-colors cursor-pointer shadow-xs"
              aria-label="Tutup artikel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article Header */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-xs text-[#0EA5E9] dark:text-sky-400 font-semibold">
                <span>{activeArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-500 dark:text-slate-400 font-normal">{activeArticle.readTime}</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-500 dark:text-slate-400 font-normal">{activeArticle.publishedDate}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white leading-tight">
                {activeArticle.title}
              </h2>

              {/* Author badge */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-[#15304E] border border-stone-200/80 dark:border-sky-800/60">
                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">{activeArticle.author.name}</p>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400">{activeArticle.author.role} · {activeArticle.author.sipp}</p>
                </div>
              </div>
            </div>

            {/* Article Body Content */}
            <div className="space-y-6 text-stone-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base border-t border-stone-200/80 dark:border-sky-800/60 pt-6">
              
              <p className="font-serif italic text-base sm:text-lg text-stone-800 dark:text-sky-100 bg-[#F0F9FF] dark:bg-[#132C49] p-5 rounded-2xl border border-stone-200/70 dark:border-sky-800/60">
                "{activeArticle.intro}"
              </p>

              {activeArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 pt-2">
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                    {sec.heading}
                  </h3>
                  <p className="text-stone-600 dark:text-slate-300 leading-relaxed font-normal">
                    {sec.text}
                  </p>
                  {sec.keyPoints && sec.keyPoints.length > 0 && (
                    <ul className="space-y-2 pl-2 pt-1">
                      {sec.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 dark:text-slate-200">
                          <span className="text-[#0EA5E9] dark:text-sky-400 font-bold">✓</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-stone-200 dark:border-sky-800/60 space-y-3">
                <h4 className="text-base font-bold text-stone-900 dark:text-white">Refleksi untuk Mahasiswa</h4>
                <p className="text-stone-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeArticle.conclusion}
                </p>
              </div>

              {/* Takeaway box */}
              <div className="p-4 rounded-xl bg-[#0EA5E9]/10 dark:bg-sky-900/40 border border-[#0EA5E9]/20 dark:border-sky-700/60 text-stone-900 dark:text-white">
                <p className="text-xs font-bold text-[#0EA5E9] dark:text-sky-300 uppercase tracking-wider mb-1">Pesan Utama untuk Dibawa Hari Ini:</p>
                <p className="text-sm font-semibold text-stone-900 dark:text-sky-50">
                  {activeArticle.takeawayMessage}
                </p>
              </div>

            </div>

            {/* In-Article Counseling CTA */}
            <div className="mt-10 p-6 rounded-2xl bg-[#F0F9FF] dark:bg-[#132C49] border border-stone-200 dark:border-sky-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm font-bold text-stone-900 dark:text-white">Merasa artikel ini mencerminkan apa yang sedang kamu alami di kampus?</p>
                <p className="text-xs text-stone-500 dark:text-slate-400">Bicarakan secara langsung bersama konselor dalam sesi konseling gratis.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl transition-colors cursor-pointer"
                >
                  Daftar Konseling via Google Form
                </button>
                <button
                  onClick={() => handleShare(activeArticle)}
                  className="p-2.5 text-stone-500 dark:text-sky-200 hover:text-stone-800 dark:hover:text-white bg-white dark:bg-[#0F243C] border border-stone-200 dark:border-sky-700/60 rounded-xl transition-colors cursor-pointer"
                  title="Bagikan artikel ini"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {shareToast && (
              <p className="text-xs text-center text-sky-600 dark:text-sky-300 mt-2 font-medium">Tautan artikel berhasil disalin!</p>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
