import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  FileEdit,
  MessageSquare,
  CalendarClock,
  Video
} from 'lucide-react';
import { getAdminStoredData, DEFAULT_REGISTRATION_SETTINGS } from '../data/adminStore';

interface RegistrationFlowProps {
  googleFormUrl?: string;
  onOpenBookingModal?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

const STEP_ICONS = [CalendarClock, FileEdit, MessageSquare, Video];

export const RegistrationFlow: React.FC<RegistrationFlowProps> = () => {
  const [regData, setRegData] = useState(() => {
    return getAdminStoredData().registrationSettings || DEFAULT_REGISTRATION_SETTINGS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setRegData(getAdminStoredData().registrationSettings || DEFAULT_REGISTRATION_SETTINGS);
    };
    window.addEventListener('upb_admin_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('upb_admin_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const steps = regData.steps || DEFAULT_REGISTRATION_SETTINGS.steps;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">

      {/* Section Header (Dynamic from Admin) */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F3456] dark:text-white transition-colors">
          {regData.headerTitle || 'Cara Mendaftar Konseling via Google Form'}
        </h2>
        <p className="text-sm sm:text-base text-stone-600 dark:text-sky-100/80 transition-colors">
          {regData.headerSubtitle || 'Kami sengaja menggunakan sistem pendaftaran Google Form agar kamu dapat mendaftar dengan praktis, aman, dan tanpa hambatan teknis akun.'}
        </p>
      </div>

      {/* Steps Grid (Dynamic from Admin) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${steps.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
        {steps.map((step, idx) => {
          const Icon = STEP_ICONS[idx % STEP_ICONS.length] || CalendarClock;
          const displayNum = step.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F243C]/95 border border-stone-200/90 dark:border-sky-800/70 shadow-2xs flex flex-col justify-between hover:border-stone-300 dark:hover:border-sky-600/70 transition-colors relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold font-mono text-[#0EA5E9]/40 dark:text-sky-400/45 tabular-nums">
                    {displayNum}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] dark:bg-[#15304E] border border-stone-200 dark:border-sky-700/60 text-[#0EA5E9] dark:text-sky-300 flex items-center justify-center shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
                  {step.desc}
                </p>
              </div>

              {step.tips && (
                <div className="pt-3 border-t border-stone-100 dark:border-sky-800/60 text-[11px] text-stone-500 dark:text-slate-400 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9] dark:text-sky-400 shrink-0 mt-0.5" />
                  <span>{step.tips}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
