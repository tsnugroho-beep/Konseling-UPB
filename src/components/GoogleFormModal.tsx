import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ClipboardCheck, 
  MessageSquare, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { ADMIN_WHATSAPP_NUMBER } from '../data/mockData';
import { CounselingService } from '../types';

interface GoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleFormUrl: string;
  preSelectedService: CounselingService | null;
  referralNote?: string;
}

export const GoogleFormModal: React.FC<GoogleFormModalProps> = ({
  isOpen,
  onClose,
  googleFormUrl,
  preSelectedService,
  referralNote,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleFormUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyNote = () => {
    if (referralNote) {
      navigator.clipboard.writeText(referralNote);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#0F243C] max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-sky-800/70 text-[#1E3348] dark:text-slate-100 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white bg-stone-50 dark:bg-sky-900/50 hover:bg-stone-100 dark:hover:bg-sky-800/70 rounded-full transition-colors cursor-pointer"
          aria-label="Tutup jendela pendaftaran"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#0EA5E9]/15 dark:bg-sky-500/20 text-[#0EA5E9] dark:text-sky-300 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-800 dark:text-sky-200 bg-sky-100 dark:bg-sky-900/80 px-2 py-0.5 rounded-full uppercase tracking-wider mb-0.5">
              <span>100% GRATIS / Free untuk Mahasiswa</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              Formulir Pendaftaran Konseling
            </h3>
          </div>
        </div>

        {/* If user took a psychological test, show copyable note */}
        {referralNote && (
          <div className="p-4 rounded-xl bg-[#0EA5E9]/10 dark:bg-sky-900/40 border border-[#0EA5E9]/25 dark:border-sky-700/60 mb-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0EA5E9] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Rangkuman Hasil Tes Mandiri Kamu</span>
              </span>
              <button
                onClick={handleCopyNote}
                className="text-xs font-semibold text-[#0EA5E9] dark:text-sky-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>{copiedNote ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>
            <p className="text-xs text-stone-700 dark:text-sky-100 bg-white/70 dark:bg-[#0A192C] p-2.5 rounded-lg border border-stone-200/60 dark:border-sky-800/70 font-mono">
              {referralNote}
            </p>
            <p className="text-[11px] text-stone-500 dark:text-slate-400">
              Kamu bisa menempelkan catatan hasil tes ini pada kolom "Kendala / Hal yang Ingin Didiskusikan" di Google Form.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-bold text-stone-700 dark:text-sky-200 uppercase tracking-wider">
            Langkah Singkat Pendaftaran:
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-sky-900/70 text-[#0EA5E9] dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Klik tombol di bawah untuk membuka <strong>Google Form</strong>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-sky-900/70 text-[#0EA5E9] dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Isi Nama, Program Studi, NIM (Nomor Induk Mahasiswa), nomor WhatsApp aktif, dan jadwal luangmu.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-sky-900/70 text-[#0EA5E9] dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Admin kami akan menghubungi WhatsApp-mu untuk konfirmasi jadwal sesi konselingmu.</span>
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="space-y-3">
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm sm:text-base font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-2xl shadow-md hover:shadow-lg transition-all text-center cursor-pointer group"
          >
            <span>Buka Google Form Sekarang (Gratis)</span>
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="text-xs text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-white underline underline-offset-2 cursor-pointer"
            >
              {copiedLink ? '✓ Tautan Google Form Tersalin!' : 'Salin Tautan Google Form'}
            </button>

            <a
              href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=Halo%20Admin%20Konseling%20Mahasiswa%20UPB,%20saya%20mahasiswa%20ingin%20konsultasi`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#0EA5E9] dark:text-sky-300 font-medium hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Butuh Bantuan? Tanya Admin WA</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
