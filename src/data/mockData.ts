import { PsychologicalTest, CounselingService, Article, Psychologist, FaqItem, MoodCheck } from '../types';

export const DEFAULT_GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1TL92gXenIiGsvvb6LE3p3pYMWhQ57fdQl2Tw8B8DGEc/edit";
export const ADMIN_WHATSAPP_NUMBER = "6285158804981";
export const ADMIN_WHATSAPP_DISPLAY = "+62 851-5880-4981";
export const CLINIC_EMAIL = "kemahasiswaan@pelitabangsa.ac.id";
export const CLINIC_ADDRESS = "Direktorat Kemahasiswaan dan Alumni, Lt. 2, Gedung B Universitas Pelita Bangsa";

export const DEDICATED_COUNSELOR: Psychologist = {
  id: 'konselor-mahasiswa',
  name: 'Konselor Mahasiswa',
  title: 'Konselor Mahasiswa',
  sipp: 'Kerahasiaan Terjamin 100%',
  himpsiNumber: 'Layanan Konseling Mahasiswa',
  experienceYears: 6,
  bio: 'Konselor profesional yang berdedikasi penuh mendampingi mahasiswa dan sivitas akademika dalam mengurai kecemasan masa depan, dinamika skripsi dan beban akademik, krisis relasi, serta pemulihan dari burnout emosional. Berkomitmen menghadirkan ruang yang aman, hangat, tanpa stigma, dan 100% terjaga kerahasiaannya bagi setiap mahasiswa.',
  specializations: [
    'Stres Akademik, Tesis & Skripsi',
    'Generalized Anxiety & Overthinking',
    'Quarter-Life Crisis & Masa Depan',
    'Regulasi Emosi & Self-Compassion',
    'Penyesuaian Diri Mahasiswa Rantau',
    'Impostor Syndrome di Lingkungan Kampus',
  ],
  therapeuticApproach: [
    'Cognitive Behavioral Therapy (CBT)',
    'Acceptance and Commitment Therapy (ACT)',
    'Person-Centered Therapy',
    'Mindfulness-Based Stress Reduction',
  ],
  schedule: 'Sesuai Konfirmasi Pendaftaran',
  consultationTypes: ['Daring (Google Meet)', 'Tatap Muka di Ruang Konseling Kampus'],
};

export const PSYCHOLOGISTS: Psychologist[] = [DEDICATED_COUNSELOR];

export const MOOD_OPTIONS: MoodCheck[] = [
  {
    id: 'overwhelmed',
    label: 'Kewalahan Tugas',
    emoji: '🌊',
    reflection: 'Tugas menumpuk, deadline berdekatan, atau revisi yang tak kunjung selesai memang menguras tenaga. Tarik napas, kamu tidak perlu menyelesaikan semuanya malam ini.',
    suggestedAction: 'Coba tes tingkat stres atau ambil jeda sejenak sebelum melanjutkan.',
  },
  {
    id: 'anxious',
    label: 'Cemas Masa Depan',
    emoji: '⚡',
    reflection: 'Kekhawatiran tentang karir, skripsi, atau ekspektasi keluarga sedang berputar di kepalamu. Ketakutanmu valid, mari kita urai perlahan.',
    suggestedAction: 'Coba tes kecemasan singkat untuk memahami apa yang sedang tubuhmu rasakan.',
  },
  {
    id: 'exhausted',
    label: 'Burnout Akademik',
    emoji: '🍃',
    reflection: 'Kamu merasa kehilangan motivasi dan lelah mental berkepanjangan. Ini bukan kemalasan; energimu memang butuh ruang pemulihan.',
    suggestedAction: 'Jadwalkan sesi konseling gratis bersama konselor untuk merestart energimu.',
  },
  {
    id: 'sad',
    label: 'Hampa / Kesepian',
    emoji: '🌧️',
    reflection: 'Menjadi mahasiswa rantau atau merasa terasing di tengah keramaian kampus bukanlah hal yang aneh. Kamu berhak didengarkan.',
    suggestedAction: 'Konselor kami siap hadir mendengarkan ceritamu tanpa menghakimi.',
  },
  {
    id: 'neutral',
    label: 'Cukup Tenang',
    emoji: '🌱',
    reflection: 'Senang mendengar harimu berjalan stabil. Terus rawat kesehatan mentalmu di tengah padatnya jadwal kuliah.',
    suggestedAction: 'Jelajahi tips self-compassion dan batasan diri di artikel kami.',
  },
];

export const PSYCHOLOGICAL_TESTS: PsychologicalTest[] = [
  {
    id: 'skrining-stres',
    title: 'Skrining Tingkat Stres Akademik & Harian',
    shortTitle: 'Cek Tingkat Stres',
    badge: 'Adaptasi PSS-10',
    description: 'Kenali seberapa besar beban kuliah, tugas, dan tekanan hidup yang kamu rasakan dalam 1 bulan terakhir.',
    clinicalReference: 'Diadaptasi dari Perceived Stress Scale (Cohen et al.) untuk kebutuhan skrining awal mahasiswa.',
    estimatedMinutes: 3,
    totalQuestions: 7,
    questions: [
      {
        id: 1,
        prompt: 'Dalam 1 bulan terakhir, seberapa sering kamu merasa kesal karena hal-hal tak terduga dalam perkuliahan atau tugas kelompok di luar kendalimu?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Jarang (1-2 kali)', score: 1 },
          { label: 'Cukup Sering (beberapa kali seminggu)', score: 2 },
          { label: 'Hampir Setiap Hari', score: 3 },
        ],
      },
      {
        id: 2,
        prompt: 'Seberapa sering kamu merasa tidak mampu mengendalikan hal-hal penting seperti deadline, skripsi, atau urusan pribadimu?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Jarang', score: 1 },
          { label: 'Cukup Sering', score: 2 },
          { label: 'Sangat Sering / Terus-menerus', score: 3 },
        ],
      },
      {
        id: 3,
        prompt: 'Seberapa sering kamu merasa gugup, tegang, atau seperti ada beban berat di dada/pundak saat menghadapi ujian atau presentasi?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Hanya sesekali', score: 1 },
          { label: 'Beberapa hari dalam seminggu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
      {
        id: 4,
        prompt: 'Seberapa sering kamu merasa kewalahan dengan tuntutan akademik hingga merasa ingin menghilang atau kabur sejenak?',
        options: [
          { label: 'Tidak Pernah, merasa bisa mengatasinya', score: 0 },
          { label: 'Kadang-kadang merasa repot', score: 1 },
          { label: 'Sering kewalahan menyelesaikannya', score: 2 },
          { label: 'Sangat sering dan merasa buntu', score: 3 },
        ],
      },
      {
        id: 5,
        prompt: 'Seberapa sering kamu merasa masalah-masalah hidupmu menumpuk begitu tinggi hingga kamu merasa tidak sanggup melewatinya?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Jarang terpikirkan', score: 1 },
          { label: 'Sering merasa terjebak', score: 2 },
          { label: 'Terus-menerus merasa buntu', score: 3 },
        ],
      },
      {
        id: 6,
        prompt: 'Seberapa sering kualitas tidurmu terganggu karena memikirkan tugas kuliah atau hal-hal yang belum terselesaikan?',
        options: [
          { label: 'Tidur nyenyak dan teratur', score: 0 },
          { label: 'Terganggu 1-2 malam saja', score: 1 },
          { label: 'Terganggu 3-4 malam dalam seminggu', score: 2 },
          { label: 'Hampir setiap malam mengalami insomnia/gelisah', score: 3 },
        ],
      },
      {
        id: 7,
        prompt: 'Seberapa sering kamu merasa mudah tersinggung pada teman, merasa sensitif, atau sengaja mengisolasi diri dari lingkungan pertemanan?',
        options: [
          { label: 'Emosi stabil dan nyaman berinteraksi', score: 0 },
          { label: 'Hanya sesekali jika sedang capek', score: 1 },
          { label: 'Sering merasa sensitif dan lelah berinteraksi', score: 2 },
          { label: 'Sangat sering meledak atau sengaja mengisolasi diri', score: 3 },
        ],
      },
    ],
    scoreBands: [
      {
        min: 0,
        max: 5,
        label: 'Tingkat Stres Terkendali (Rendah)',
        level: 'low',
        headline: 'Kapasitas adaptasi dan regulasi emosimu dalam perkuliahan berjalan dengan baik.',
        description: 'Beban studi dan aktivitasmu saat ini masih berada dalam batas yang seimbang. Kamu memiliki kemampuan yang sehat untuk membagi waktu.',
        symptomsList: [
          'Dapat berkonsentrasi menyelesaikan tugas dengan relatif tenang',
          'Pola tidur dan istirahat cenderung teratur',
          'Mampu meluangkan waktu bersosialisasi tanpa rasa cemas berlebih',
        ],
        recommendations: [
          'Pertahankan ritme belajar yang fleksibel dan jangan lupa meluangkan waktu untuk hobi.',
          'Lakukan journaling atau refleksi mingguan untuk merawat kesadaran diri.',
          'Jaga komunikasi yang sehat dengan teman sebaya sebagai support system.',
        ],
        referralAction: 'Ingin berdiskusi mengenai peningkatan fokus belajar atau persiapan karir pasca-kampus? Konselor kami siap berdiskusi santai bersamamu.',
      },
      {
        min: 6,
        max: 11,
        label: 'Tingkat Stres Ringan hingga Sedang',
        level: 'moderate',
        headline: 'Tubuh dan pikiranmu mulai memberi sinyal butuh jeda di tengah kesibukan kuliah.',
        description: 'Tuntutan akademik akhir-akhir ini mulai menyita energimu. Ada kalanya kamu merasa cemas atau terburu-buru, meski masih bisa beraktivitas.',
        symptomsList: [
          'Sering merasa terburu-buru dan sulit rileks seutuhnya setelah jam kuliah',
          'Otot pundak atau leher terasa tegang setelah berjam-jam di depan laptop',
          'Mulai merasa lelah mental di akhir pekan',
        ],
        recommendations: [
          'Terapkan teknik Pomodoro (25 menit fokus, 5 menit rehat penuh tanpa gawai).',
          'Prioritaskan 1-2 tugas terpenting per hari, jangan menuntut kesempurnaan instan.',
          'Latih teknik pernapasan lambat saat overthinking mulai datang.',
        ],
        referralAction: 'Membicarakan beban perkuliahan lebih awal sangat membantu sebelum stres bertambah berat. Daftarkan sesi konseling mahasiswa 100% gratis bersama konselor.',
      },
      {
        min: 12,
        max: 16,
        label: 'Tingkat Stres Cukup Tinggi (Perlu Perhatian)',
        level: 'elevated',
        headline: 'Kapasitas energimu terkuras signifikan; kamu membutuhkan ruang aman untuk bercerita.',
        description: 'Beban akademik atau masalah personalmu sudah melampaui batas kenyamanan adaptasimu. Hal ini berpotensi mengganggu motivasi kuliah dan kesehatan fisik.',
        symptomsList: [
          'Pikiran terasa penuh sesak (brain fog) dan sulit konsentrasi belajar',
          'Kerap terbangun di malam hari memikirkan skripsi/tugas dengan dada berdebar',
          'Muncul dorongan kuat untuk menunda tugas (prokrastinasi) karena terlalu kewalahan',
        ],
        recommendations: [
          'Berhentilah menuntut kesempurnaan pada dirimu sendiri.',
          'Bicarakan secara jujur apa yang kamu rasakan kepada konselor kampus.',
          'Manfaatkan fasilitas konseling mahasiswa bebas biaya yang tersedia untukmu.',
        ],
        referralAction: 'Sangat disarankan untuk menjadwalkan sesi konseling gratis bersama konselor via Google Form.',
      },
      {
        min: 17,
        max: 21,
        label: 'Tingkat Stres Sangat Tinggi (Prioritas Pemulihan)',
        level: 'high',
        headline: 'Kondisi emosionalmu berada pada fase darurat kelelahan batin (exhaustion phase).',
        description: 'Kamu sedang menanggung beban yang amat berat dan mungkin merasa sendirian atau buntu. Harap diingat: kamu tidak harus memikul semua ini sendirian, dan mencari bantuan adalah tanda kepedulian pada diri sendiri.',
        symptomsList: [
          'Kelelahan ekstrem yang tidak hilang meski sudah tidur seharian',
          'Perasaan hampa, putus asa, atau kehilangan kendali atas diri',
          'Dampak fisik nyata: sakit kepala menahun, lambung perih, atau dada sesak',
        ],
        recommendations: [
          'Ambil jeda darurat: istirahatkan pikiranmu dari tuntutan akademik sejenak.',
          'Prioritaskan kenyamanan diri dan ceritakan kondisimu kepada konselor.',
          'Segera daftarkan diri untuk konseling gratis atau hubungi hotline bila merasa tidak aman.',
        ],
        referralAction: 'Kondisi ini membutuhkan pendampingan profesional yang terarah. Daftarkan sesi konseling mahasiswa prioritas (100% Gratis) via Google Form sekarang.',
      },
    ],
  },
  {
    id: 'skrining-kecemasan',
    title: 'Skrining Gejala Kecemasan (Anxiety Mahasiswa)',
    shortTitle: 'Cek Kecemasan',
    badge: 'Adaptasi GAD-7',
    description: 'Ukur seberapa sering kamu terganggu oleh rasa cemas berlebih, takut gagal, atau kegelisahan dalam 2 minggu terakhir.',
    clinicalReference: 'Diadaptasi dari Generalized Anxiety Disorder 7-item scale untuk skrining mandiri mahasiswa.',
    estimatedMinutes: 3,
    totalQuestions: 7,
    questions: [
      {
        id: 1,
        prompt: 'Merasa gugup, cemas, atau gelisah saat memikirkan masa depan atau perkuliahan?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Beberapa hari', score: 1 },
          { label: 'Lebih dari separuh waktu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
      {
        id: 2,
        prompt: 'Tidak mampu menghentikan atau mengendalikan rasa khawatir yang terus berputar di kepala?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Beberapa hari', score: 1 },
          { label: 'Lebih dari separuh waktu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
      {
        id: 3,
        prompt: 'Terlalu mengkhawatirkan skenario terburuk (misal: tidak lulus tepat waktu, gagal ujian, mengecewakan orang tua)?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Beberapa hari', score: 1 },
          { label: 'Lebih dari separuh waktu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
      {
        id: 4,
        prompt: 'Kesulitan untuk bersantai atau duduk diam dengan tenang tanpa merasa bersalah?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Beberapa hari', score: 1 },
          { label: 'Lebih dari separuh waktu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
      {
        id: 5,
        prompt: 'Sangat gelisah sampai-sampai sulit untuk fokus belajar atau duduk tenang?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Beberapa hari', score: 1 },
          { label: 'Lebih dari separuh waktu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
      {
        id: 6,
        prompt: 'Menjadi mudah jengkel, sensitif, atau lekas marah pada rekan satu tim/teman kampus?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Beberapa hari', score: 1 },
          { label: 'Lebih dari separuh waktu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
      {
        id: 7,
        prompt: 'Merasa takut seolah-olah sesuatu yang buruk akan segera terjadi pada dirimu?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Beberapa hari', score: 1 },
          { label: 'Lebih dari separuh waktu', score: 2 },
          { label: 'Hampir setiap hari', score: 3 },
        ],
      },
    ],
    scoreBands: [
      {
        min: 0,
        max: 4,
        label: 'Kecemasan Minimal / Rendah',
        level: 'low',
        headline: 'Tingkat kekhawatiranmu masih dalam batas normal dan fungsional.',
        description: 'Setiap mahasiswa merasakan cemas saat ujian; kamu saat ini mampu meregulasi rasa cemas tersebut dengan baik.',
        symptomsList: ['Pikiran tetap fokus pada target studi', 'Dapat menenangkan diri saat gugup'],
        recommendations: ['Teruskan rutinitas sehat dan sediakan waktu jeda di antara jadwal kuliah.'],
        referralAction: 'Ingin berdiskusi tentang pengembangan potensi diri atau tips public speaking? Konselor kami siap menemanimu.',
      },
      {
        min: 5,
        max: 9,
        label: 'Kecemasan Ringan',
        level: 'moderate',
        headline: 'Mulai muncul overthinking yang menyita energi belajarmu.',
        description: 'Ada kekhawatiran yang berputar di kepala, terutama menjelang tugas besar atau ujian.',
        symptomsList: ['Terkadang overthinking sebelum tidur', 'Sedikit tegang saat menghadapi target baru'],
        recommendations: ['Gunakan teknik grounding 5-4-3-2-1 dan batasi konsumsi kafein berlebih.'],
        referralAction: 'Konseling 1-on-1 bersama konselor dapat membantumu menata ulang pola pikir cemas sejak awal.',
      },
      {
        min: 10,
        max: 14,
        label: 'Kecemasan Sedang',
        level: 'elevated',
        headline: 'Kecemasanmu sudah cukup mengganggu konsentrasi belajar dan tidur.',
        description: 'Respon fisik seperti jantung berdebar atau perut tidak nyaman sering muncul saat memikirkan kampus.',
        symptomsList: ['Jantung berdebar saat membuka tugas/pesan grup', 'Sulit mengalihkan pikiran dari skenario buruk'],
        recommendations: ['Kurangi media sosial yang memicu perbandingan diri, dan segera konsultasikan dengan konselor.'],
        referralAction: 'Yuk manfaatkan layanan konseling gratis mahasiswa bersama konselor via Google Form.',
      },
      {
        min: 15,
        max: 21,
        label: 'Kecemasan Tinggi',
        level: 'high',
        headline: 'Kecemasan intens yang membutuhkan ruang aman dan pendampingan profesional.',
        description: 'Tubuh dan pikiranmu berada dalam kondisi stres berkepanjangan. Kamu berhak mendapatkan bantuan hangat.',
        symptomsList: ['Serangan panik atau ketakutan melumpuhkan', 'Sulit tidur berhari-hari', 'Menghindari perkuliahan'],
        recommendations: ['Segera jadwalkan konseling tatap muka atau daring bersama konselor mahasiswa.'],
        referralAction: 'Segera lakukan pendaftaran sesi konseling prioritas (100% Free) melalui Google Form.',
      },
    ],
  },
  {
    id: 'skrining-burnout',
    title: 'Skrining Burnout Akademik & Skripsi',
    shortTitle: 'Cek Burnout Kuliah',
    badge: 'Burnout Mahasiswa',
    description: 'Evaluasi apakah kelelahan yang kamu rasakan adalah lelah biasa atau kejenuhan akademik (burnout) yang mendalam.',
    clinicalReference: 'Diadaptasi dari Maslach Burnout Inventory dimensi Academic Exhaustion & Cynicism.',
    estimatedMinutes: 3,
    totalQuestions: 7,
    questions: [
      {
        id: 1,
        prompt: 'Merasa kehabisan energi begitu bangun pagi saat memikirkan perkuliahan, revisi, atau skripsi?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Jarang (1-2 hari per bulan)', score: 1 },
          { label: 'Cukup sering (beberapa hari seminggu)', score: 2 },
          { label: 'Setiap hari merasa demikian', score: 3 },
        ],
      },
      {
        id: 2,
        prompt: 'Merasa apatis, sinis, atau tidak lagi peduli pada mata kuliah atau skripsimu?',
        options: [
          { label: 'Tidak Pernah, masih antusias', score: 0 },
          { label: 'Hanya sesekali jika sangat jenuh', score: 1 },
          { label: 'Sering merasa "terserah apa yang terjadi"', score: 2 },
          { label: 'Benar-benar kehilangan makna dan peduli', score: 3 },
        ],
      },
      {
        id: 3,
        prompt: 'Merasa apapun tugas yang kamu kerjakan terasa sia-sia dan merasa tidak kompeten dibanding teman lain?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Jarang', score: 1 },
          { label: 'Sering merasa tidak kompeten', score: 2 },
          { label: 'Hampir selalu merasa gagal/impostor', score: 3 },
        ],
      },
      {
        id: 4,
        prompt: 'Mengalami lelah fisik menahun yang tidak kunjung hilang meski sudah tidur seharian?',
        options: [
          { label: 'Tidak Pernah, tidur cukup menyegarkan tubuh', score: 0 },
          { label: 'Kadang-kadang merasa lesu', score: 1 },
          { label: 'Sering lemas dan tidak bertenaga', score: 2 },
          { label: 'Kelelahan kronis setiap hari', score: 3 },
        ],
      },
      {
        id: 5,
        prompt: 'Menjadi mudah frustrasi atau merasa muak ketika harus berdiskusi tugas kelompok dengan rekan kampus?',
        options: [
          { label: 'Tidak Pernah, relasi tetap hangat', score: 0 },
          { label: 'Kadang ingin menyendiri', score: 1 },
          { label: 'Sering merasa kesal dan lelah bersosialisasi', score: 2 },
          { label: 'Sangat enggan dan selalu menghindar', score: 3 },
        ],
      },
      {
        id: 6,
        prompt: 'Menggunakan mekanisme koping melarikan diri (rebahan berjam-jam scrolling gawai tanpa arah untuk kabur dari tugas)?',
        options: [
          { label: 'Tidak Pernah', score: 0 },
          { label: 'Sesekali untuk hiburan santai', score: 1 },
          { label: 'Sering sebagai pelarian utama dari stres tugas', score: 2 },
          { label: 'Terus-menerus dan mulai merasa bersalah melumpuhkan', score: 3 },
        ],
      },
      {
        id: 7,
        prompt: 'Merasa batas antara waktu istirahat dan belajar sudah kabur, membuat pikiran tidak pernah benar-benar tenang?',
        options: [
          { label: 'Bisa menetapkan batas waktu dengan jelas', score: 0 },
          { label: 'Kadang-kadang memikirkan tugas di malam hari', score: 1 },
          { label: 'Sering dihantui rasa bersalah jika tidak belajar', score: 2 },
          { label: 'Tidak pernah bisa tenang, merasa bersalah 24/7', score: 3 },
        ],
      },
    ],
    scoreBands: [
      {
        min: 0,
        max: 5,
        label: 'Energi Terjaga (Bebas Burnout)',
        level: 'low',
        headline: 'Hubunganmu dengan aktivitas perkuliahan masih sehat dan seimbang.',
        description: 'Kamu memiliki batasan waktu yang baik dan mampu menikmati waktu pemulihan energi setelah kuliah.',
        symptomsList: ['Memiliki motivasi belajar yang wajar', 'Mampu menikmati hobi di luar kuliah'],
        recommendations: ['Pertahankan ritme belajar santai dan tetap luangkan waktu untuk diri sendiri.'],
        referralAction: 'Ingin berdiskusi seputar rencana karir atau skripsi ke depan? Konselor kami siap menyambutmu.',
      },
      {
        min: 6,
        max: 11,
        label: 'Tanda Awal Kelelahan Akademik',
        level: 'moderate',
        headline: 'Tanda-tanda kelelahan mulai muncul dan butuh penyesuaian ritme studi.',
        description: 'Kamu mulai kehilangan antusiasme dan merasa lelah lebih cepat. Ini saat yang tepat untuk mengatur ulang jadwalku.',
        symptomsList: ['Lebih cepat lelah saat sore hari', 'Mulai menunda-nunda tugas karena enggan'],
        recommendations: ['Terapkan batasan jam belajar malam tanpa kompromi.', 'Ambil satu hari akhir pekan penuh tanpa memikirkan tugas.'],
        referralAction: 'Konseling bersama konselor dapat membantumu menyusun strategi belajar yang manusiawi dan mengenali perfeksionisme berlebih.',
      },
      {
        min: 12,
        max: 16,
        label: 'Burnout Akademik Sedang',
        level: 'elevated',
        headline: 'Kamu mengalami kejenuhan emosional nyata yang tidak selesai hanya dengan tidur.',
        description: 'Rasa apatis dan bersalah mulai mempengaruhi pandanganmu terhadap masa depan kuliahmu. Kamu butuh teman bicara ahli.',
        symptomsList: ['Apatis terhadap nilai/tugas', 'Rasa bersalah terus-menerus', 'Sering pusing atau sakit fisik ringan'],
        recommendations: ['Bicarakan beban skripsi/tugasmu pada konselor untuk mengurai benang kusut ini.'],
        referralAction: 'Daftar konseling gratis sekarang via Google Form agar konselor dapat membantumu mengurai beban dan merajut kembali rasa berdaya.',
      },
      {
        min: 17,
        max: 21,
        label: 'Burnout Akademik Kronis',
        level: 'high',
        headline: 'Kondisi kehabisan energi total (depletion) yang berisiko pada kesehatan mental.',
        description: 'Sistem tubuh dan pikiranmu sedang meminta jeda penuh. Ini bukan kemalasan; energimu berada di titik kritis.',
        symptomsList: ['Kehilangan motivasi dan minat sama sekali', 'Kelelahan psikologis ekstrem', 'Mengurung diri dari teman'],
        recommendations: ['Konsultasikan dengan konselor mahasiswa untuk penanganan mendalam dan pemulihan sistematis.'],
        referralAction: 'Sangat disarankan segera mengambil sesi konseling. Konselor kami siap mendampingimu dengan penuh penerimaan dan 100% gratis.',
      },
    ],
  },
];

export const COUNSELING_SERVICES: CounselingService[] = [
  {
    id: 'akademik-skripsi',
    title: 'Konseling Stres Akademik & Skripsi / Tesis',
    subtitle: 'Ruang aman mengurai kebuntuan tugas akhir, prokrastinasi, dan burnout perkuliahan.',
    format: 'Daring & Tatap Muka',
    duration: '50 - 60 Menit per Sesi',
    description: 'Sesi one-on-one bersama konselor untuk membantu mahasiswa yang mengalami kebuntuan skripsi, ketakutan menghadapi dosen pembimbing, perfeksionisme beracun, maupun hilangnya motivasi belajar.',
    targetAudience: 'Mahasiswa tingkat akhir, mahasiswa baru yang kewalahan, mahasiswa pascasarjana.',
    outcomes: [
      'Membedah akar prokrastinasi dan rasa takut gagal dalam mengerjakan tugas akhir',
      'Penyusunan target mikro yang realistis tanpa rasa bersalah melumpuhkan',
      'Teknik regulasi stres saat menghadapi revisi dan bimbingan akademik',
      'Pemulihan motivasi dan rasa berdaya dalam menyelesaikan studi',
    ],
    priceInfo: '100% GRATIS / Free (Didanai penuh untuk mahasiswa aktif)',
    isPopular: true,
  },
  {
    id: 'kecemasan-karir',
    title: 'Konseling Regulasi Emosi & Quarter-Life Crisis',
    subtitle: 'Menata kecemasan masa depan, overthinking karir, dan ekspektasi lingkungan.',
    format: 'Daring & Tatap Muka',
    duration: '50 - 60 Menit per Sesi',
    description: 'Pendampingan psikologis untuk mahasiswa yang cemas memikirkan hidup pasca-lulus, merasa tertinggal dibanding teman seangkatan (impostor syndrome), atau mengalami overthinking berkepanjangan.',
    targetAudience: 'Mahasiswa semester menengah & akhir, fresh graduates, pengurus organisasi.',
    outcomes: [
      'Restrukturisasi kognitif (CBT) untuk meredam siklus overthinking malam hari',
      'Mengenali nilai hidup pribadi (core values) tanpa terjebak standar orang lain',
      'Pengelolaan rasa takut gagal dan eksplorasi minat karir yang autentik',
      'Latihan mindfulness dan penerimaan diri (self-compassion)',
    ],
    priceInfo: '100% GRATIS / Free (Cukup lampirkan KTM pada Google Form)',
    isPopular: true,
  },
  {
    id: 'relasi-adaptasi',
    title: 'Konseling Relasi, Keluarga & Penyesuaian Diri',
    subtitle: 'Menemani anak rantau, dinamika pertemanan kampus, dan konflik keluarga.',
    format: 'Daring & Tatap Muka',
    duration: '50 - 60 Menit per Sesi',
    description: 'Bimbingan suportif bagi mahasiswa yang mengalami kesepian/homesick, kesulitan beradaptasi dengan budaya kampus baru, konflik dalam relasi berpacaran, atau tekanan berat dari ekspektasi keluarga.',
    targetAudience: 'Mahasiswa rantau, mahasiswa baru, mahasiswa dengan konflik interpersonal.',
    outcomes: [
      'Menetapkan batasan sehat (boundaries) dengan keluarga dan teman sebaya',
      'Membangun rasa aman dan koneksi bermakna di lingkungan perantauan',
      'Resolusi konflik interpersonal dan pemulihan dari luka relasi',
      'Peningkatan rasa percaya diri dan keberanian mengekspresikan kebutuhan diri',
    ],
    priceInfo: '100% GRATIS / Free (Khusus mahasiswa)',
  },
  {
    id: 'daring-fleksibel',
    title: 'Konseling Daring Fleksibel via Google Meet',
    subtitle: 'Sesi konseling nyaman langsung dari kamar kos atau rumahmu.',
    format: 'Daring (Online)',
    duration: '50 - 60 Menit per Sesi',
    description: 'Bagi mahasiswa yang memiliki jadwal kuliah padat, sedang berada di luar kota, atau merasa lebih tenang dan privat bercerita dari kamar tidur sendiri melalui video call terenkripsi.',
    targetAudience: 'Seluruh mahasiswa yang membutuhkan fleksibilitas lokasi & waktu.',
    outcomes: [
      'Kenyamanan bercerita dari lingkungan yang paling membuatmu rileks',
      'Jadwal fleksibel tanpa perlu menghabiskan waktu di perjalanan',
      'Kerahasiaan audio visual terenkripsi end-to-end',
      'Latihan relaksasi dan rangkuman refleksi pasca-sesi',
    ],
    priceInfo: '100% GRATIS / Free (Pilih opsi Daring di Google Form)',
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'mengatasi-overthinking-malam-hari',
    title: 'Ketika Kepala Terlalu Bising: 5 Langkah Menghentikan Overthinking di Malam Hari',
    category: 'Regulasi Emosi',
    readTime: '4 menit baca',
    publishedDate: '18 Oktober 2026',
    excerpt: 'Mengapa otak mahasiswa sering memutar skenario terburuk tepat saat tubuh sudah kelelahan di kasur kos? Temukan strategi neuro-psikologis untuk menenangkannya.',
    intro: 'Pernahkah kamu merebahkan tubuh setelah seharian kuliah, mematikan lampu kamar kos, namun lima menit kemudian kepalamu justru dipenuhi kilas balik percakapan tadi siang, deadline skripsi, atau kecemasan masa depan? Fenomena ini dikenal sebagai nighttime rumination.',
    sections: [
      {
        heading: '1. Memahami Mengapa Otak Mengaktifkan Mode Waspada Saat Hening',
        text: 'Sepanjang siang hari, otak kita sibuk memproses stimulasi kuliah: obrolan teman, grup WhatsApp tugas, dan materi dosen. Saat malam tiba dan kamar sunyi, otak yang terbiasa aktif secara otomatis beralih ke Default Mode Network (DMN)—jaringan saraf yang memproses evaluasi diri dan kecemasan masa depan.',
        keyPoints: [
          'Kelelahan membuat korteks prefrontal (pusat logika) menurun fungsinya, sementara amigdala (pusat emosi) tetap menyala.',
          'Overthinking di malam hari bukanlah tanda kamu gagal, melainkan respon perlindungan otak yang kebingungan.',
        ],
      },
      {
        heading: '2. Lakukan "Brain Dump" di Kertas Fisik (Bukan di HP)',
        text: 'Saat kekhawatiran tersimpan di dalam pikiran, otak akan terus mengulangnya karena takut kamu melupakannya. Ketika kamu menuliskannya di atas kertas dengan bolpoin, kamu mengirim sinyal neurobiologis bahwa informasi tersebut telah terdokumentasi dengan aman.',
        keyPoints: [
          'Tulis 3 hal yang membuatmu cemas malam ini tanpa memikirkan tata bahasa yang rapi.',
          'Tuliskan satu tindakan mikro yang bisa kamu lakukan besok pukul 09.00 WIB untuk masing-masing hal tersebut.',
          'Tutup buku catatanmu dan katakan: "Ini sudah tersimpan, urusan besok dimulai besok."',
        ],
      },
      {
        heading: '3. Alihkan Sistem Saraf Melalui Sentuhan Suhu Dingin atau Pernapasan 4-7-8',
        text: 'Mencoba melawan pikiran cemas dengan pikiran logis saat tengah malam sering kali sia-sia karena hormon kortisol sedang meninggi. Jalan tercepat adalah memengaruhi pikiran melalui tubuh (bottom-up processing).',
        keyPoints: [
          'Tarik napas perlahan melalui hidung selama 4 detik.',
          'Tahan napas dengan lembut selama 7 detik.',
          'Hembuskan napas panjang melalui bibir berdesis selama 8 detik. Ulangi 4 kali siklus.',
        ],
      },
    ],
    conclusion: 'Ingatlah bahwa apa yang terasa begitu mengerikan pada pukul 02.00 dini hari sering kali terlihat jauh lebih sederhana dan dapat diselesaikan pada pukul 09.00 pagi setelah tubuhmu mendapatkan istirahat.',
    takeawayMessage: 'Jangan berdebat dengan pikiranmu saat mengantuk. Tuliskan di kertas, atur napas, dan izinkan dirimu tidur.',
    author: {
      name: 'Tim Konseling Mahasiswa DIRMAWA UPB',
      role: 'Layanan Konseling & Edukasi Psikologi',
      sipp: 'Sesuai Kode Etik HIMPSI',
    },
  },
  {
    id: 'bukan-malas-tapi-burnout',
    title: 'Bukan Malas, Bisa Jadi Kamu Mengalami Academic Burnout: Kenali Perbedaannya',
    category: 'Karir & Akademik',
    readTime: '5 menit baca',
    publishedDate: '12 Oktober 2026',
    excerpt: 'Rasa bersalah karena merasa "tidak produktif" di perkuliahan justru memperburuk kondisi batinmu. Pelajari perbedaan mendasar antara rasa malas dan kelelahan mental.',
    intro: 'Banyak mahasiswa datang ke ruang konseling dengan ungkapan yang seragam: "Saya merasa bersalah karena sekarang saya jadi pemalas, tidak punya motivasi, dan tugas skripsi saya terbengkalai." Namun setelah dieksplorasi, yang mereka alami sama sekali bukan kemalasan.',
    sections: [
      {
        heading: '1. Perbedaan Mendasar Malas vs Burnout Mahasiswa',
        text: 'Kemalasan biasanya muncul dari ketiadaan kemauan untuk memulai sesuatu, dan orang yang malas cenderung menikmati rasa santainya tanpa beban bersalah yang melumpuhkan. Sebaliknya, mahasiswa yang mengalami burnout memiliki keinginan kuat untuk menyelesaikan tugas, namun energi psikisnya berada pada posisi minus.',
        keyPoints: [
          'Mahasiswa malas: Merasa santai dan gembira saat tidak mengerjakan tugas.',
          'Mahasiswa burnout: Mengalami penderitaan batin, rasa bersalah intens, dan kelelahan fisik meski seharian hanya berbaring di kasur kos.',
        ],
      },
      {
        heading: '2. Mengapa Liburan Singkat Sering Gagal Mengatasi Burnout Skripsi?',
        text: 'Banyak mahasiswa mengira burnout bisa sembuh hanya dengan scrolling seharian atau nongkrong di kafe. Namun saat laptop dibuka kembali, rasa sesak itu hadir lagi. Mengapa? Karena burnout berakar dari ekspektasi berlebih, hilangnya rasa berdaya, dan isolasi sosial.',
      },
      {
        heading: '3. Langkah Pemulihan Berkelanjutan',
        text: 'Pemulihan dari burnout menuntut re-negosiasi batasan hidup. Kamu perlu belajar membagi tugas besar menjadi langkah-langkah mikro yang tidak menakutkan, memangkas perfeksionisme beracun, dan mengizinkan dirimu beristirahat tanpa rasa bersalah.',
      },
    ],
    conclusion: 'Kamu adalah manusia dengan batas toleransi biologis dan psikologis yang nyata, bukan mesin pencetak IPK atau skripsi instan. Beristirahat bukanlah hadiah yang harus kamu dapatkan setelah kelelahan, melainkan hak dasarmu untuk tetap sehat.',
    takeawayMessage: 'Menyerah sejenak bukan berarti gagal; itu adalah cara tubuhmu menuntut hak untuk pulih.',
    author: {
      name: 'Tim Konseling Mahasiswa DIRMAWA UPB',
      role: 'Layanan Konseling & Edukasi Psikologi',
      sipp: 'Sesuai Kode Etik HIMPSI',
    },
  },
  {
    id: 'seni-menetapkan-boundaries',
    title: 'Seni Menetapkan Batasan (Boundaries) di Kampus Tanpa Merasa Bersalah',
    category: 'Hubungan & Relasi',
    readTime: '4 menit baca',
    publishedDate: '05 Oktober 2026',
    excerpt: 'Menyenangkan semua orang di kepanitiaan atau pertemanan adalah jalan tercepat menuju kelelahan batin. Begini cara berkata "tidak" secara elegan.',
    intro: 'Apakah kamu sering mendapati dirimu mengiyakan titipan tugas kelompok, ajakan organisasi, atau permintaan teman padahal energimu sudah di ambang batas? Apakah kata "tidak" selalu diikuti oleh rasa bersalah seolah-olah kamu telah berbuat jahat?',
    sections: [
      {
        heading: '1. Mengapa Mahasiswa Takut Menolak?',
        text: 'Kecenderungan people-pleasing berakar dari kebutuhan kita untuk diterima di lingkungan sosial kampus (peer acceptance). Kita takut dicap tidak kompak, sombong, atau dikucilkan dari sirkel pertemanan.',
      },
      {
        heading: '2. Batasan Sehat Menyelamatkan Hubungan',
        text: 'Tanpa batasan yang jelas, relasi yang awalnya baik pun akan perlahan dipenuhi oleh rasa dendam terpendam (resentment). Ketika kamu terus berkata "ya" dalam keterpaksaan, kamu sedang menumpuk kekecewaan yang suatu hari akan meledak.',
        keyPoints: [
          'Batasan yang sehat memberi tahu orang lain kapasitas energimu tanpa harus merendahkan mereka.',
          'Orang yang marah saat kamu menetapkan batasan adalah orang yang selama ini paling diuntungkan dari ketiadaan batasanmu.',
        ],
      },
      {
        heading: '3. Skrip Kalimat Batasan untuk Teman Kampus',
        text: 'Gunakan kalimat yang fokus pada kapasitas dirimu sendiri tanpa defensif berlebihan.',
        keyPoints: [
          'Kepada rekan organisasi: "Terima kasih sudah mengajakku di kepanitiaan ini. Namun kapasitas jadwalku semester ini sedang penuh untuk fokus akademik, jadi aku belum bisa bergabung ya."',
          'Kepada teman: "Aku menghargai ajakanmu, tapi malam ini aku butuh istirahat di kos untuk memulihkan energiku ya."',
        ],
      },
    ],
    conclusion: 'Menjaga batasan pribadi bukan berarti kamu tidak peduli. Itu berarti kamu cukup peduli pada kesehatan jiwamu sendiri agar tetap memiliki energi murni untuk orang-orang tersayang.',
    takeawayMessage: 'Setiap kali kamu berkata "ya" pada hal yang ingin kamu tolak, kamu sedang berkata "tidak" pada ketenangan jiwamu sendiri.',
    author: {
      name: 'Tim Konseling Mahasiswa DIRMAWA UPB',
      role: 'Layanan Konseling & Edukasi Psikologi',
      sipp: 'Sesuai Kode Etik HIMPSI',
    },
  },
  {
    id: 'mengapa-menangis-itu-sehat',
    title: 'Mengapa Menangis Itu Sehat: Menghapus Mitos "Anak Kuliahan Harus Selalu Kuat"',
    category: 'Self-Compassion',
    readTime: '3 menit baca',
    publishedDate: '28 September 2026',
    excerpt: 'Air mata emosional mengandung hormon stres yang dikeluarkan oleh tubuh. Menangis bukanlah tanda kelemahan, melainkan proses detoksifikasi jiwa.',
    intro: 'Di tengah tuntutan kuliah yang serba cepat, banyak mahasiswa merasa harus selalu terlihat tangguh dan tidak boleh cengeng. Kita belajar menelan air mata, memaksakan senyum di kampus, dan menangis diam-diam saat pulang ke kos.',
    sections: [
      {
        heading: '1. Biokimia Air Mata Emosional',
        text: 'Penelitian biokimia membuktikan bahwa air mata emosional mengandung kadar hormon ACTH dan endorfin penenang alami tubuh. Ketika menangis, tubuh kita secara harfiah sedang membuang racun sisa stres biologis.',
      },
      {
        heading: '2. Mengaktifkan Sistem Relaksasi Tubuh',
        text: 'Setelah menangis tuntas, tubuh kita secara otomatis mengaktifkan sistem saraf parasimpatis—bagian sistem saraf yang menurunkan detak jantung, meredakan ketegangan otot leher, dan menghadirkan rasa plong.',
      },
    ],
    conclusion: 'Mengizinkan dirimu menangis saat kewalahan dengan tugas kuliah sama wajarnya dengan membiarkan tubuhmu berkeringat saat berolahraga. Berhentilah menuntut dirimu menjadi manusia tanpa emosi.',
    takeawayMessage: 'Air mata adalah cara jiwamu berbicara bahwa beban yang kamu pikul sudah terlalu berat untuk disimpan sendirian.',
    author: {
      name: 'Tim Konseling Mahasiswa DIRMAWA UPB',
      role: 'Layanan Konseling & Edukasi Psikologi',
      sipp: 'Sesuai Kode Etik HIMPSI',
    },
  },
  {
    id: 'panduan-konseling-pertama-kali',
    title: 'Panduan Konseling Mahasiswa Pertama Kali: Apa yang Terjadi di Ruang Sesi Konseling?',
    category: 'Panduan Konseling',
    readTime: '4 menit baca',
    publishedDate: '20 September 2026',
    excerpt: 'Merasa gugup sebelum konseling perdana adalah hal yang sangat wajar. Berikut gambaran transparan mengenai alur sesi agar kamu merasa lebih tenang.',
    intro: 'Mengisi form konseling untuk pertama kali butuh keberanian besar. Sangat lumrah jika kamu merasa cemas: "Bagaimana kalau saya bingung harus cerita apa? Apakah konselor akan menghakimi masalah saya?"',
    sections: [
      {
        heading: '1. Kerahasiaan Adalah Landasan Mutlak',
        text: 'Semua cerita, identitas, dan apa yang kamu sampaikan terikat penuh oleh Kode Etik Psikologi Indonesia (HIMPSI). Ceritamu tidak akan pernah dibagikan kepada dosen, fakultas, orang tua, maupun teman kampus.',
      },
      {
        heading: '2. Kamu Tidak Perlu Menyiapkan Presentasi Rapi',
        text: 'Tugasmu di ruang konseling bukanlah berpidato. Jika kamu merasa campur aduk dan hanya bisa menangis atau terdiam di awal sesi, itu sangat tidak apa-apa. Konselor akan mendampingimu perlahan dengan pertanyaan pemantik yang aman.',
      },
      {
        heading: '3. Alur 50-60 Menit Konseling Mahasiswa',
        text: 'Sesi biasanya dibagi menjadi: 10 menit perkenalan santai, 35-40 menit eksplorasi apa yang sedang memberatkanmu, dan 10-15 menit penarikan kesimpulan serta latihan koping ringan yang bisa kamu praktikkan di kos.',
      },
    ],
    conclusion: 'Konseling bukan tentang dinasihati atau disalahkan. Konseling adalah ruang aman di mana kamu didengarkan seutuhnya sebagai manusia yang sedang berjuang.',
    takeawayMessage: 'Kamu tidak perlu menunggu masalahmu "sangat parah" terlebih dahulu untuk boleh berkonsultasi dengan konselor.',
    author: {
      name: 'Tim Konseling Mahasiswa DIRMAWA UPB',
      role: 'Layanan Konseling & Edukasi Psikologi',
      sipp: 'Sesuai Kode Etik HIMPSI',
    },
  },
];

export const FAQS: FaqItem[] = [
  {
    category: 'Biaya',
    question: 'Apakah layanan konseling mahasiswa ini benar-benar 100% GRATIS (Free)?',
    answer: 'Ya, 100% GRATIS tanpa dipungut biaya apapun! Layanan konseling ini didanai dan disediakan secara khusus untuk kesejahteraan mental mahasiswa aktif. Tidak ada biaya tersembunyi. Kamu hanya perlu mencantumkan Nama, Program Studi, dan Nomor Induk Mahasiswa (NIM) pada formulir Google Form.',
  },
  {
    category: 'Sesi Konseling',
    question: 'Siapa yang akan mendampingi sesi konseling saya?',
    answer: 'Seluruh sesi konseling akan didampingi secara langsung oleh konselor profesional dengan keahlian khusus dalam mendampingi isu-isu mahasiswa, skripsi, kecemasan, dan adaptasi masa muda.',
  },
  {
    category: 'Kerahasiaan',
    question: 'Apakah cerita saya aman dari dosen, pihak fakultas, atau orang tua?',
    answer: 'Ya, dijamin 100% rahasia mutlak. Seluruh data dan isi percakapan dilindungi oleh Kode Etik Psikologi Indonesia (HIMPSI). Konselor tidak memiliki wewenang membocorkan ceritamu kepada pihak kampus, dosen pembimbing, maupun keluarga tanpa izin tertulis darimu, kecuali terdapat bahaya darurat fisik terhadap keselamatan jiwa.',
  },
  {
    category: 'Pendaftaran',
    question: 'Bagaimana alur pendaftarannya melalui Google Form?',
    answer: 'Sangat praktis! Cukup klik tombol "Daftar Konseling via Google Form", isi kontak WhatsApp aktif, Nomor Induk Mahasiswa (NIM), serta preferensi jadwal (daring Google Meet atau tatap muka di ruang konseling kampus). Admin kami akan menghubungi kamu via WhatsApp untuk mengonfirmasi jadwalmu.',
  },
  {
    category: 'Sesi Konseling',
    question: 'Saya bingung harus cerita apa saat pertama kali sesi, apakah tidak apa-apa?',
    answer: 'Sangat wajar dan tidak masalah sama sekali! Banyak mahasiswa yang baru pertama kali konseling merasa hal yang sama. Kamu tidak perlu mempersiapkan teks runut; konselor akan memandu jalannya sesi dengan tenang dan penuh penerimaan.',
  },
  {
    category: 'Pendaftaran',
    question: 'Apakah hasil tes psikologi di website ini tersimpan?',
    answer: 'Tidak. Seluruh tes psikologi mandiri di website ini dihitung langsung secara lokal di peramban (browser) gawai kamu. Tidak ada data jawaban yang tersimpan di server. Kamu bisa menyalin rangkuman hasil tes untuk ditempelkan di Google Form pendaftaran.',
  },
];

export const CRISIS_HOTLINES = [
  {
    name: 'Layanan Sejiwa (Kemenkes RI)',
    number: '119 ext. 8',
    hours: '24 Jam Setiap Hari',
    description: 'Hotline tanggap darurat psikologis resmi Kementerian Kesehatan Republik Indonesia.',
    isEmergency: true,
  },
  {
    name: 'Yayasan Pulih (Krisis Emosional & Trauma)',
    number: '+62 811-8436-633',
    hours: 'Senin - Jumat: 09.00 - 17.00 WIB',
    description: 'Layanan konseling krisis mahasiswa dan pemulihan psikologis.',
    isEmergency: false,
  },
  {
    name: 'Lisa Helpline (Mental Health & Suicide Prevention)',
    number: '0811-3855-472',
    hours: '24 Jam Bebas Pulsa',
    description: 'Dukungan emosional mahasiswa dan pencegahan bunuh diri non-judgmental.',
    isEmergency: true,
  },
];
