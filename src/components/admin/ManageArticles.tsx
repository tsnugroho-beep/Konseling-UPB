import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Eye,
  Heart
} from 'lucide-react';
import { Article } from '../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ManageArticlesProps {
  articles: Article[];
  onSaveArticles: (updated: Article[]) => void;
}

// Convert markdown to HTML for rich visual preview in WYSIWYG
function markdownToHtml(md: string): string {
  if (!md) return '';
  if (md.includes('<p>') || md.includes('<div>')) return md;

  let html = md
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0284C7] underline font-semibold">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  const paras = html.split(/\n\n+/);
  return paras.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

export const ManageArticles: React.FC<ManageArticlesProps> = ({ 
  articles, 
  onSaveArticles 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);

  // Form State: Sederhana (Judul, Topik, Kutipan, Gambar, Paragraf WYSIWYG)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Article['category']>('Regulasi Emosi');
  const [intro, setIntro] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Inline Link Bar State (NO POPUP!)
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Article['category'][] = [
    'Regulasi Emosi',
    'Karir & Akademik',
    'Hubungan & Relasi',
    'Self-Compassion',
    'Panduan Konseling',
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const updateEditorState = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    }
  };

  const handleOpenAddModal = () => {
    setEditingArticleId(null);
    setTitle('');
    setCategory('Regulasi Emosi');
    setIntro('');
    setImageUrl('');
    setWordCount(0);
    setIsLinkInputOpen(false);
    setIsModalOpen(true);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        editorRef.current.focus();
      }
    }, 50);
  };

  const handleOpenEditModal = (article: Article) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setIntro(article.intro || '');
    setImageUrl(article.imageUrl || '');
    setIsLinkInputOpen(false);

    const combined = article.sections?.map((s) => s.text).filter(Boolean).join('\n\n') || article.excerpt || '';
    const initialHtml = markdownToHtml(combined);
    setIsModalOpen(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = initialHtml;
        const text = editorRef.current.innerText || '';
        setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
      }
    }, 50);
  };

  // WYSIWYG ExecCommands (Native browser bold, italic, underline)
  const applyExecCommand = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    updateEditorState();
  };

  // Open inline link insertion bar directly in editor toolbar (Zero prompt popup!)
  const handleOpenInlineLink = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
    setIsLinkInputOpen(true);
    setLinkUrl('https://');
    setTimeout(() => {
      linkInputRef.current?.focus();
      linkInputRef.current?.select();
    }, 50);
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim() || linkUrl.trim() === 'https://') {
      setIsLinkInputOpen(false);
      return;
    }

    if (savedRange && editorRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange);
    }

    // Native browser createLink
    document.execCommand('createLink', false, linkUrl.trim());

    // Ensure links open in new tab and styled with distinctive blue underline
    if (editorRef.current) {
      const anchors = editorRef.current.querySelectorAll('a');
      anchors.forEach((a) => {
        if (!a.getAttribute('target')) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.classList.add('text-[#0284C7]', 'underline', 'font-semibold');
        }
      });
      updateEditorState();
    }

    setIsLinkInputOpen(false);
    setSavedRange(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WEBP, atau SVG).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setImageUrl(result);
      showToast('Gambar ilustrasi berhasil ditambahkan.');
    };
    reader.readAsDataURL(file);
  };

  const handlePromptDelete = (article: Article) => {
    setDeletingArticle(article);
  };

  const handleConfirmDelete = () => {
    if (!deletingArticle) return;
    const updated = articles.filter((a) => a.id !== deletingArticle.id);
    onSaveArticles(updated);
    showToast('Artikel berhasil dihapus.');
    setDeletingArticle(null);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const plainText = editorRef.current?.innerText || '';
    const htmlContent = editorRef.current?.innerHTML || '';

    if (!title.trim() || !plainText.trim()) {
      alert('Mohon isi Judul dan Paragraf konten artikel.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Hitung estimasi waktu baca otomatis dari jumlah kata
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const calcMinutes = Math.max(1, Math.ceil(words / 130));
    const autoReadTime = `${calcMinutes} menit baca`;

    if (editingArticleId) {
      // Update existing
      const updated = articles.map((art) => {
        if (art.id === editingArticleId) {
          return {
            ...art,
            title: title.trim(),
            category,
            readTime: autoReadTime,
            imageUrl: imageUrl.trim() || undefined,
            excerpt: plainText.trim().slice(0, 160) + (plainText.length > 160 ? '...' : ''),
            intro: intro.trim() || plainText.trim().slice(0, 120),
            sections: [
              {
                heading: '',
                text: htmlContent,
              }
            ],
            takeawayMessage: art.takeawayMessage || 'Kamu berharga dan tidak sendirian melewati proses kuliah ini.',
          };
        }
        return art;
      });
      onSaveArticles(updated);
      showToast('Perubahan artikel berhasil disimpan.');
    } else {
      // Create new
      const newArticle: Article = {
        id: `artikel-${Date.now()}`,
        title: title.trim(),
        category,
        readTime: autoReadTime,
        publishedDate: todayDate,
        imageUrl: imageUrl.trim() || undefined,
        excerpt: plainText.trim().slice(0, 160) + (plainText.length > 160 ? '...' : ''),
        intro: intro.trim() || plainText.trim().slice(0, 120),
        sections: [
          {
            heading: '',
            text: htmlContent,
          }
        ],
        conclusion: 'Menjaga kesehatan mental selama perkuliahan adalah investasi jangka panjang untuk masa depanmu.',
        takeawayMessage: 'Ambil jeda sejenak jika merasa lelah. Kamu tidak sendirian.',
        author: {
          name: 'Tim Konseling DIRMAWA UPB',
          role: 'Konselor Mahasiswa',
          sipp: 'Kerahasiaan Terjamin',
        },
      };

      const updated = [newArticle, ...articles];
      onSaveArticles(updated);
      showToast('Artikel baru berhasil dipublikasikan!');
    }

    setIsModalOpen(false);
  };

  const filteredArticles = articles.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F3456] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-sky-400/50 flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Search and Add Article Button */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Daftar Publikasi Artikel Edukasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola dan terbitkan materi bacaan psikologi praktis bagi mahasiswa.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan judul atau kategori artikel..."
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-800 shadow-2xs"
        />
      </div>

      {/* Articles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:border-slate-300 transition-colors space-y-4"
          >
            <div className="space-y-3">
              {/* Optional Thumbnail in Admin Card */}
              {article.imageUrl && (
                <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Clean Topic without pill */}
              <div className="flex items-center justify-between text-xs text-[#0284C7] font-semibold">
                <span>{article.category}</span>
                <div className="flex items-center gap-2.5 text-slate-500 font-normal">
                  <span className="flex items-center gap-1" title="Dilihat">
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    <span className="font-mono text-xs">{article.viewsCount || 0}</span>
                  </span>
                  <span className="flex items-center gap-1" title="Disukai">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span className="font-mono text-xs">{article.likesCount || 0}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                {article.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {article.publishedDate}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(article)}
                  title="Edit Artikel"
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handlePromptDelete(article)}
                  title="Hapus Artikel"
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-medium">Tidak ada artikel yang cocok dengan filter.</p>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / EDIT ARTIKEL (LEBAR BESAR MAX-W-5XL)          */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white max-w-5xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 relative my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-slate-900">
                  {editingArticleId ? 'Edit Artikel Edukasi' : 'Tambah Artikel Edukasi Baru'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveArticle} className="space-y-5">
              
              {/* Row 1: Judul & Topik */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Judul Artikel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Mengatasi Overthinking Saat Menyusun Skripsi"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all text-slate-900 shadow-2xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kategori Topik
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-800 shadow-2xs font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Gambar Ilustrasi Artikel */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0EA5E9]" />
                    <span>Gambar Ilustrasi Artikel (Opsional)</span>
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      Hapus Gambar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-3">
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-[#0EA5E9] bg-white text-slate-700 hover:text-[#0284C7] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Pilih Gambar dari Komputer</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 font-medium">Atau masukkan URL gambar langsung:</span>
                      <input
                        type="url"
                        value={imageUrl.startsWith('data:') ? '' : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... atau tautan gambar web"
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-800 shadow-2xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Image Preview Box */}
                  <div className="w-full h-36 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview Ilustrasi"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-400 space-y-1">
                        <ImageIcon className="w-6 h-6 mx-auto stroke-1" />
                        <p className="text-xs">Belum ada gambar ilustrasi dipilih</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Kutipan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kutipan
                </label>
                <textarea
                  rows={2}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="Kutipan atau kalimat pembuka artikel yang menarik perhatian mahasiswa..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs resize-none font-medium"
                />
              </div>

              {/* Row 4: WYSIWYG Real-time Visual Rich Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Paragraf Konten Artikel <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Format visual langsung (Ctrl+B = Tebal, Ctrl+I = Miring, Ctrl+U = Garis Bawah, Ctrl+K = Tautan)
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs focus-within:border-[#0EA5E9] focus-within:ring-2 focus-within:ring-[#0EA5E9]/20 transition-all bg-white">
                  
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between bg-slate-100/90 px-3 py-2 border-b border-slate-200 gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyExecCommand('bold');
                        }}
                        title="Tebalkan Teks (Ctrl+B)"
                        className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Bold className="w-3.5 h-3.5" />
                        <span>Tebal</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyExecCommand('italic');
                        }}
                        title="Miringkan Teks (Ctrl+I)"
                        className="px-2.5 py-1 text-xs italic font-serif text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Italic className="w-3.5 h-3.5" />
                        <span>Miring</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyExecCommand('underline');
                        }}
                        title="Garis Bawahi Teks (Ctrl+U)"
                        className="px-2.5 py-1 text-xs underline font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <UnderlineIcon className="w-3.5 h-3.5" />
                        <span>Garis Bawah</span>
                      </button>

                      <span className="w-px h-5 bg-slate-300 mx-1" />

                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleOpenInlineLink();
                        }}
                        title="Sisipkan Tautan Referensi (Buka di Tab Baru)"
                        className="px-3 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Tautan (Buka Tab Baru)</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {wordCount} kata
                    </span>
                  </div>

                  {/* Inline Link Insertion Bar (NO POPUP!) */}
                  {isLinkInputOpen && (
                    <div className="bg-sky-50/90 px-3.5 py-2.5 border-b border-sky-200 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 shrink-0">
                        <LinkIcon className="w-3.5 h-3.5 text-[#0EA5E9]" />
                        <span>Masukkan URL Tautan:</span>
                      </div>
                      <input
                        ref={linkInputRef}
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 min-w-[220px] px-3 py-1.5 text-xs bg-white border border-sky-300 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-[#0EA5E9]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyLink();
                          } else if (e.key === 'Escape') {
                            setIsLinkInputOpen(false);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyLink}
                        className="px-3 py-1.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Terapkan
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsLinkInputOpen(false)}
                        className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  )}

                  {/* Real-time ContentEditable Visual WYSIWYG Editor */}
                  <div
                    ref={editorRef}
                    contentEditable={true}
                    onInput={updateEditorState}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                        e.preventDefault();
                        handleOpenInlineLink();
                      }
                    }}
                    data-placeholder="Tuliskan isi paragraf artikel di sini secara leluasa. Sorot kata lalu tekan Ctrl+B untuk tebal, Ctrl+I untuk miring, Ctrl+U untuk garis bawah, atau klik tombol di atas. Hasil format langsung tampil secara visual di sini..."
                    className="w-full px-4 py-3 text-sm sm:text-base bg-white border-0 focus:outline-hidden text-slate-900 min-h-[300px] max-h-[500px] font-sans leading-relaxed overflow-y-auto cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none selection:bg-sky-100 selection:text-sky-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Simpan & Terbitkan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Custom Web In-App Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingArticle)}
        title="Konfirmasi Hapus Artikel"
        message="Apakah kamu yakin ingin menghapus konten ini dari publikasi website mahasiswa?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingArticle(null)}
      />

    </div>
  );
};
