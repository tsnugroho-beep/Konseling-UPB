import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onTabChange: (tabId: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onTabChange,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0284C7] dark:from-[#071629] dark:via-[#0A1E36] dark:to-[#071629] backdrop-blur-md border-b border-sky-400/35 dark:border-sky-800/65 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 min-h-16 sm:min-h-18 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand title */}
        <button
          onClick={() => onTabChange('beranda')}
          className="flex items-center gap-2.5 sm:gap-3 text-white shrink group cursor-pointer text-left min-w-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center p-1 border border-white/30 shadow-xs group-hover:scale-102 transition-transform shrink-0 overflow-hidden">
            <img 
              src="/assets/aistudio/Konsep_1_c7a81a4a.jpg" 
              alt="Logo DIRMAWA Universitas Pelita Bangsa" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/public/assets/aistudio/Konsep_1_c7a81a4a.jpg';
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white leading-tight transition-colors">
              Konseling Mahasiswa
            </span>
            <span className="text-[10px] sm:text-[11px] text-sky-100 font-medium leading-tight mt-0.5 transition-colors">
              Direktorat Kemahasiswaan dan Alumni
            </span>
            <span className="text-[10px] sm:text-[11px] text-sky-100 font-medium leading-tight transition-colors">
              Universitas Pelita Bangsa
            </span>
          </div>
        </button>

        {/* Light / Dark Mode Slider Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          onClick={onToggleTheme}
          aria-label={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          title={isDark ? 'Mode Gelap (Klik untuk beralih ke Mode Terang)' : 'Mode Terang (Klik untuk beralih ke Mode Gelap)'}
          className="relative inline-flex items-center h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 bg-sky-900/40 dark:bg-[#071628] border border-sky-300/40 dark:border-sky-700/80 shadow-inner transition-colors duration-300 focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-[#0B1D32] group"
        >
          {/* Track Background Icons */}
          <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none select-none">
            <Sun className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-50 text-amber-400' : 'opacity-0'}`} />
            <Moon className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-50 text-sky-700'}`} />
          </div>

          {/* Sliding Thumb Knob */}
          <span
            className={`relative z-10 inline-flex items-center justify-center h-6 w-6 rounded-full bg-white dark:bg-[#16365C] shadow-sm border border-sky-100 dark:border-sky-600/60 transform transition-transform duration-300 ease-in-out ${
              isDark ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-sky-200" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </span>
        </button>

      </div>
    </header>
  );
};
