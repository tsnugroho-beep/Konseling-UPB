import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Settings, 
  CircleEllipsis,
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  User,
  Bell,
  HelpCircle
} from 'lucide-react';
import { AdminUser, AdminStoredData, RegistrationSettings, getAdminStoredData, saveAdminStoredData, clearLoggedInAdmin } from '../../data/adminStore';
import { AdminDashboardHome } from './AdminDashboardHome';
import { ManageArticles } from './ManageArticles';
import { ManageAssessments } from './ManageAssessments';
import { AdminSettingsSOP } from './AdminSettingsSOP';
import { Article, PsychologicalTest, FaqItem } from '../../types';

interface AdminDashboardProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onViewPublicPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  onLogout,
  onViewPublicPortal,
}) => {
  const [activeMenu, setActiveMenu] = useState<'beranda' | 'artikel' | 'asesmen' | 'sop'>('beranda');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Data state
  const [storeData, setStoreData] = useState<AdminStoredData>(() => getAdminStoredData());

  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(getAdminStoredData());
    };
    window.addEventListener('upb_admin_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('upb_admin_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSaveArticles = (updatedArticles: Article[]) => {
    const updated: AdminStoredData = {
      ...storeData,
      articles: updatedArticles,
    };
    setStoreData(updated);
    saveAdminStoredData(updated);
  };

  const handleSaveAssessments = (updatedAssessments: PsychologicalTest[]) => {
    const updated: AdminStoredData = {
      ...storeData,
      assessments: updatedAssessments,
    };
    setStoreData(updated);
    saveAdminStoredData(updated);
  };

  const handleSaveSettings = (settings: RegistrationSettings) => {
    const updated: AdminStoredData = {
      ...storeData,
      registrationSettings: settings,
    };
    setStoreData(updated);
    saveAdminStoredData(updated);
  };

  const handleSaveFaqs = (updatedFaqs: FaqItem[]) => {
    const updated: AdminStoredData = {
      ...storeData,
      faqs: updatedFaqs,
    };
    setStoreData(updated);
    saveAdminStoredData(updated);
  };

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: LayoutDashboard },
    { id: 'artikel', label: 'Kelola Artikel', icon: BookOpen, badge: storeData.articles.length },
    { id: 'asesmen', label: 'Kelola Asesmen', icon: Brain, badge: storeData.assessments.length },
    { id: 'sop', label: 'Lainnya', icon: CircleEllipsis },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1 border border-slate-200 shadow-2xs overflow-hidden shrink-0">
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
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight block">
                  Panel Pengelola Konseling
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight">
                  DIRMAWA Universitas Pelita Bangsa
                </span>
              </div>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicPortal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
            >
              <span>Lihat Portal Mahasiswa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Staff User Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {adminUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{adminUser.name}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Keluar dari Panel Admin"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0EA5E9] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
            />
            <div className="relative w-64 max-w-xs bg-white h-full p-4 shadow-xl flex flex-col justify-between z-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Menu Pengelola</span>
                  <button onClick={() => setIsMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMenu(item.id as any);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-[#0EA5E9] text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={onViewPublicPortal}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-50 text-[#0284C7] text-xs font-semibold"
                >
                  <span>Portal Mahasiswa</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeMenu === 'beranda' && (
            <AdminDashboardHome
              articles={storeData.articles}
              assessments={storeData.assessments}
              googleFormUrl={storeData.registrationSettings?.googleFormUrl}
              onNavigateTab={(tab) => setActiveMenu(tab as any)}
            />
          )}

          {activeMenu === 'artikel' && (
            <ManageArticles
              articles={storeData.articles}
              onSaveArticles={handleSaveArticles}
            />
          )}

          {activeMenu === 'asesmen' && (
            <ManageAssessments
              assessments={storeData.assessments}
              onSaveAssessments={handleSaveAssessments}
            />
          )}

          {activeMenu === 'sop' && (
            <AdminSettingsSOP 
              settings={storeData.registrationSettings}
              faqs={storeData.faqs}
              onSaveSettings={handleSaveSettings}
              onSaveFaqs={handleSaveFaqs}
            />
          )}
        </main>

      </div>

    </div>
  );
};

