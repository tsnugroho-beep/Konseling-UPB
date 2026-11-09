import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  X, 
  Clock, 
  Brain, 
  Download, 
  FileCheck,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { PsychologicalTest, Question, ScoreBand } from '../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ManageAssessmentsProps {
  assessments: PsychologicalTest[];
  onSaveAssessments: (updated: PsychologicalTest[]) => void;
}

export const ManageAssessments: React.FC<ManageAssessmentsProps> = ({
  assessments,
  onSaveAssessments,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deletingAssessment, setDeletingAssessment] = useState<PsychologicalTest | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [badge, setBadge] = useState('Adaptasi Skala Psikologi');
  const [estimatedMinutes, setEstimatedMinutes] = useState(3);
  const [description, setDescription] = useState('');
  const [clinicalReference, setClinicalReference] = useState('');
  
  // Excel Parse State
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [excelFileName, setExcelFileName] = useState<string | null>(null);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAddModal = () => {
    setTitle('');
    setShortTitle('');
    setBadge('Adaptasi Skala Psikologi');
    setEstimatedMinutes(3);
    setDescription('');
    setClinicalReference('Standar Skrining Psikologi Mahasiswa');
    setParsedQuestions([]);
    setExcelFileName(null);
    setExcelError(null);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (test: PsychologicalTest) => {
    setDeletingAssessment(test);
  };

  const handleConfirmDelete = () => {
    if (!deletingAssessment) return;
    const updated = assessments.filter((a) => a.id !== deletingAssessment.id);
    onSaveAssessments(updated);
    showToast('Asesmen berhasil dihapus.');
    setDeletingAssessment(null);
  };

  // Process Excel File client-side with XLSX
  const processExcelFile = (file: File) => {
    setExcelError(null);
    setExcelFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to json rows
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rows || rows.length === 0) {
          setExcelError('File Excel kosong atau tidak terbaca.');
          setParsedQuestions([]);
          return;
        }

        const questionsList: Question[] = [];

        rows.forEach((row, index) => {
          // Identify question prompt from common column names
          const prompt = 
            row['Pertanyaan'] || 
            row['pertanyaan'] || 
            row['Soal'] || 
            row['soal'] || 
            row['Question'] || 
            row['question'] ||
            row['Item'];

          if (!prompt) return;

          // Detect options: Opsi_A / Nilai_A or default Likert (0-3)
          const options = [];

          if (row['Opsi_A'] !== undefined || row['opsi_a'] !== undefined) {
            options.push({
              label: String(row['Opsi_A'] || row['opsi_a']),
              score: Number(row['Nilai_A'] ?? row['nilai_a'] ?? 0),
            });
          }
          if (row['Opsi_B'] !== undefined || row['opsi_b'] !== undefined) {
            options.push({
              label: String(row['Opsi_B'] || row['opsi_b']),
              score: Number(row['Nilai_B'] ?? row['nilai_b'] ?? 1),
            });
          }
          if (row['Opsi_C'] !== undefined || row['opsi_c'] !== undefined) {
            options.push({
              label: String(row['Opsi_C'] || row['opsi_c']),
              score: Number(row['Nilai_C'] ?? row['nilai_c'] ?? 2),
            });
          }
          if (row['Opsi_D'] !== undefined || row['opsi_d'] !== undefined) {
            options.push({
              label: String(row['Opsi_D'] || row['opsi_d']),
              score: Number(row['Nilai_D'] ?? row['nilai_d'] ?? 3),
            });
          }

          // If no custom options columns, use default 4-level scale
          if (options.length === 0) {
            options.push(
              { label: 'Tidak Pernah', score: 0 },
              { label: 'Kadang-kadang', score: 1 },
              { label: 'Cukup Sering', score: 2 },
              { label: 'Sangat Sering', score: 3 }
            );
          }

          questionsList.push({
            id: index + 1,
            prompt: String(prompt).trim(),
            options,
          });
        });

        if (questionsList.length === 0) {
          setExcelError('Tidak ditemukan kolom "Pertanyaan" pada file Excel.');
          setParsedQuestions([]);
        } else {
          setParsedQuestions(questionsList);
        }
      } catch (err) {
        console.error(err);
        setExcelError('Gagal membaca file Excel. Pastikan format file .xlsx atau .csv valid.');
        setParsedQuestions([]);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processExcelFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelFile(e.dataTransfer.files[0]);
    }
  };

  // Download Sample Template for Non-IT staff
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        Pertanyaan: 'Dalam sebulan terakhir, seberapa sering kamu merasa cemas menghadapi tugas kuliah?',
        Opsi_A: 'Tidak Pernah',
        Nilai_A: 0,
        Opsi_B: 'Kadang-kadang',
        Nilai_B: 1,
        Opsi_C: 'Cukup Sering',
        Nilai_C: 2,
        Opsi_D: 'Sangat Sering',
        Nilai_D: 3,
      },
      {
        Pertanyaan: 'Seberapa sering kamu merasa kesulitan tidur nyenyak karena memikirkan masa depan?',
        Opsi_A: 'Tidak Pernah',
        Nilai_A: 0,
        Opsi_B: 'Kadang-kadang',
        Nilai_B: 1,
        Opsi_C: 'Cukup Sering',
        Nilai_C: 2,
        Opsi_D: 'Sangat Sering',
        Nilai_D: 3,
      },
      {
        Pertanyaan: 'Seberapa sering kamu merasa kehilangan energi dan motivasi saat berangkat kuliah?',
        Opsi_A: 'Tidak Pernah',
        Nilai_A: 0,
        Opsi_B: 'Kadang-kadang',
        Nilai_B: 1,
        Opsi_C: 'Cukup Sering',
        Nilai_C: 2,
        Opsi_D: 'Sangat Sering',
        Nilai_D: 3,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Pertanyaan');
    XLSX.writeFile(workbook, 'Template_Soal_Asesmen_UPB.xlsx');
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || parsedQuestions.length === 0) {
      alert('Mohon lengkapi Judul Asesmen dan unggah file Excel yang berisi daftar pertanyaan.');
      return;
    }

    const maxScore = parsedQuestions.length * 3;
    const q1 = Math.round(maxScore * 0.25);
    const q2 = Math.round(maxScore * 0.5);
    const q3 = Math.round(maxScore * 0.75);

    // Standard automated scoring bands
    const scoreBands: ScoreBand[] = [
      {
        min: 0,
        max: q1,
        label: 'Terkendali / Rendah',
        level: 'low',
        headline: 'Kondisi emosi dan energimu saat ini berada dalam taraf terkendali.',
        description: 'Kamu memiliki daya adaptasi yang cukup baik menghadapi dinamika perkuliahan saat ini.',
        symptomsList: ['Pola tidur relatif stabil', 'Mampu berkonsentrasi', 'Memiliki minat belajar'],
        recommendations: ['Pertahankan rutinitas istirahat teratur', 'Luangkan waktu untuk hobi di akhir pekan'],
        referralAction: 'Tetap jaga keseimbangan dirimu dan jadwalkan konseling jika ada hal yang ingin diceritakan.',
      },
      {
        min: q1 + 1,
        max: q2,
        label: 'Tingkat Sedang',
        level: 'moderate',
        headline: 'Ada tanda-tanda kelelahan atau kecemasan yang mulai menumpuk.',
        description: 'Tekanan tugas atau ujian mulai membebani pikiranmu secara berkala.',
        symptomsList: ['Kadang sulit rileks', 'Merasa waktu belajar terasa sempit', 'Mudah lelah'],
        recommendations: ['Terapkan teknik pernapasan 4-7-8 saat cemas', 'Bagi tugas besar menjadi langkah-langkah kecil'],
        referralAction: 'Diskusikan hasil ini bersama konselor untuk menemukan strategi manajemen stres yang sesuai.',
      },
      {
        min: q2 + 1,
        max: q3,
        label: 'Tingkat Tinggi',
        level: 'elevated',
        headline: 'Beban emosi atau kejenuhanmu berada pada taraf yang cukup berat.',
        description: 'Kondisi ini dapat mengganggu fokus belajar dan kesehatan fisik jika dibiarkan tanpa pendampingan.',
        symptomsList: ['Kerap overthinking berkepanjangan', 'Sulit berkonsentrasi', 'Penurunan nafsu makan / tidur terganggu'],
        recommendations: ['Ambil jeda istirahat penuh tanpa rasa bersalah', 'Bercerita kepada orang yang kamu percayai'],
        referralAction: 'Sangat disarankan mendaftar sesi konseling gratis untuk mendiskusikan beban yang sedang kamu pikul.',
      },
      {
        min: q3 + 1,
        max: maxScore,
        label: 'Sangat Tinggi / Butuh Dukungan',
        level: 'high',
        headline: 'Kamu sedang mengalami tekanan emosional yang signifikan.',
        description: 'Tubuh dan pikiranmu mengirimkan sinyal darurat bahwa energimu telah terkuras habis.',
        symptomsList: ['Merasa buntu dan kewalahan hebat', 'Kelelahan fisik dan emosi intens', 'Menarik diri dari pertemanan'],
        recommendations: ['Jangan ragu meminta bantuan profesional', 'Prioritaskan pemulihan diri di atas hal lain'],
        referralAction: 'Segera jadwalkan sesi konseling gratis bersama konselor mahasiswa melalui Google Form.',
      },
    ];

    const newTest: PsychologicalTest = {
      id: `asesmen-${Date.now()}`,
      title: title.trim(),
      shortTitle: shortTitle.trim() || title.trim().split(' ').slice(0, 3).join(' '),
      badge: badge.trim() || 'Adaptasi Skala Psikologi',
      description: description.trim() || 'Alat bantu refleksi mandiri mahasiswa yang diproses secara privat di peramban.',
      clinicalReference: clinicalReference.trim() || 'Standar Refleksi Mandiri Kampus',
      estimatedMinutes: Number(estimatedMinutes) || 3,
      totalQuestions: parsedQuestions.length,
      questions: parsedQuestions,
      scoreBands,
    };

    const updated = [newTest, ...assessments];
    onSaveAssessments(updated);
    showToast(`Asesmen "${newTest.title}" dengan ${parsedQuestions.length} pertanyaan berhasil disimpan!`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F3456] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-sky-400/50 flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Kelola Asesmen & Tes Psikologi Mahasiswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Buat instrumen tes psikologi baru secara otomatis cukup dengan mengunggah file Excel (.xlsx / .csv).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Asesmen Baru (Excel)</span>
        </button>
      </div>

      {/* Info Card for Non-IT Staff */}
      <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#0369A1]">
        <div className="flex items-start gap-2.5">
          <FileSpreadsheet className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-slate-900">Kemudahan Input Data Excel:</strong>
            Staf tidak perlu mengetik soal satu per satu. Cukup siapkan daftar pertanyaan di Microsoft Excel, unggah filenya, dan sistem akan mengonversinya menjadi tes interaktif di website.
          </div>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-sky-100/60 border border-sky-300 text-xs font-semibold text-[#0284C7] transition-colors cursor-pointer shrink-0 self-start sm:self-center"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Format Template Excel</span>
        </button>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200">
                  {test.badge}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {test.totalQuestions} Soal
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {test.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>~{test.estimatedMinutes} Menit</span>
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  {test.clinicalReference}
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" />
                <span>Aktif di Portal</span>
              </span>

              <button
                onClick={() => handlePromptDelete(test)}
                title="Hapus Asesmen"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Assessment Modal with Excel Upload */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 relative my-auto max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Tambah Asesmen Baru via Excel
                </h3>
                <p className="text-xs text-slate-500">
                  Isi data nama asesmen dan unggah lembar pertanyaan dari file Excel.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAssessment} className="space-y-4">
              
              {/* Judul Asesmen */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Judul Asesmen <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Skrining Adaptasi Sosial Mahasiswa Baru"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all text-slate-900 shadow-2xs font-semibold"
                />
              </div>

              {/* Badge & Minutes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Badge Keterangan
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Contoh: Adaptasi SAS-10"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Estimasi Pengerjaan (Menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              {/* Deskripsi Singkat */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Deskripsi Asesmen
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan tujuan skrining ini bagi mahasiswa..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0EA5E9] transition-all text-slate-900 shadow-2xs resize-none"
                />
              </div>

              {/* EXCEL UPLOAD AREA (CRITICAL) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Unggah Berkas Pertanyaan (Excel .xlsx / .csv) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="text-[11px] text-[#0EA5E9] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Template Excel</span>
                  </button>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#0EA5E9] bg-sky-50/70 scale-101'
                      : parsedQuestions.length > 0
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-[#0EA5E9] hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {parsedQuestions.length > 0 ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {excelFileName}
                        </p>
                        <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                          ✓ Berhasil memuat {parsedQuestions.length} butir pertanyaan dari file Excel!
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Klik area ini jika ingin mengganti file dengan file lain.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-sky-50 text-[#0284C7] mx-auto flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          Tarik & lepas file Excel di sini, atau <span className="text-[#0EA5E9] underline">pilih dari komputer</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Mendukung format .xlsx dan .csv (kolom: Pertanyaan, Opsi_A, Nilai_A, dll.)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {excelError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{excelError}</span>
                  </div>
                )}
              </div>

              {/* Live Preview List of First 3 Questions */}
              {parsedQuestions.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
                  <span className="font-bold text-slate-700 block">
                    Pratinjau Soal yang Berhasil Dibaca:
                  </span>
                  <ul className="space-y-1.5 text-slate-600">
                    {parsedQuestions.slice(0, 3).map((q) => (
                      <li key={q.id} className="flex items-start gap-1.5">
                        <span className="font-mono text-slate-400 font-bold">{q.id}.</span>
                        <span className="truncate">{q.prompt} ({q.options.length} opsi nilai)</span>
                      </li>
                    ))}
                    {parsedQuestions.length > 3 && (
                      <li className="text-[11px] text-slate-400 italic">
                        ... dan {parsedQuestions.length - 3} pertanyaan lainnya.
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={parsedQuestions.length === 0}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-40 disabled:pointer-events-none shadow-sm transition-all cursor-pointer"
                >
                  Simpan & Rilis Asesmen
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Custom Web In-App Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingAssessment)}
        title="Konfirmasi Hapus Asesmen"
        message="Apakah kamu yakin ingin menghapus konten ini dari publikasi portal mahasiswa?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingAssessment(null)}
      />

    </div>
  );
};

