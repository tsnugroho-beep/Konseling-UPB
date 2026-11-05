import React from 'react';

export const CalmingBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none transition-colors duration-500"
    >
      {/* Base canvas: Soft Sky Blue (Light) / Serene Midnight Sky (Dark) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D8EEFE] via-[#E5F4FE] to-[#D2ECFD] dark:from-[#071322] dark:via-[#0B1D33] dark:to-[#08172A] transition-colors duration-500" />

      {/* 1. Soft Sky Blue Breathing Orb (Top Left) */}
      <div
        className="calming-orb-1 absolute -top-28 -left-24 w-[28rem] h-[28rem] sm:w-[38rem] sm:h-[38rem] rounded-full opacity-80 dark:opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, rgba(125, 211, 252, 0.20) 48%, transparent 75%)',
        }}
      />

      {/* 2. Airy Cerulean / Ice Blue Orb (Top Right) */}
      <div
        className="calming-orb-2 absolute -top-16 -right-24 w-[26rem] h-[26rem] sm:w-[36rem] sm:h-[36rem] rounded-full opacity-75 dark:opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(96, 165, 250, 0.34) 0%, rgba(59, 130, 246, 0.18) 45%, transparent 75%)',
        }}
      />

      {/* 3. Gentle Aqua / Breeze Mist (Bottom Center-Left) */}
      <div
        className="calming-orb-3 absolute -bottom-32 left-[12%] w-[30rem] h-[30rem] sm:w-[42rem] sm:h-[42rem] rounded-full opacity-75 dark:opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.30) 0%, rgba(34, 211, 238, 0.16) 50%, transparent 75%)',
        }}
      />

      {/* 4. Soft Powder Blue Serenity Glow (Middle Right) */}
      <div
        className="calming-orb-4 absolute top-[38%] right-[8%] w-[20rem] h-[20rem] sm:w-[28rem] sm:h-[28rem] rounded-full opacity-70 dark:opacity-35 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.32) 0%, rgba(125, 211, 252, 0.14) 55%, transparent 75%)',
        }}
      />

      {/* Mindful Breathing Concentric Ripples */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] sm:w-[62rem] sm:h-[62rem] opacity-[0.28] dark:opacity-[0.18]"
        viewBox="0 0 800 800"
        fill="none"
      >
        <circle
          cx="400"
          cy="400"
          r="160"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeDasharray="4 8"
          className="calming-ripple-1 origin-center"
        />
        <circle
          cx="400"
          cy="400"
          r="260"
          stroke="#0EA5E9"
          strokeWidth="0.9"
          strokeOpacity="0.7"
          className="calming-ripple-2 origin-center"
        />
        <circle
          cx="400"
          cy="400"
          r="360"
          stroke="#60A5FA"
          strokeWidth="0.8"
          strokeOpacity="0.55"
          strokeDasharray="3 10"
          className="calming-ripple-3 origin-center"
        />
      </svg>

      {/* Gentle Floating Light Motes */}
      <span className="calming-mote calming-mote-1 absolute top-[26%] left-[18%] w-2.5 h-2.5 rounded-full bg-sky-500/35 dark:bg-sky-300/45 blur-[0.5px]" />
      <span className="calming-mote calming-mote-2 absolute top-[62%] left-[24%] w-2.5 h-2.5 rounded-full bg-blue-500/30 dark:bg-blue-300/40 blur-[0.5px]" />
      <span className="calming-mote calming-mote-3 absolute top-[34%] right-[20%] w-2.5 h-2.5 rounded-full bg-sky-500/30 dark:bg-sky-300/40 blur-[0.5px]" />
      <span className="calming-mote calming-mote-4 absolute top-[70%] right-[26%] w-2 h-2 rounded-full bg-cyan-500/35 dark:bg-cyan-300/45 blur-[0.5px]" />
      <span className="calming-mote calming-mote-5 absolute top-[48%] left-[52%] w-2 h-2 rounded-full bg-sky-600/25 dark:bg-sky-200/35 blur-[0.5px]" />

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.2]"
        style={{
          backgroundImage: 'radial-gradient(#38BDF8 0.7px, transparent 0.7px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 35%, rgba(0,0,0,0.45) 0%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 35%, rgba(0,0,0,0.45) 0%, transparent 80%)',
        }}
      />
    </div>
  );
};
