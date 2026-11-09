import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, Calendar, ArrowRight, ArrowLeft, X, UserCheck, Heart, Sparkles, Share2, GraduationCap, Eye, Copy, Check } from 'lucide-react';
import { ARTICLES } from '../data/mockData';
import { getAdminStoredData, incrementArticleView, toggleArticleLike, isArticleLiked } from '../data/adminStore';
import { Article } from '../types';

interface ArticlesSectionProps {
  onOpenBooking: () => void;
  onNavigateTab: (tabId: string) => void;
}

// Helper to safely render Markdown formatting (bold, italic, underline, links)
function renderInlineMarkdown(text: string): React.ReactNode {
  const regex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|<u>.*?<\/u>|\*[^*]+\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // 1. Link: [label](url) -> opens in new tab with indicator
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0284C7] dark:text-sky-400 font-semibold underline underline-offset-4 hover:text-[#0369A1] dark:hover:text-sky-300 inline-flex items-center gap-0.5 transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{linkMatch[1]}</span>
          <span className="text-xs inline-block -translate-y-0.5">↗</span>
        </a>
      );
    }

    // 2. Bold: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={index} className="font-bold text-stone-900 dark:text-white">{boldMatch[1]}</strong>;
    }

    // 3. Underline: <u>text</u>
    const underlineMatch = part.match(/^<u>(.*?)<\/u>$/i);
    if (underlineMatch) {
      return <u key={index} className="underline underline-offset-2">{underlineMatch[1]}</u>;
    }

    // 4. Italic: *text*
    const italicMatch = part.match(/^\*([^*]+)\*$/);
    if (italicMatch) {
      return <em key={index} className="italic">{italicMatch[1]}</em>;
    }

    return part;
  });
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ 
  onOpenBooking,
  onNavigateTab
}) => {
  const [articlesList, setArticlesList] = useState<Article[]>(() => {
    return getAdminStoredData().articles;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setArticlesList(getAdminStoredData().articles);
    };
    window.addEventListener('upb_admin_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('upb_admin_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [shareModalArticle, setShareModalArticle] = useState<Article | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    articlesList.forEach((a) => {
      map[a.id] = isArticleLiked(a.id);
    });
    setLikedMap(map);
  }, [articlesList]);

  const categories = [
    'Semua',
    'Regulasi Emosi',
    'Karir & Akademik',
    'Hubungan & Relasi',
    'Self-Compassion',
    'Panduan Konseling',
  ];

  const filteredArticles = articlesList.filter((art) => {
    const matchesCategory = selectedCategory === 'Semua' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.intro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenShare = (article: Article) => {
    setShareModalArticle(article);
    setIsCopied(false);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(() => {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const handleToggleLike = (articleId: string) => {
    const res = toggleArticleLike(articleId);
    setLikedMap((prev) => ({
      ...prev,
      [articleId]: res.isLiked,
    }));
    if (activeArticle && activeArticle.id === articleId) {
      setActiveArticle({
        ...activeArticle,
        likesCount: res.newLikesCount,
      });
    }
  };

  const handleOpenArticle = (article: Article) => {
    incrementArticleView(article.id);
    setActiveArticle({
      ...article,
      viewsCount: (article.viewsCount || 0) + 1,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to render instant, lightweight, non-laggy share modal for social media & link copying
  const renderShareModal = () => {
    if (!shareModalArticle) return null;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = shareModalArticle.title;
    const shareText = `*${shareTitle}*\n\n${shareModalArticle.excerpt}\n\nBaca artikel selengkapnya di Layanan Konseling UPB:\n${currentUrl}`;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        role="dialog"
        aria-modal="true"
        onClick={() => {
          setShareModalArticle(null);
          setIsCopied(false);
        }}
      >
        <div 
          className="bg-white dark:bg-[#0F243C] w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-sky-800/80 text-stone-800 dark:text-slate-100 space-y-6 relative animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-sky-800/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-[#0284C7] dark:text-sky-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white leading-tight">
                  Bagikan Artikel
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Sebarkan ke teman atau media sosial
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShareModalArticle(null);
                setIsCopied(false);
              }}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-[#15304E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article Preview Snippet */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#132C49] border border-stone-200/80 dark:border-sky-800/60 space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#0EA5E9] dark:text-sky-400">
              {shareModalArticle.category}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white leading-snug line-clamp-2">
              {shareModalArticle.title}
            </h4>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider">
              Bagikan ke Media Sosial
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:scale-105 transition-all text-emerald-700 dark:text-emerald-400 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 shadow-2xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-center">WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 hover:scale-105 transition-all text-sky-700 dark:text-sky-300 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center mb-1.5 shadow-2xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.718-3.262 13.682-3.447 14.502-.128.567-.442.716-.836.488l-4.721-3.482-2.278 2.193c-.252.252-.464.464-.951.464l.339-4.808 8.751-7.904c.381-.339-.083-.527-.591-.188l-10.82 6.812-4.66-1.457c-1.013-.317-1.033-1.013.212-1.499l18.216-7.022c.844-.316 1.583.197 1.306 1.405z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-center">Telegram</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle} - Layanan Konseling UPB`)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:scale-105 transition-all text-slate-800 dark:text-slate-200 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-1.5 shadow-2xs">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-center">X / Twitter</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:scale-105 transition-all text-blue-700 dark:text-blue-300 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-1.5 shadow-2xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-center">Facebook</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 hover:scale-105 transition-all text-sky-800 dark:text-sky-300 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center mb-1.5 shadow-2xs">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-center">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Salin Tautan (Copy Link) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider">
              Salin Tautan Langsung
            </label>

            <div className="flex items-center gap-2 p-1.5 pl-3 bg-stone-100 dark:bg-[#15304E] rounded-2xl border border-stone-200 dark:border-sky-800/70">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-xs text-stone-700 dark:text-slate-300 font-mono focus:outline-hidden select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
                  isCopied
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // ==============================================================
  // FULL ARTICLE VIEW (NOT A POPUP/MODAL)
  // ==============================================================
  if (activeArticle) {
    const isCurrentLiked = likedMap[activeArticle.id];

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        
        {/* Top Back Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setActiveArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F243C] border border-stone-200 dark:border-sky-800/80 text-stone-700 dark:text-sky-200 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-sky-600 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Daftar Artikel</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              type="button"
              onClick={() => handleToggleLike(activeArticle.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-2xs ${
                isCurrentLiked
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-[#0F243C] border-stone-200 dark:border-sky-700/60 text-stone-700 dark:text-sky-200 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isCurrentLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isCurrentLiked ? 'Disukai' : 'Suka'}</span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-sky-900/60 font-bold">
                {activeArticle.likesCount || 0}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => handleOpenShare(activeArticle)}
              className="p-2.5 px-3.5 text-stone-500 dark:text-sky-200 hover:text-stone-800 dark:hover:text-white bg-white dark:bg-[#0F243C] border border-stone-200 dark:border-sky-700/60 rounded-xl transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5 text-xs font-semibold"
              title="Bagikan artikel ini"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>
          </div>
        </div>

        {/* Article Container Box */}
        <article className="bg-white dark:bg-[#0F243C] rounded-3xl p-6 sm:p-10 border border-stone-200/90 dark:border-sky-800/70 shadow-2xs text-[#1E3348] dark:text-slate-100 space-y-8">
          
          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#0EA5E9] dark:text-sky-400 font-semibold">
              <span>{activeArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 dark:text-slate-400 font-normal">{activeArticle.readTime}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 dark:text-slate-400 font-normal">{activeArticle.publishedDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 dark:text-slate-400 font-normal flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>{activeArticle.viewsCount || 0} dilihat</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 dark:text-slate-400 font-normal flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{activeArticle.likesCount || 0} disukai</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 dark:text-white leading-tight">
              {activeArticle.title}
            </h1>

            {/* Author info */}
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

          {/* Featured Illustration Image */}
          {activeArticle.imageUrl && (
            <div className="w-full max-h-[460px] rounded-2xl overflow-hidden shadow-xs border border-stone-200/80 dark:border-sky-800/70 bg-stone-100 dark:bg-slate-800">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full max-h-[460px] object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="space-y-6 text-stone-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base border-t border-stone-200/80 dark:border-sky-800/60 pt-6">
            
            {activeArticle.intro && (
              <p className="font-serif italic text-base sm:text-lg text-stone-800 dark:text-sky-100 bg-[#F0F9FF] dark:bg-[#132C49] p-5 sm:p-6 rounded-2xl border border-stone-200/70 dark:border-sky-800/60 leading-relaxed">
                "{renderInlineMarkdown(activeArticle.intro)}"
              </p>
            )}

            {activeArticle.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3 pt-2">
                {sec.heading && (
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                    {sec.heading}
                  </h2>
                )}
                <div className="space-y-4 text-stone-600 dark:text-slate-300 leading-relaxed font-normal text-sm sm:text-base">
                  {sec.text.includes('<p>') || sec.text.includes('<div>') || sec.text.includes('<strong>') || sec.text.includes('<em>') || sec.text.includes('<u>') || sec.text.includes('<a ') ? (
                    <div 
                      className="article-rich-content space-y-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sec.text }}
                    />
                  ) : (
                    sec.text.split(/\n+/).map((para, pIdx) => {
                      if (!para.trim()) return null;
                      return (
                        <p key={pIdx} className="leading-relaxed">
                          {renderInlineMarkdown(para)}
                        </p>
                      );
                    })
                  )}
                </div>
                {sec.keyPoints && sec.keyPoints.length > 0 && (
                  <ul className="space-y-2 pl-2 pt-1">
                    {sec.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 dark:text-slate-200">
                        <span className="text-[#0EA5E9] dark:text-sky-400 font-bold">✓</span>
                        <span>{renderInlineMarkdown(pt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {activeArticle.conclusion && (
              <div className="pt-4 border-t border-stone-200 dark:border-sky-800/60 space-y-3">
                <h3 className="text-base font-bold text-stone-900 dark:text-white">Refleksi untuk Mahasiswa</h3>
                <p className="text-stone-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeArticle.conclusion}
                </p>
              </div>
            )}

          </div>

          {/* In-Article Counseling CTA */}
          <div className="p-6 rounded-2xl bg-[#F0F9FF] dark:bg-[#132C49] border border-stone-200 dark:border-sky-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm font-bold text-stone-900 dark:text-white">Merasa artikel ini mencerminkan apa yang sedang kamu alami di kampus?</p>
              <p className="text-xs text-stone-500 dark:text-slate-400">Bicarakan secara langsung bersama konselor dalam sesi konseling gratis.</p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleLike(activeArticle.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  isCurrentLiked
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                    : 'bg-white dark:bg-[#0F243C] border-stone-200 dark:border-sky-700/60 text-stone-700 dark:text-sky-200 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isCurrentLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isCurrentLiked ? 'Disukai' : 'Suka'}</span>
                <span className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-sky-900/60 font-bold">
                  {activeArticle.likesCount || 0}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveArticle(null);
                  onOpenBooking();
                }}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                Daftar Konseling
              </button>
            </div>
          </div>

        </article>

        {/* Bottom Back Navigation Bar */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#0F243C] border border-stone-200 dark:border-sky-800/80 text-stone-700 dark:text-sky-200 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-sky-600 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Daftar Artikel</span>
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-stone-500 dark:text-slate-400 hover:text-[#0EA5E9] dark:hover:text-sky-300 font-semibold cursor-pointer"
          >
            ↑ Kembali ke Atas
          </button>
        </div>

        {/* Share Modal */}
        {renderShareModal()}

      </div>
    );
  }

  // ==============================================================
  // ARTICLE CATALOG VIEW
  // ==============================================================
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
          {filteredArticles.map((article) => {
            const isLiked = likedMap[article.id];
            return (
              <article
                key={article.id}
                onClick={() => handleOpenArticle(article)}
                className="group rounded-3xl p-6 bg-white dark:bg-[#0F243C]/95 border border-stone-200/90 dark:border-sky-800/70 flex flex-col justify-between hover:border-[#0EA5E9]/40 dark:hover:border-sky-500/60 hover:shadow-sm transition-all cursor-pointer"
              >
                <div>
                  {/* Article Card Illustration Image */}
                  {article.imageUrl && (
                    <div className="w-full h-44 mb-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-stone-200/60 dark:border-sky-800/60">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Zero-Pill Clean Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#0EA5E9] dark:text-sky-400 font-semibold mb-3">
                    <span>{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-500 dark:text-slate-400 font-normal">{article.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-500 dark:text-slate-400 font-normal flex items-center gap-1" title="Dilihat">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>{article.viewsCount || 0}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(article.id);
                      }}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                        isLiked
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                          : 'text-stone-500 dark:text-slate-400 hover:text-rose-500'
                      }`}
                      title={isLiked ? 'Batal Suka' : 'Suka Artikel Ini'}
                    >
                      <Heart className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span className="font-semibold">{article.likesCount || 0}</span>
                    </button>
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
                    <span className="font-medium text-stone-800 dark:text-sky-100 truncate max-w-[150px]">{article.author.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenShare(article);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-sky-900/40 transition-colors cursor-pointer"
                      title="Bagikan artikel"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0EA5E9] dark:text-sky-400 group-hover:text-[#0284C7] dark:group-hover:text-sky-300 transition-colors">
                      <span>Baca</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
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

      {/* Share Modal */}
      {renderShareModal()}

    </div>
  );
};
