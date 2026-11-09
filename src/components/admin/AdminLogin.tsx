import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { CalmingBackground } from '../CalmingBackground';
import { PROVISIONED_ADMINS, saveLoggedInAdmin, AdminUser, sha256Hex, ProvisionedAdmin } from '../../data/adminStore';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onBackToPublicSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToPublicSite
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Silakan lengkapi Email dan Kata Sandi Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      const hashedInput = await sha256Hex(cleanPass);

      const found = PROVISIONED_ADMINS.find(
        (a: ProvisionedAdmin) =>
          a.email.toLowerCase() === cleanEmail && a.passwordHash === hashedInput
      );

      if (found) {
        const adminData: AdminUser = {
          email: found.email,
          name: found.name,
          role: found.role,
          loggedAt: new Date().toISOString(),
        };
        saveLoggedInAdmin(adminData);
        onLoginSuccess(adminData);
      } else {
        setErrorMsg('Email atau Kata Sandi tidak sesuai.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat memverifikasi kredensial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-between bg-[#E4F3FE] text-[#1E3348] font-sans selection:bg-[#0EA5E9]/20 selection:text-[#0C4A6E]">
      {/* Calming animated background on login page */}
      <CalmingBackground />

      {/* Top Bar with back link */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBackToPublicSite}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F3456] hover:text-[#0284C7] bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-sky-200/80 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portal Mahasiswa</span>
        </button>
      </header>

      {/* Main Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="bg-white/95 backdrop-blur-md max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-200/90 space-y-6">

          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] border border-sky-200/90 mx-auto flex items-center justify-center p-2 shadow-2xs">
              <img
                src="/assets/aistudio/Konsep_1_c7a81a4a.jpg"
                alt="Logo DIRMAWA UPB"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/public/assets/aistudio/Konsep_1_c7a81a4a.jpg';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F3456]">
                Portal Admin Konseling
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Direktorat Kemahasiswaan & Alumni Universitas Pelita Bangsa
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all text-slate-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all text-slate-900 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-60 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Dashboard Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Direktorat Kemahasiswaan & Alumni Universitas Pelita Bangsa
      </footer>
    </div>
  );
};
