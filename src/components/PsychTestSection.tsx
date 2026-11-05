import React, { useState } from 'react';
import { 
  CheckCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUpRight, 
  ClipboardCopy, 
  ShieldAlert, 
  FileText,
  Clock,
  Brain,
  HeartPulse,
  Flame,
  ShieldCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { PSYCHOLOGICAL_TESTS } from '../data/mockData';
import { PsychologicalTest, ScoreBand } from '../types';

interface PsychTestSectionProps {
  onOpenBooking: () => void;
  onSetBookingReferralNote?: (note: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const PsychTestSection: React.FC<PsychTestSectionProps> = ({ 
  onOpenBooking, 
  onSetBookingReferralNote,
  onNavigateTab
}) => {
  // When activeTestId is null, show test cards catalogue.
  // When activeTestId has a value, show that specific test questionnaire/result.
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const activeTest: PsychologicalTest | undefined = 
    PSYCHOLOGICAL_TESTS.find((t) => t.id === activeTestId);

  const totalQuestions = activeTest ? activeTest.questions.length : 0;
  const currentQuestion = activeTest ? activeTest.questions[currentQuestionIndex] : null;
  const isCurrentAnswered = currentQuestion ? selectedAnswers[currentQuestion.id] !== undefined : false;

  // Calculate total score
  const calculateTotalScore = (): number => {
    return Object.values(selectedAnswers).reduce((sum, score) => sum + score, 0);
  };

  const getScoreBand = (score: number): ScoreBand => {
    if (!activeTest) return { min: 0, max: 0, label: '', level: 'low', headline: '', description: '', symptomsList: [], recommendations: [], referralAction: '' };
    const band = activeTest.scoreBands.find((b) => score >= b.min && score <= b.max);
    return band || activeTest.scoreBands[activeTest.scoreBands.length - 1];
  };

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  const handleBackToCardCatalogue = () => {
    setActiveTestId(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  const handleSelectOption = (questionId: number, score: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));

    // Auto advance if not last question
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 250);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
      }, 300);
    }
  };

  const handleResetTest = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
  };

  const handleCopySummary = () => {
    if (!activeTest) return;
    const totalScore = calculateTotalScore();
    const resultBand = getScoreBand(totalScore);
    const summaryText = `[Hasil ${activeTest.title}]\nSkor: ${totalScore} dari maksimal ${totalQuestions * 3} (${resultBand.label})\nInterpretasi: ${resultBand.headline}\nCatatan: Hasil tes mandiri mahasiswa di website Konseling DIRMAWA UPB untuk bahan diskusi sesi konseling.`;

    navigator.clipboard.writeText(summaryText);
    setCopyFeedback(true);
    if (onSetBookingReferralNote) {
      onSetBookingReferralNote(summaryText);
    }
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleProceedToBooking = () => {
    if (!activeTest) return;
    const totalScore = calculateTotalScore();
    const resultBand = getScoreBand(totalScore);
    const summaryText = `Skor ${activeTest.title}: ${totalScore} (${resultBand.label})`;
    if (onSetBookingReferralNote) {
      onSetBookingReferralNote(summaryText);
    }
    onOpenBooking();
  };

  const totalScore = calculateTotalScore();
  const currentResultBand = isCompleted && activeTest ? getScoreBand(totalScore) : null;

  // Helper icons and styles for each test card
  const getTestCardDetails = (testId: string) => {
    switch (testId) {
      case 'skrining-stres':
        return {
          icon: Brain,
          iconBg: 'bg-sky-50 dark:bg-sky-900/55 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-700/70',
          badgeText: 'Adaptasi PSS-10',
          accentColor: '#0EA5E9',
          focus: 'Beban studi, adaptasi tugas, dan ritme tidur mahasiswa'
        };
      case 'skrining-kecemasan':
        return {
          icon: HeartPulse,
          iconBg: 'bg-amber-50 dark:bg-amber-950/55 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/70',
          badgeText: 'Adaptasi GAD-7',
          accentColor: '#D97706',
          focus: 'Overthinking masa depan, cemas ujian, dan kegelisahan batin'
        };
      case 'skrining-burnout':
      default:
        return {
          icon: Flame,
          iconBg: 'bg-rose-50 dark:bg-rose-950/55 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/70',
          badgeText: 'Dimensi MBI Mahasiswa',
          accentColor: '#E11D48',
          focus: 'Kelelahan skripsi/tugas, kehilangan motivasi, dan kejenuhan kuliah'
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. VIEW MODE A: TEST CARDS CATALOGUE (Default view) */}
      {!activeTestId && (
        <div className="space-y-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F3456] dark:text-white transition-colors">
              Kenali Kondisi Batinmu Hari Ini
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-sky-100/80 transition-colors">
              Pilih salah satu kartu tes di bawah ini untuk memulai refleksi mandiri. Tes berjalan privat, bebas biaya, dan hasilnya siap kamu diskusikan dalam sesi konseling.
            </p>
          </div>

          {/* 3 Interactive Test Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PSYCHOLOGICAL_TESTS.map((test) => {
              const cardMeta = getTestCardDetails(test.id);
              const IconComponent = cardMeta.icon;

              return (
                <div
                  key={test.id}
                  onClick={() => handleStartTest(test.id)}
                  className="group bg-white dark:bg-[#0F243C]/95 rounded-2xl border border-stone-200/90 dark:border-sky-800/70 hover:border-[#0EA5E9]/60 dark:hover:border-sky-500/70 p-6 sm:p-7 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  {/* Decorative hover subtle accent top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-stone-200 dark:bg-sky-900 group-hover:bg-[#0EA5E9] transition-colors" />

                  <div className="space-y-4">
                    {/* Card Top: Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cardMeta.iconBg} transition-transform group-hover:scale-105`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#15304E] text-stone-700 dark:text-sky-200">
                        {cardMeta.badgeText}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white group-hover:text-[#0F3456] dark:group-hover:text-sky-300 transition-colors leading-snug">
                        {test.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {test.description}
                      </p>
                    </div>

                    {/* Focus Details */}
                    <div className="pt-2 border-t border-stone-100 dark:border-sky-800/60 text-xs text-stone-500 dark:text-slate-400 space-y-1">
                      <span className="font-semibold text-stone-700 dark:text-sky-200 block">Fokus Skrining:</span>
                      <p className="text-stone-600 dark:text-slate-300">{cardMeta.focus}</p>
                    </div>
                  </div>

                  {/* Card Bottom: Meta info & Action Button */}
                  <div className="pt-6 mt-4 border-t border-stone-100/90 dark:border-sky-800/60 space-y-4">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500" />
                        ~{test.estimatedMinutes} Menit
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <FileText className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500" />
                        {test.totalQuestions} Pertanyaan
                      </span>
                    </div>

                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-[#0F3456] dark:bg-[#17365B] text-white group-hover:bg-[#0EA5E9] transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Mulai Tes Ini</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy & Confidentiality Guarantee Banner */}
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-stone-100/80 dark:bg-[#0F243C]/90 border border-stone-200/90 dark:border-sky-800/70 flex items-center gap-3.5 text-xs sm:text-sm text-stone-700 dark:text-slate-300">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#15304E] border border-stone-200 dark:border-sky-700/60 flex items-center justify-center shrink-0 text-[#0EA5E9] dark:text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="leading-relaxed">
              <strong className="dark:text-white">Privasi Terjamin:</strong> Seluruh jawaban dihitung langsung di perangkatmu tanpa disimpan di server. Skor dan ringkasan dapat kamu salin sebagai referensi saat berkonsultasi dengan konselor.
            </p>
          </div>

        </div>
      )}

      {/* 2. VIEW MODE B: ACTIVE TEST QUESTIONNAIRE / RESULT */}
      {activeTest && (
        <div className="space-y-6">
          
          {/* Top Bar: Back to Cards button & current test context */}
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBackToCardCatalogue}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 dark:text-sky-100 bg-white dark:bg-[#0F243C] hover:bg-stone-50 dark:hover:bg-[#15304E] border border-stone-200 dark:border-sky-800/70 rounded-xl transition-colors cursor-pointer shadow-2xs group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Kembali ke Pilihan Tes</span>
            </button>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-200/70 dark:bg-[#15304E] text-stone-700 dark:text-sky-200 border border-transparent dark:border-sky-800/60">
              {activeTest.badge}
            </span>
          </div>

          {/* Test Card Container */}
          <div className="bg-white dark:bg-[#0F243C]/95 rounded-3xl border border-stone-200/90 dark:border-sky-800/70 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto transition-all">
            
            {/* Top metadata of active test */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 dark:border-sky-800/60 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0EA5E9] dark:text-sky-400 uppercase tracking-wider">
                    {activeTest.badge}
                  </span>
                  <span className="text-stone-300 dark:text-sky-700" aria-hidden="true">·</span>
                  <span className="text-xs text-stone-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{activeTest.estimatedMinutes} Menit</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mt-1">
                  {activeTest.title}
                </h3>
              </div>
              
              {!isCompleted && (
                <div className="text-xs font-medium text-stone-500 dark:text-sky-200 bg-stone-100 dark:bg-[#15304E] px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-center">
                  Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
                </div>
              )}
            </div>

            {/* Test in Progress View */}
            {!isCompleted && currentQuestion ? (
              <div className="mt-8 space-y-6">
                
                {/* Progress Bar */}
                <div className="w-full bg-stone-100 dark:bg-[#15304E] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0EA5E9] h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>

                {/* Question Statement */}
                <div className="py-2">
                  <p className="text-base sm:text-lg font-semibold text-stone-800 dark:text-white leading-relaxed">
                    {currentQuestion.prompt}
                  </p>
                </div>

                {/* Option Buttons */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === option.score;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQuestion.id, option.score)}
                        className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base font-medium transition-all flex items-center justify-between cursor-pointer group ${
                          isSelected
                            ? 'border-[#0EA5E9] bg-[#0EA5E9]/8 dark:bg-sky-500/20 text-[#0F3456] dark:text-white shadow-2xs font-semibold'
                            : 'border-stone-200 dark:border-sky-800/65 bg-stone-50/40 dark:bg-[#132C49]/60 hover:bg-stone-50 dark:hover:bg-[#17365B] hover:border-stone-300 dark:hover:border-sky-600/70 text-stone-700 dark:text-slate-200'
                        }`}
                      >
                        <span>{option.label}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected 
                            ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white' 
                            : 'border-stone-300 dark:border-sky-700 group-hover:border-stone-400 dark:group-hover:border-sky-400'
                        }`}>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-200/80 dark:border-sky-800/60">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sebelumnya</span>
                  </button>

                  <span className="text-xs text-stone-400 dark:text-slate-400">
                    {Object.keys(selectedAnswers).length} dijawab
                  </span>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      disabled={!isCurrentAnswered}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0EA5E9] dark:text-sky-400 hover:text-[#0284C7] dark:hover:text-sky-300 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>Berikutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCompleted(true)}
                      disabled={!isCurrentAnswered}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-lg disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                    >
                      <span>Lihat Hasil Tes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : isCompleted && currentResultBand ? (
              /* Completed / Result View */
              <div className="mt-8 space-y-8 animate-in fade-in duration-300">
                
                {/* Score Header Card */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#F0F9FF] dark:bg-[#132C49] border border-stone-200 dark:border-sky-800/70 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-stone-500 dark:text-sky-300/80 uppercase tracking-wider">
                        Hasil Evaluasi Mandiri Mahasiswa
                      </span>
                      <h4 className="text-2xl font-bold text-stone-900 dark:text-white mt-0.5">
                        {currentResultBand.label}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0EA5E9] dark:text-sky-400 tabular-nums">
                          {totalScore}
                        </span>
                        <span className="text-xs text-stone-400 dark:text-slate-400 font-mono"> / {totalQuestions * 3}</span>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400">Skor Terkumpul</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Range Indicator Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="grid grid-cols-4 gap-1.5 h-2.5 rounded-full overflow-hidden bg-stone-200 dark:bg-sky-950">
                      <div className={`h-full ${totalScore <= 5 ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-sky-900/80'}`} />
                      <div className={`h-full ${totalScore >= 6 && totalScore <= 11 ? 'bg-amber-400' : 'bg-stone-300 dark:bg-sky-900/80'}`} />
                      <div className={`h-full ${totalScore >= 12 && totalScore <= 16 ? 'bg-orange-500' : 'bg-stone-300 dark:bg-sky-900/80'}`} />
                      <div className={`h-full ${totalScore >= 17 ? 'bg-rose-500' : 'bg-stone-300 dark:bg-sky-900/80'}`} />
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-400 dark:text-slate-400 px-0.5">
                      <span>Terkendali</span>
                      <span>Sedang</span>
                      <span>Tinggi</span>
                      <span>Sangat Tinggi</span>
                    </div>
                  </div>

                  {/* Headline & Description */}
                  <div className="pt-2">
                    <p className="text-base font-semibold text-stone-800 dark:text-white">
                      {currentResultBand.headline}
                    </p>
                    <p className="text-sm text-stone-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {currentResultBand.description}
                    </p>
                  </div>

                  {/* Symptoms Checklist */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-stone-700 dark:text-sky-200 uppercase tracking-wider mb-2">
                      Gejala yang mungkin kamu rasakan saat ini:
                    </p>
                    <ul className="space-y-1.5">
                      {currentResultBand.symptomsList.map((symptom, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 dark:text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#0EA5E9] dark:text-sky-400 shrink-0" />
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="pt-3 border-t border-stone-200/80 dark:border-sky-800/60">
                    <p className="text-xs font-bold text-stone-700 dark:text-sky-200 uppercase tracking-wider mb-2">
                      Rekomendasi Pemulihan Praktis:
                    </p>
                    <ul className="space-y-1.5">
                      {currentResultBand.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-600 dark:text-slate-300">
                          <span className="text-[#0EA5E9] dark:text-sky-400 font-bold">·</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Empathetic High-Conversion CTA Block */}
                <div className="p-6 rounded-2xl bg-[#0EA5E9]/10 dark:bg-sky-900/35 border border-[#0EA5E9]/20 dark:border-sky-700/60 text-stone-900 dark:text-white space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-sky-800 dark:text-sky-200 bg-sky-100 dark:bg-sky-900/80 px-2 py-0.5 rounded-full">
                          100% Bebas Biaya (Free)
                        </span>
                        <span className="text-xs text-stone-500 dark:text-slate-300 font-medium">Didampingi Konselor Profesional</span>
                      </div>
                      <h5 className="text-base font-bold text-stone-900 dark:text-white">
                        Ingin Membicarakan Hasil Ini dalam Sesi Konseling?
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                        {currentResultBand.referralAction}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <button
                      onClick={handleProceedToBooking}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Daftar Konseling via Google Form</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleCopySummary}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-stone-700 dark:text-sky-100 bg-white dark:bg-[#112844] hover:bg-stone-50 dark:hover:bg-[#17365B] border border-stone-300 dark:border-sky-700/70 rounded-xl transition-colors cursor-pointer"
                    >
                      <ClipboardCopy className="w-4 h-4 text-stone-500 dark:text-sky-300" />
                      <span>{copyFeedback ? 'Tersalin ke Clipboard!' : 'Salin Rangkuman Skor'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400">
                    Tip: Salin rangkuman di atas agar dapat kamu tempelkan pada kolom kendala di Google Form pendaftaran.
                  </p>
                </div>

                {/* Action Buttons: Retake or Switch to other tests or return to cards */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleResetTest}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi Tes Ini</span>
                    </button>
                    <span className="text-stone-300 dark:text-sky-800">|</span>
                    <button
                      onClick={handleBackToCardCatalogue}
                      className="text-xs font-semibold text-[#0EA5E9] dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      ← Pilih Tes Lainnya
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {PSYCHOLOGICAL_TESTS.filter(t => t.id !== activeTestId).map((otherTest) => (
                      <button
                        key={otherTest.id}
                        onClick={() => handleStartTest(otherTest.id)}
                        className="text-xs font-semibold text-stone-500 dark:text-slate-400 hover:text-[#0EA5E9] dark:hover:text-sky-300 cursor-pointer"
                      >
                        Coba {otherTest.shortTitle} →
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clinical Ethics Disclaimer */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-stone-100/80 dark:bg-[#0B1B2E]/90 border border-stone-200/80 dark:border-sky-800/60 text-[11px] text-stone-500 dark:text-slate-400 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-stone-400 dark:text-slate-400 mt-0.5" />
                  <p>
                    <strong className="dark:text-slate-200">Penafian Etika:</strong> Tes skrining ini merupakan alat bantu refleksi mandiri terstandar untuk memberikan gambaran awal, bukan merupakan diagnosis klinis resmi. Untuk diskusi komprehensif, manfaatkan sesi konseling tatap muka atau daring bersama konselor mahasiswa.
                  </p>
                </div>

              </div>
            ) : null}

          </div>

        </div>
      )}

    </div>
  );
};
