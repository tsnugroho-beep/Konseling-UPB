/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CrisisBanner } from './components/CrisisBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PsychTestSection } from './components/PsychTestSection';
import { RegistrationFlow } from './components/RegistrationFlow';
import { ArticlesSection } from './components/ArticlesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { GoogleFormModal } from './components/GoogleFormModal';
import { CalmingBackground } from './components/CalmingBackground';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getLoggedInAdmin, AdminUser, clearLoggedInAdmin, getAdminStoredData } from './data/adminStore';
import { DEFAULT_GOOGLE_FORM_URL, ADMIN_WHATSAPP_NUMBER } from './data/mockData';
import { CounselingService } from './types';
import { MessageSquare, ArrowUpRight, ChevronRight, ChevronLeft } from 'lucide-react';

export default function App() {
  const [adminData, setAdminData] = useState(() => getAdminStoredData());
  const googleFormUrl = adminData.registrationSettings?.googleFormUrl || DEFAULT_GOOGLE_FORM_URL;

  useEffect(() => {
    const handleUpdate = () => setAdminData(getAdminStoredData());
    window.addEventListener('upb_admin_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('upb_admin_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Global Route State: 'portal' | 'admin-login' | 'admin-dashboard'
  const [route, setRoute] = useState<'portal' | 'admin-login' | 'admin-dashboard'>(() => {
    try {
      const path = window.location.pathname;
      const admin = getLoggedInAdmin();
      if (path === '/dashboard') {
        return admin ? 'admin-dashboard' : 'admin-login';
      }
      if (path === '/login') {
        return admin ? 'admin-dashboard' : 'admin-login';
      }
      return 'portal';
    } catch {
      return 'portal';
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => getLoggedInAdmin());

  // Listen to browser popstate/navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const admin = getLoggedInAdmin();
      if (path === '/dashboard') {
        if (!admin) {
          window.history.replaceState(null, '', '/login');
          setRoute('admin-login');
        } else {
          setRoute('admin-dashboard');
        }
      } else if (path === '/login') {
        if (admin) {
          window.history.replaceState(null, '', '/dashboard');
          setRoute('admin-dashboard');
        } else {
          setRoute('admin-login');
        }
      } else {
        setRoute('portal');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newRoute: 'portal' | 'admin-login' | 'admin-dashboard') => {
    if (newRoute === 'admin-dashboard') {
      const admin = getLoggedInAdmin();
      if (!admin) {
        window.history.pushState(null, '', '/login');
        setRoute('admin-login');
        return;
      }
      window.history.pushState(null, '', '/dashboard');
    } else if (newRoute === 'admin-login') {
      window.history.pushState(null, '', '/login');
    } else {
      window.history.pushState(null, '', '/');
    }
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    window.history.pushState(null, '', '/dashboard');
    setRoute('admin-dashboard');
  };

  const handleAdminLogout = () => {
    clearLoggedInAdmin();
    setCurrentAdmin(null);
    window.history.pushState(null, '', '/login');
    setRoute('admin-login');
  };

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('upb_konseling_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('upb_konseling_theme', isDark ? 'dark' : 'light');
    } catch {
      // safe fallback
    }
  }, [isDark]);

  // Tab State: 'beranda' | 'layanan' | 'tes-psikologi' | 'konselor' | 'alur-daftar' | 'artikel' | 'faq'
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [preSelectedService, setPreSelectedService] = useState<CounselingService | null>(null);
  const [bookingReferralNote, setBookingReferralNote] = useState<string>('');

  const tabsOrder = [
    { id: 'beranda', title: 'Beranda', mobileTitle: 'Beranda' },
    { id: 'tes-psikologi', title: 'Tes Psikologi', mobileTitle: 'Tes Psikologi' },
    { id: 'artikel', title: 'Artikel', mobileTitle: 'Artikel' },
    { id: 'alur-daftar', title: 'Cara Mendaftar', mobileTitle: 'Cara Mendaftar' },
    { id: 'faq', title: 'FAQ', mobileTitle: 'FAQ' },
  ];

  const currentTabIndex = tabsOrder.findIndex((t) => t.id === activeTab);
  const prevTab = currentTabIndex > 0 ? tabsOrder[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < tabsOrder.length - 1 ? tabsOrder[currentTabIndex + 1] : null;

  const handleOpenGeneralBooking = () => {
    setPreSelectedService(null);
    setIsBookingModalOpen(true);
  };

  const handleSelectService = (service: CounselingService) => {
    setPreSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Guarded Route: Admin Dashboard
  if (route === 'admin-dashboard') {
    if (!currentAdmin) {
      // Route Guarding: redirect unauthenticated user to login
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToPublicSite={() => navigateTo('portal')}
        />
      );
    }

    return (
      <AdminDashboard
        adminUser={currentAdmin}
        onLogout={handleAdminLogout}
        onViewPublicPortal={() => navigateTo('portal')}
      />
    );
  }

  // 2. Closed Route: Admin Login
  if (route === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToPublicSite={() => navigateTo('portal')}
      />
    );
  }

  // 3. Public Student Portal
  return (
    <div className="relative isolate min-h-screen flex flex-col bg-[#E4F3FE] dark:bg-[#09182B] text-[#1E3348] dark:text-slate-100 selection:bg-[#0EA5E9]/20 selection:text-[#0C4A6E] dark:selection:bg-sky-400/25 dark:selection:text-sky-100 transition-colors duration-300">
      
      {/* Ambient Calming Animated Background */}
      <CalmingBackground />

      {/* 1. Emergency Crisis Hotline Banner */}
      <CrisisBanner />

      {/* 2. Top Header (Brand & Theme Toggle) */}
      <Navbar
        onTabChange={handleTabChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* 3. Dedicated Tab Navigation Bar (100% visible on both mobile and desktop) */}
      <div className="bg-[#D6EEFE]/90 dark:bg-[#0E243E]/90 backdrop-blur-md border-b border-sky-300/70 dark:border-sky-800/65 sticky top-16 sm:top-18 z-30 shadow-2xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-1.5 sm:py-2.5">
          <div className="grid grid-cols-5 sm:flex sm:items-center sm:justify-start gap-1 sm:gap-2">
            {tabsOrder.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full sm:w-auto px-1 sm:px-4 py-2 sm:py-1.5 rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs transition-all cursor-pointer text-center sm:text-left flex items-center justify-center ${
                    isActive
                      ? 'bg-[#0284C7] dark:bg-[#0EA5E9] text-white shadow-xs font-bold'
                      : 'text-[#0F3A5D] dark:text-sky-200/85 hover:text-[#0369A1] dark:hover:text-white hover:bg-white/65 dark:hover:bg-sky-900/50 font-medium'
                  }`}
                >
                  <span className="hidden sm:inline whitespace-nowrap">{tab.title}</span>
                  <span className="inline sm:hidden leading-tight text-center">{tab.mobileTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Dedicated Tab View (Switches smoothly per tab, without downward scrolling) */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all">
        
        {/* Render only active tab page */}
        <div key={activeTab} className="transition-opacity duration-300">
          {activeTab === 'beranda' && (
            <Hero
              onOpenBooking={handleOpenGeneralBooking}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'tes-psikologi' && (
            <PsychTestSection
              onOpenBooking={handleOpenGeneralBooking}
              onSetBookingReferralNote={setBookingReferralNote}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'alur-daftar' && (
            <RegistrationFlow
              googleFormUrl={googleFormUrl}
              onOpenBookingModal={handleOpenGeneralBooking}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'artikel' && (
            <ArticlesSection
              onOpenBooking={handleOpenGeneralBooking}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'faq' && (
            <FaqSection />
          )}
        </div>

        {/* Tab Pagination Footer: Easy navigation to previous and next tabs */}
        <div className="mt-14 pt-6 border-t border-sky-200/70 dark:border-sky-800/60 flex items-center justify-between text-xs sm:text-sm">
          {prevTab ? (
            <button
              onClick={() => handleTabChange(prevTab.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 dark:text-sky-200/85 hover:text-[#0C4A6E] dark:hover:text-white hover:bg-sky-100/70 dark:hover:bg-sky-900/50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya: <strong>{prevTab.title}</strong></span>
            </button>
          ) : <div />}

          {nextTab && (
            <button
              onClick={() => handleTabChange(nextTab.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#0284C7] dark:text-sky-300 font-semibold bg-sky-100/80 dark:bg-sky-900/50 hover:bg-sky-200/70 dark:hover:bg-sky-800/60 transition-colors cursor-pointer ml-auto"
            >
              <span>Lanjut ke <strong>{nextTab.title}</strong></span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </main>

      {/* 4. Institutional Footer */}
      <div className="relative z-10">
        <Footer
          onOpenBooking={handleOpenGeneralBooking}
          onNavigateTab={handleTabChange}
          onOpenAdminLogin={() => navigateTo('admin-login')}
        />
      </div>

      {/* 5. Google Form Booking Modal */}
      <GoogleFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        googleFormUrl={googleFormUrl}
        preSelectedService={preSelectedService}
        referralNote={bookingReferralNote}
      />

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5">
        <a
          href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=Halo%20Admin%20Konseling%20Mahasiswa%20UPB,%20saya%20mahasiswa%20ingin%20konsultasi`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#122B49] hover:bg-sky-50 dark:hover:bg-[#18375C] border border-sky-200 dark:border-sky-700/70 shadow-md text-xs font-semibold text-slate-800 dark:text-sky-100 transition-all hover:scale-102"
          title="Tanya admin via WhatsApp"
        >
          <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400" />
          <MessageSquare className="w-3.5 h-3.5 text-[#0284C7] dark:text-sky-300" />
          <span className="hidden sm:inline">WhatsApp Admin</span>
        </a>

        <button
          onClick={handleOpenGeneralBooking}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-lg text-xs sm:text-sm font-semibold transition-all hover:scale-102 cursor-pointer"
        >
          <span>Daftar Konseling</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
