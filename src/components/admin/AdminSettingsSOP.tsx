import React, { useState, useEffect } from 'react';
import { 
  CalendarClock,
  HelpCircle,
  Plus,
  Trash2,
  Pencil,
  Save,
  Check,
  ExternalLink,
  Copy,
  PhoneCall,
  Clock,
  MapPin,
  X,
  Link2,
  AlertTriangle
} from 'lucide-react';
import { 
  RegistrationSettings, 
  RegistrationStep,
  DEFAULT_REGISTRATION_SETTINGS,
  DEFAULT_REGISTRATION_STEPS 
} from '../../data/adminStore';
import { FAQS } from '../../data/mockData';
import { FaqItem } from '../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminSettingsSOPProps {
  settings?: RegistrationSettings;
  faqs?: FaqItem[];
  onSaveSettings?: (settings: RegistrationSettings) => void;
  onSaveFaqs?: (faqs: FaqItem[]) => void;
}

export const AdminSettingsSOP: React.FC<AdminSettingsSOPProps> = ({
  settings,
  faqs: initialFaqs,
  onSaveSettings,
  onSaveFaqs,
}) => {
  const [activeTab, setActiveTab] = useState<'langkah' | 'faq' | 'kontak'>('langkah');

  // --- Step & Registration Settings State ---
  const currentSettings = settings || DEFAULT_REGISTRATION_SETTINGS;

  const [headerTitle, setHeaderTitle] = useState(
    currentSettings.headerTitle || DEFAULT_REGISTRATION_SETTINGS.headerTitle
  );
  const [headerSubtitle, setHeaderSubtitle] = useState(
    currentSettings.headerSubtitle || DEFAULT_REGISTRATION_SETTINGS.headerSubtitle
  );
  
  const [steps, setSteps] = useState<RegistrationStep[]>(() => {
    return currentSettings.steps && currentSettings.steps.length > 0
      ? currentSettings.steps
      : DEFAULT_REGISTRATION_STEPS;
  });

  const [formUrl, setFormUrl] = useState(currentSettings.googleFormUrl);
  const [whatsapp, setWhatsapp] = useState(currentSettings.adminWhatsApp);
  const [hours, setHours] = useState(currentSettings.operatingHours);
  const [address, setAddress] = useState(currentSettings.clinicAddress);

  // --- FAQ State ---
  const [faqList, setFaqList] = useState<FaqItem[]>(() => {
    return initialFaqs && initialFaqs.length > 0 ? initialFaqs : FAQS;
  });

  // Modal FAQ State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Delete FAQ Modal State
  const [faqToDeleteIndex, setFaqToDeleteIndex] = useState<number | null>(null);

  // UI Feedbacks
  const [isCopied, setIsCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setHeaderTitle(settings.headerTitle || DEFAULT_REGISTRATION_SETTINGS.headerTitle);
      setHeaderSubtitle(settings.headerSubtitle || DEFAULT_REGISTRATION_SETTINGS.headerSubtitle);
      if (settings.steps && settings.steps.length > 0) {
        setSteps(settings.steps);
      }
      setFormUrl(settings.googleFormUrl);
      setWhatsapp(settings.adminWhatsApp);
      setHours(settings.operatingHours);
      setAddress(settings.clinicAddress);
    }
  }, [settings]);

  useEffect(() => {
    if (initialFaqs && initialFaqs.length > 0) {
      setFaqList(initialFaqs);
    }
  }, [initialFaqs]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    setIsCopied(true);
    showToast('Tautan Google Form berhasil disalin ke clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- Steps Operations ---
  const handleStepChange = (index: number, field: keyof RegistrationStep, value: string) => {
    const updated = [...steps];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSteps(updated);
  };

  const handleAddStep = () => {
    const newStepIndex = steps.length + 1;
    const padded = newStepIndex < 10 ? `0${newStepIndex}` : `${newStepIndex}`;
    const newStep: RegistrationStep = {
      num: padded,
      title: '',
      desc: '',
    };
    setSteps([...steps, newStep]);
    showToast(`Langkah ${newStepIndex} baru berhasil ditambahkan!`);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) {
      alert('Minimal harus ada 1 langkah tata cara pendaftaran.');
      return;
    }
    const updated = steps.filter((_, idx) => idx !== index).map((s, idx) => ({
      ...s,
      num: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
    }));
    setSteps(updated);
    showToast('Langkah berhasil dihapus.');
  };

  // Save Steps Only
  const handleSaveRegistrationSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that steps have title & desc
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].title.trim() || !steps[i].desc.trim()) {
        alert(`Mohon lengkapi Judul dan Penjelasan pada Langkah ${i + 1}.`);
        return;
      }
    }

    const updatedSettings: RegistrationSettings = {
      ...currentSettings,
      headerTitle: headerTitle.trim() || 'Cara Mendaftar Konseling via Google Form',
      headerSubtitle: headerSubtitle.trim() || 'Kami sengaja menggunakan sistem pendaftaran Google Form agar kamu dapat mendaftar dengan praktis, aman, dan tanpa hambatan teknis akun.',
      steps: steps.map((s, idx) => ({
        num: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
        title: s.title.trim(),
        desc: s.desc.trim(),
        tips: s.tips?.trim() || '',
      })),
      googleFormUrl: formUrl.trim(),
      adminWhatsApp: whatsapp.trim().replace(/[^0-9]/g, ''),
      operatingHours: hours.trim(),
      clinicAddress: address.trim(),
    };

    if (onSaveSettings) {
      onSaveSettings(updatedSettings);
    }
    showToast('Tata cara pendaftaran berhasil disimpan dan langsung diperbarui di portal mahasiswa!');
  };

  // Save Contact Info (Danger Zone) Only
  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim()) {
      alert('Mohon isi Tautan Google Form Pendaftaran.');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Mohon isi Nomor WhatsApp Hotline Admin.');
      return;
    }

    const updatedSettings: RegistrationSettings = {
      ...currentSettings,
      headerTitle: headerTitle.trim() || 'Cara Mendaftar Konseling via Google Form',
      headerSubtitle: headerSubtitle.trim() || 'Kami sengaja menggunakan sistem pendaftaran Google Form agar kamu dapat mendaftar dengan praktis, aman, dan tanpa hambatan teknis akun.',
      steps: steps.map((s, idx) => ({
        num: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
        title: s.title.trim(),
        desc: s.desc.trim(),
        tips: s.tips?.trim() || '',
      })),
      googleFormUrl: formUrl.trim(),
      adminWhatsApp: whatsapp.trim().replace(/[^0-9]/g, ''),
      operatingHours: hours.trim(),
      clinicAddress: address.trim(),
    };

    if (onSaveSettings) {
      onSaveSettings(updatedSettings);
    }
    showToast('Informasi Kontak Operasional berhasil disimpan dan langsung sinkron ke seluruh portal!');
  };

  // --- FAQ Operations ---
  const handleOpenAddFaq = () => {
    setEditingFaqIndex(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (index: number) => {
    setEditingFaqIndex(index);
    setFaqQuestion(faqList[index].question);
    setFaqAnswer(faqList[index].answer);
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
    setEditingFaqIndex(null);
    setFaqQuestion('');
    setFaqAnswer('');
  };

  const handleSaveFaqModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert('Mohon isi Pertanyaan dan Jawaban FAQ.');
      return;
    }

    let updated: FaqItem[];
    if (editingFaqIndex !== null) {
      // Edit existing
      updated = [...faqList];
      updated[editingFaqIndex] = {
        ...updated[editingFaqIndex],
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
      };
      showToast('Pertanyaan FAQ berhasil diperbarui!');
    } else {
      // Add new
      const newFaq: FaqItem = {
        id: `faq-${Date.now()}`,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
      };
      updated = [newFaq, ...faqList];
      showToast('Pertanyaan FAQ baru berhasil ditambahkan!');
    }

    setFaqList(updated);
    if (onSaveFaqs) {
      onSaveFaqs(updated);
    }
    handleCloseFaqModal();
  };

  const handleConfirmDeleteFaq = () => {
    if (faqToDeleteIndex === null) return;
    const updated = faqList.filter((_, idx) => idx !== faqToDeleteIndex);
    setFaqList(updated);
    if (onSaveFaqs) {
      onSaveFaqs(updated);
    }
    setFaqToDeleteIndex(null);
    showToast('Pertanyaan FAQ berhasil dihapus!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Toast feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F3456] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-sky-400/50 flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Navigation Sub-tabs Centered with Distinctive UPB Brand Characteristic */}
      <div className="flex justify-center w-full py-1">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-2xl border border-sky-200/90 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('langkah')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'langkah'
                ? 'bg-[#0284C7] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Tata Cara Mendaftar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#0284C7] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Kelola FAQ</span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-bold transition-colors ${
              activeTab === 'faq' ? 'bg-white/20 text-white' : 'bg-sky-100 text-[#0284C7]'
            }`}>
              {faqList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kontak')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'kontak'
                ? 'bg-[#0284C7] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Informasi Kontak</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: TATA CARA MENDAFTAR                                */}
      {/* ============================================================== */}
      {activeTab === 'langkah' && (
        <form onSubmit={handleSaveRegistrationSettings} className="space-y-6">
          
          {/* Section: Judul & Subjudul Halaman */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Judul & Penjelasan Halaman Cara Mendaftar
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Judul Utama
                </label>
                <input
                  type="text"
                  required
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Cara Mendaftar Konseling via Google Form"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all text-slate-900 shadow-2xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Deskripsi / Penjelasan Singkat
                </label>
                <textarea
                  rows={2}
                  required
                  value={headerSubtitle}
                  onChange={(e) => setHeaderSubtitle(e.target.value)}
                  placeholder="Penjelasan ringkas tentang pendaftaran..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Langkah-Langkah Pendaftaran (Simple: Tambah Langkah & Hapus Langkah) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Langkah-Langkah Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur urutan alur pendaftaran bagi mahasiswa.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddStep}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Langkah</span>
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 relative hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <span className="text-xs font-bold font-mono text-[#0284C7] bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg shadow-2xs">
                      Langkah {idx + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteStep(idx)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                      title={`Hapus Langkah ${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Langkah</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Judul Langkah
                      </label>
                      <input
                        type="text"
                        required
                        value={step.title}
                        onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                        placeholder={`Contoh: Langkah ${idx + 1}`}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Penjelasan Langkah
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={step.desc}
                        onChange={(e) => handleStepChange(idx, 'desc', e.target.value)}
                        placeholder="Tuliskan petunjuk bagi mahasiswa..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddStep}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#0EA5E9] hover:bg-sky-50/50 text-slate-600 hover:text-[#0284C7] text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Langkah Baru</span>
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Tata Cara Mendaftar</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: KELOLA FAQ                                         */}
      {/* ============================================================== */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Daftar Pertanyaan FAQ
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Kelola pertanyaan dan jawaban yang tampil pada bagian Tanya Jawab di website mahasiswa.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddFaq}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah FAQ</span>
              </button>
            </div>
          </div>

          {/* FAQ Cards List */}
          <div className="space-y-3.5">
            {faqList.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-sky-50 text-[#0284C7] font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h4>
                  </div>

                  {/* Actions: Edit & Hapus */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditFaq(idx)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFaqToDeleteIndex(idx)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                <div className="pl-9 pr-2">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}

            {faqList.length === 0 && (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm font-medium">Belum ada pertanyaan FAQ.</p>
                <button
                  type="button"
                  onClick={handleOpenAddFaq}
                  className="mt-2 text-xs text-[#0EA5E9] font-bold hover:underline cursor-pointer"
                >
                  + Tambah Pertanyaan Pertama
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: INFORMASI KONTAK (DANGER ZONE)                     */}
      {/* ============================================================== */}
      {activeTab === 'kontak' && (
        <form onSubmit={handleSaveContactSettings} className="space-y-6">
          
          {/* Danger Zone Warning Banner */}
          <div className="bg-rose-50/90 border-2 border-rose-300/80 rounded-2xl p-5 sm:p-6 text-rose-950 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest bg-rose-600 text-white px-2.5 py-0.5 rounded-md">
                  DANGER ZONE
                </span>
                <h3 className="text-sm sm:text-base font-bold text-rose-950">
                  Pengaturan Kritis Kontak & Tautan Layanan
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed pl-12">
              Perubahan pada bagian ini berdampak langsung ke seluruh tombol pendaftaran mahasiswa di website, tautan formulir, jam layanan, dan nomor hotline WhatsApp. Pastikan tautan dan nomor kontak valid sebelum menyimpan.
            </p>
          </div>

          {/* Form Fields Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            
            {/* Tautan Google Form */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tautan Google Form
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all text-slate-900 font-mono shadow-2xs"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                  </button>

                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Uji Buka</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Grid WhatsApp & Jam Layanan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nomor WhatsApp Hotline Admin
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="6285158804981"
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-rose-500 transition-all text-slate-900 font-mono shadow-2xs"
                  />
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Tes WA</span>
                  </a>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Jam Layanan
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="Senin – Jumat | 09.00 – 16.00 WIB"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-rose-500 transition-all text-slate-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Lokasi Ruang Konseling */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lokasi Ruang Konseling Tatap Muka
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Direktorat Kemahasiswaan dan Alumni, Gedung B Lt. 2, Universitas Pelita Bangsa"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-rose-500 transition-all text-slate-900 shadow-2xs"
                />
              </div>
            </div>

          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Informasi Kontak</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / EDIT FAQ                                      */}
      {/* ============================================================== */}
      {isFaqModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 relative my-auto animate-in zoom-in-95 duration-150 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingFaqIndex !== null ? 'Edit Pertanyaan FAQ' : 'Tambah FAQ Baru'}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseFaqModal}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveFaqModal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pertanyaan *
                </label>
                <textarea
                  rows={2}
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Contoh: Apakah layanan konseling mahasiswa ini benar-benar gratis?"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all text-slate-900 shadow-2xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Jawaban *
                </label>
                <textarea
                  rows={5}
                  required
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Tuliskan jawaban yang lengkap, ramah, dan menenangkan bagi mahasiswa..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs"
                />
              </div>

              {/* Action Buttons: Cancel and Simpan */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseFaqModal}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for FAQ */}
      <DeleteConfirmModal
        isOpen={faqToDeleteIndex !== null}
        title="Hapus Pertanyaan FAQ"
        message="Apakah kamu yakin ingin menghapus pertanyaan FAQ ini dari portal mahasiswa?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirmDeleteFaq}
        onCancel={() => setFaqToDeleteIndex(null)}
      />

    </div>
  );
};
