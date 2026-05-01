/**
 * One-off helper: merges translated landing subtree keys into fallback catalogs.
 * Run from repo root: node scripts/i18n-apply-landing-translations.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const fallbackDir = join(root, 'src/i18n/catalogs/fallback');

const locales = ['id', 'ms', 'vi', 'zh-CN'];

const translations = {
  id: {
    topology: {
      eyebrow: 'Topologi sistem',
      title: 'Satu alur dari sinyal mentah ke catatan yang dapat dipertahankan.',
      description:
        'Afenda tidak menyebar kebenaran di banyak alat. Masukan dinormalisasi, dievaluasi di inti resolusi, dan dikeluarkan sebagai status kanonik dengan visibilitas audit.',
      thesis:
        'Jika organisasi tidak dapat menggambar garis ini dalam satu diagram, ia tidak memiliki satu kebenaran operasional—hanya interpretasi yang diperselisihkan.',
      diagram: {
        label: 'Topologi kontrol',
        title: 'Normalisasi → resolusi → komit',
        state: 'Invariant arsitektur',
      },
      inputs: {
        title: 'Masukan operasional',
        items: {
          identity: {
            title: 'Sinyal identitas',
            body: 'Aktor, penyewa, dan konteks kepemilikan sebagai fakta tingkat pertama.',
          },
          skills: {
            title: 'Graf kemampuan',
            body: 'Keterampilan, kemahiran, dan struktur tenaga kerja sebagai atribut yang diatur.',
          },
          activity: {
            title: 'Telemetri eksekusi',
            body: 'Peristiwa alur kerja, dokumen, dan HRIS dengan sumber dan stempel waktu.',
          },
          knowledge: {
            title: 'Objek pengetahuan',
            body: 'Artefak dan catatan pembelajaran terikat pada cakupan dan kebijakan.',
          },
        },
      },
      connectors: { normalize: 'Normalisasi', resolve: 'Resolusi' },
      controls: {
        title: 'Inti resolusi',
        items: {
          identityBinding: {
            title: 'Pengikatan identitas',
            body: 'Setiap transisi terikat pada aktor dan penyewa sebelum kebijakan dijalankan.',
          },
          policyResolution: {
            title: 'Resolusi kebijakan',
            body: 'Otoritas, presedensi, dan aturan menentukan status yang boleh berubah.',
          },
          evidenceCommit: {
            title: 'Komit bukti',
            body: 'Bukti dilampirkan saat catatan ditulis—bukan dibuat ulang kemudian.',
          },
        },
      },
      outputs: {
        title: 'Kebenaran yang dikeluarkan',
        items: {
          record: {
            label: 'Catatan kanonik',
            value: 'Satu status terkomitmen yang dapat dioperasikan bisnis.',
          },
          visibility: {
            label: 'Visibilitas teratur',
            value: 'Tampilan per peran atas catatan yang sama di bawahnya.',
          },
          audit: {
            label: 'Jejak audit',
            value: 'Jalur terlacak dari sinyal ke status yang diterima.',
          },
        },
      },
      consequence: {
        label: 'Konsekuensi desain',
        title: 'Tanpa otoritas paralel.',
        body: 'Jika saluran dapat mengubah kebenaran bisnis tanpa melalui tulang punggung ini, Afenda sengaja tidak menganggapnya teratur.',
      },
    },
    integrationReality: {
      eyebrow: 'Realitas integrasi',
      title: 'Sistem eksternal menyumbang sinyal. Afenda mempertahankan otoritas.',
      description:
        'ERP, HRIS, identitas, dan kolaborasi tetap sebagai sumber—bukan buku besar kebenaran yang bersaing. Setiap jalur masuk melewati cakupan identitas, normalisasi, tata kelola, dan disiplin komit.',
      quote: 'Integrasi membuktikan apa yang melewati batas—bukan apa yang boleh dipercaya bisnis.',
      panel: {
        label: 'Permukaan kontrol integrasi',
        title: 'Dari sinyal eksternal ke catatan terbatas',
        state: 'Batas ditegakkan',
        traceLine: 'sinyal eksternal → batas terkontrol → catatan kanonik',
      },
      interfaces: {
        identity: {
          title: 'Bidang identitas',
          body: 'SSO, master SDM, kontraktor, dan principal federasi dipetakan ke identitas tenaga kerja per penyewa.',
        },
        systems: {
          title: 'Konektor sistem pencatat',
          body: 'Workday, SAP, BambooHR, ATS, LMS, tiket—dimasukkan sebagai sumber teratur berstempel waktu.',
        },
        knowledge: {
          title: 'Pengetahuan & dokumen',
          body: 'Objek Confluence, Notion, Drive terdaftar dengan kepemilikan, sensitivitas, dan tag kebijakan.',
        },
        governance: {
          title: 'Penegakan tata kelola',
          body: 'Paket aturan, rantai persetujuan, break-glass, dan deteksi drift sebelum status maju.',
        },
      },
      boundary: {
        index: '03 / Batas penegakan',
        title: 'Urutan tanpa jalan pintas',
        description: 'Setiap tahap wajib. Melewatkan tahap bukan opsi konfigurasi—itu kontrak integrasi yang gagal.',
        meta: 'urutan penegakan · tanpa bypass',
        steps: {
          connect: {
            label: 'Hubungkan',
            value: 'Konektor terautentikasi dengan rahasia least-privilege dan cakupan eksplisit.',
          },
          normalize: {
            label: 'Normalisasi',
            value: 'Pemetaan skema, deduplikasi, dan penanda konflik sebelum kebijakan.',
          },
          govern: {
            label: 'Tata kelola',
            value: 'Kebijakan, persetujuan, dan pengecualian dievaluasi dengan persyaratan bukti.',
          },
          commit: {
            label: 'Komit',
            value: 'Catatan kanonik ditulis dengan silsilah tak terubah.',
          },
        },
      },
      record: {
        label: 'Bukti integrasi',
        title: 'BOUNDARY-CLOSED',
        description:
          'Catatan ini menjamin aktivitas eksternal melewati seluruh rantai penegakan sebelum mengubah kebenaran perusahaan.',
        footer: 'Hash silsilah · jadwal rotasi · atestasi cakupan dalam berkas',
        tagline: 'sumber disimpan · batas ditegakkan · status diselesaikan',
        fields: {
          source: { term: 'Sistem sumber', value: 'Workday HCM (prod-west)' },
          contract: { term: 'Kontrak konektor', value: 'WD-HCM-2025.3 · ditandatangani' },
          boundary: { term: 'Pos pemeriksaan batas', value: 'Identitas ✓ · Kebijakan ✓ · Bukti ✓' },
          result: {
            term: 'Hasil terkomitmen',
            value: 'Catatan tenaga kerja kanonik diperbarui dengan bundel audit',
          },
        },
      },
      consequence: {
        label: 'Aturan operasi',
        title: 'Integrasi tidak mendapat pintu samping ke kebenaran.',
        body: 'Jika vendor atau alur bayangan tidak dapat menunjukkan bukti yang sama, itu bukan bagian model operasi teratur—terlepas dari kenyamanan UI.',
      },
    },
    resolutionStages: {
      input: {
        step: 'Masukan',
        title: 'Peristiwa masuk sebagai fakta yang membawa bukti.',
        description:
          'Dokumen, tindakan, integrasi, identitas, dan perubahan status ditangkap dengan konteks cukup untuk dinilai nanti.',
      },
      control: {
        step: 'Kontrol',
        title: 'Kebijakan menentukan otoritas dan presedensi.',
        description:
          'Sistem mengevaluasi cakupan penyewa, otoritas peran, keandalan sumber, dan ikatan aturan sebelum status boleh bergerak.',
      },
      truth: {
        step: 'Kebenaran',
        title: 'Catatan kanonik diselesaikan dan disimpan.',
        description:
          'Status yang dihasilkan dapat diperiksa, diaudit, dan digunakan di seluruh organisasi tanpa mengandalkan penjelasan manual.',
      },
    },
    commercial: {
      eyebrow: 'Postur komersial',
      title: 'Siap pengadaan tanpa teater pengadaan.',
      description:
        'Afenda menyelaraskan hukum, keamanan, dan implementasi pada fakta arsitektur yang sama: otoritas terbatas, bukti dipertahankan, dan satu postur catatan kanonik.',
      cta: { primary: 'Jadwalkan tinjauan eksekutif', secondary: 'Buka dossier sistem' },
      panel: {
        label: 'Dimensi tinjauan',
        title: 'Yang benar-benar diperiksa dalam due diligence',
        state: 'Materi selaras',
      },
      review: {
        governance: {
          title: 'Artefak tata kelola',
          body: 'Matriks kontrol, kerangka DPIA, model segregasi, peta retensi—diekspor dari konfigurasi aktif.',
        },
        implementation: {
          title: 'Buku panduan implementasi',
          body: 'Onboarding bertahap dengan rollback eksplisit, gerbang validasi, dan kriteria sukses terikat catatan kanonik.',
        },
        security: {
          title: 'Bukti keamanan',
          body: 'Rotasi rahasia, ikatan SSO, silsilah audit tak terubah, routing anomali terdokumentasi—bukan hanya klaim.',
        },
        commercial: {
          title: 'Struktur komersial',
          body: 'Kapasitas, tingkat dukungan, dan batas tanggung jawab terhadap kontrol fitur nyata—tanpa SKU rak.',
        },
      },
      process: {
        index: '04 / Ritme komersial',
        title: 'Dari percakapan pertama ke produksi teratur',
        description: 'Setiap langkah menghasilkan artefak bertanda tangan. Tidak ada yang mengandalkan narasi kosong.',
        steps: {
          scope: {
            label: 'Cakupan',
            value: 'Permukaan kebenaran dan kontrak integrasi terdaftar.',
          },
          validate: {
            label: 'Validasi',
            value: 'Penyewa pilot mematuhi tumpukan kebijakan penuh—tanpa jalan pintas demo.',
          },
          align: {
            label: 'Selaraskan',
            value: 'Hukum, TI, dan eksekutif menandatangani paket arsitektur yang identik.',
          },
          commit: {
            label: 'Komit',
            value: 'Rollout produksi dengan verifikasi bukti berkelanjutan.',
          },
        },
      },
      record: {
        label: 'Catatan due diligence',
        title: 'SIGN-OFF ACTIVE',
        description:
          'Panel ini melacak keselarasan kontrak antara kontrol yang dipasarkan dan konfigurasi yang di-deploy.',
        footer: 'Dossier terkunci versi · log perubahan di bawah akses korporat',
        fields: {
          model: {
            term: 'Model pengiriman',
            value: 'Bidang kontrol single-tenant · isolasi beban multi-tenant',
          },
          basis: {
            term: 'Dasar tanggung jawab',
            value: 'Peta jalan SOC2 Tipe II · lampiran uptime & residensi data',
          },
          review: { term: 'Paket tinjauan dewan', value: 'v2025-Q2 · diedarkan' },
          outcome: {
            term: 'Hasil saat ini',
            value: 'Menunggu kontra-tanda CIO · tanpa celah kontrol terbuka',
          },
        },
      },
      consequence: {
        label: 'Konsekuensi komersial',
        title: 'Kontrak mengutip arsitektur—bukan slide.',
        body: 'Saat sengketa atau audit, kedua pihak menelusuri kewajiban ke kontrol terdaftar dan catatan tak terubah—bukan klaim pemasaran yang ditafsir ulang.',
      },
    },
    evidence: {
      eyebrow: 'Arsitektur bukti',
      title: 'Kepercayaan adalah properti catatan—bukan dek presentasi.',
      description:
        'Afenda menjadikan bukti struktural: pengikatan identitas, evaluasi kebijakan, komit kanonik, dan visibilitas audit adalah tahap yang terlihat, bukan catatan tambahan.',
      quote: 'Jika tidak dapat dilacak, itu bukan bukti—itu opini.',
      panel: {
        label: 'Tumpukan bukti',
        title: 'Empat jaminan tak tereduksi sebelum kebenaran diakui',
        state: 'Semua tahap terpenuhi',
      },
      items: {
        identity: {
          title: 'Pengikatan identitas',
          body: 'Aktor, penyewa, sesi, stempel waktu, dan cakupan ditegaskan sebelum interpretasi.',
        },
        policy: {
          title: 'Gerbang kebijakan',
          body: 'Aturan, persetujuan, pengecualian, dan break-glass dievaluasi dengan alasan tercatat.',
        },
        record: {
          title: 'Komit kanonik',
          body: 'Transisi status menulis fakta tahan lama dengan versi dan hash silsilah.',
        },
        audit: {
          title: 'Permukaan audit',
          body: 'Inspektur melihat jalur dari peristiwa asal ke hasil yang dipertahankan—tanpa rekonstruksi offline.',
        },
      },
      auditPath: {
        index: '03 / Silsilah yang dapat diperiksa',
        title: 'Rantai minimum yang diminta regulator—terintegrasi',
        description:
          'Setiap lompatan diattestasi kriptografis atau operasional. Menghapus lompatan membatalkan catatan.',
        steps: {
          actor: {
            label: 'Atestasi aktor',
            value: 'Sesi ber-hardware + step-up untuk transisi sensitif',
          },
          tenant: {
            label: 'Isolasi penyewa',
            value: 'Keamanan tingkat baris + larangan panggilan lintas penyewa di tepi API',
          },
          policy: {
            label: 'Evaluasi kebijakan',
            value: 'Versi mesin deterministik dilog dengan hash hasil',
          },
          decision: {
            label: 'Pengambilan keputusan manusia',
            value: 'ID persetujuan, bukti otoritas delegasi, stempel SLA',
          },
          record: {
            label: 'Persistensi kanonik',
            value: 'Shard log peristiwa tier-WORM + atestasi penyimpanan dingin bermirror',
          },
        },
      },
      record: {
        label: 'Bundel terverifikasi',
        title: 'EVIDENCE-PACK CLOSED',
        description: 'Bundel ini memenuhi daftar periksa audit internal AC-417 tanpa merakit lampiran manual.',
        footer: 'Akar pohon hash · tanda tangan kuorum · bendera residensi yurisdiksi',
        fields: {
          source: { term: 'Sumber asal', value: '3 sistem · divergensi ditandai otomatis' },
          control: {
            term: 'Referensi kontrol',
            value: 'Pemetaan Lampiran A ISO27001 per keluarga kontrol',
          },
          result: { term: 'Hash status hasil', value: 'sha256:92f…c11' },
          review: { term: 'Tinjauan independen', value: 'Impor workbook Big-4 · delta 0' },
        },
      },
      consequence: {
        label: 'Postur audit',
        title: 'Utang bukti bermajemuk—Afenda amortisasi saat menulis.',
        body: 'Organisasi yang menunda pengambilan bukti membayar bunga majemuk pada setiap audit, sengketa, atau transisi kepemimpinan berikutnya. Bukti struktural menghindari trajektori itu.',
      },
    },
    executiveClose: {
      eyebrow: 'Keputusan eksekutif',
      title: 'Langkah berikutnya adalah tinjauan arsitektur—bukan demo lagi.',
      description:
        'Afenda menerbitkan ontologi yang sama untuk pengadaan, pembangun, auditor, dan operator. Putuskan apakah satu tulang punggung kebenaran struktural lebih baik daripada biaya rekonsiliasi yang meningkat.',
      cta: {
        workspace: 'Masuk ruang kerja teratur',
        briefing: 'Pesan briefing eksekutif',
        systemBrief: 'Tinjau dossier sistem',
      },
      panel: {
        ariaLabel: 'Panel dukungan keputusan eksekutif',
        label: 'Artefak siap dewan',
        title: 'Yang ditandatangani kepemimpinan',
        governance: {
          title: 'Dossier tata kelola',
          body: 'Paket kebijakan, overlay RACI, diagram segregasi, kerangka DPIA—diekspor sebagai bundel berversi.',
        },
        review: {
          title: 'Memo tinjauan red-team',
          body: 'Delta pentest pihak ketiga, kontrol kriptografis, hasil drill rantai anomaly.',
        },
        close: {
          label: 'Pos pemeriksaan keputusan',
          title: 'Tidak ada ketidaktahuan arsitektur tersisa?',
          body: 'Jika ada item masih “akan ditentukan saat implementasi,” tinjauan belum selesai—skala tidak memperbaiki kontrol ambigu.',
        },
      },
    },
  },
  ms: {
    topology: {
      eyebrow: 'Topologi sistem',
      title: 'Satu saluran isyarat mentah ke rekod yang boleh dipertahankan.',
      description:
        'Afenda tidak mencabarkan kebenaran merentas alat. Input dinormalisasi, dinilai dalam teras resolusi, dan dikeluarkan sebagai keadaan kanonik dengan keterlihatan audit.',
      thesis:
        'Jika organisasi tidak boleh melukis garisan ini pada satu gambarajah, ia tidak mempunyai satu kebenaran operasi—hanya tafsiran yang dipertikaikan.',
      diagram: {
        label: 'Topologi kawalan',
        title: 'Normalisasi → resolusi → komit',
        state: 'Invariant seni bina',
      },
      inputs: {
        title: 'Input operasi',
        items: {
          identity: {
            title: 'Isyarat identiti',
            body: 'Pelakon, penyewa, dan konteks pemilikan sebagai fakta peringkat pertama.',
          },
          skills: {
            title: 'Graf keupayaan',
            body: 'Kemahiran, kemahiran, dan struktur tenaga kerja sebagai atribut teratur.',
          },
          activity: {
            title: 'Telemetri pelaksanaan',
            body: 'Peristiwa aliran kerja, dokumen, dan HRIS dengan sumber dan cap masa.',
          },
          knowledge: {
            title: 'Objek pengetahuan',
            body: 'Artefak dan rekod pembelajaran terikat skop dan dasar.',
          },
        },
      },
      connectors: { normalize: 'Normalisasi', resolve: 'Resolusi' },
      controls: {
        title: 'Teras resolusi',
        items: {
          identityBinding: {
            title: 'Pengikatan identiti',
            body: 'Setiap peralihan terikat pelakon dan penyewa sebelum dasar dijalankan.',
          },
          policyResolution: {
            title: 'Resolusi dasar',
            body: 'Autoriti, pendahuluan, dan peraturan menentukan keadaan yang boleh berubah.',
          },
          evidenceCommit: {
            title: 'Komit bukti',
            body: 'Bukti dilampirkan semasa rekod ditulis—bukan dicipta semula kemudian.',
          },
        },
      },
      outputs: {
        title: 'Kebenaran dikeluarkan',
        items: {
          record: {
            label: 'Rekod kanonik',
            value: 'Satu keadaan terkomit yang perniagaan boleh operasikan.',
          },
          visibility: {
            label: 'Keterlihatan teratur',
            value: 'Pandangan mengikut peranan ke atas rekod asas yang sama.',
          },
          audit: {
            label: 'Jejak audit',
            value: 'Laluan boleh dikesan dari isyarat ke keadaan diterima.',
          },
        },
      },
      consequence: {
        label: 'Akibat reka bentuk',
        title: 'Tiada autoriti selari.',
        body: 'Jika saluran boleh mengubah kebenaran perniagaan tanpa merentasi tulang belakang ini, Afenda sengaja tidak menganggapnya teratur.',
      },
    },
    integrationReality: {
      eyebrow: 'Realiti integrasi',
      title: 'Sistem luar menyumbang isyarat. Afenda mengekalkan autoriti.',
      description:
        'ERP, HRIS, identiti, dan kolaborasi kekal sebagai sumber—bukan buku besar kebenaran bersaing. Setiap laluan masuk merentasi skop identiti, normalisasi, tadbir urus, dan disiplin komit.',
      quote: 'Integrasi membuktikan apa yang memasuki sempadan—bukan apa yang perniagaan dibenarkan percaya.',
      panel: {
        label: 'Permukaan kawalan integrasi',
        title: 'Dari isyarat luar ke rekod terbatas',
        state: 'Sempadan dikuatkuasakan',
        traceLine: 'isyarat luar → sempadan terkawal → rekod kanonik',
      },
      interfaces: {
        identity: {
          title: 'Satah identiti',
          body: 'SSO, induk HR, kontraktor, dan perinsip persekutuan dipetakan ke identiti tenaga kerja berskop penyewa.',
        },
        systems: {
          title: 'Penyambung sistem-rekod',
          body: 'Workday, SAP, BambooHR, ATS, LMS, tiket—dimasukkan sebagai sumber teratur ber-cap masa.',
        },
        knowledge: {
          title: 'Pengetahuan & dokumen',
          body: 'Objek Confluence, Notion, Drive didaftarkan dengan pemilikan, sensitiviti, dan teg dasar.',
        },
        governance: {
          title: 'Penguatkuasaan tadbir urus',
          body: 'Pek peraturan, rantaian kelulusan, pecah kaca, dan pengesanan hanyut sebelum keadaan maju.',
        },
      },
      boundary: {
        index: '03 / Sempadan penguatkuasaan',
        title: 'Urutan tanpa pintasan',
        description:
          'Setiap peringkat wajib. Melangkau peringkat bukan pilihan konfigurasi—ia kontrak integrasi yang gagal.',
        meta: 'urutan penguatkuasaan · tanpa pintasan',
        steps: {
          connect: {
            label: 'Sambung',
            value: 'Penyambut disahkan dengan rahsia least-privilege dan skop eksplisit.',
          },
          normalize: {
            label: 'Normalisasi',
            value: 'Pemetaan skema, penduplikasian, dan bendera konflik sebelum dasar.',
          },
          govern: {
            label: 'Tadbir urus',
            value: 'Dasar, kelulusan, dan pengecualian dinilai dengan keperluan bukti.',
          },
          commit: {
            label: 'Komit',
            value: 'Rekod kanonik ditulis dengan keturunan tidak berubah.',
          },
        },
      },
      record: {
        label: 'Resit integrasi',
        title: 'BOUNDARY-CLOSED',
        description:
          'Rekod ini mengesahkan aktiviti luar merentasi keseluruhan rantaian penguatkuasaan sebelum mengubah kebenaran perusahaan.',
        footer: 'Hash keturunan · jadual putaran · pengesahan skop dalam fail',
        tagline: 'sumber disimpan · sempadan dikuatkuasakan · keadaan diselesaikan',
        fields: {
          source: { term: 'Sistem sumber', value: 'Workday HCM (prod-west)' },
          contract: { term: 'Kontrak penyambung', value: 'WD-HCM-2025.3 · ditandatangani' },
          boundary: { term: 'Pemeriksaan sempadan', value: 'Identiti ✓ · Dasar ✓ · Bukti ✓' },
          result: {
            term: 'Hasil terkomit',
            value: 'Rekod tenaga kerja kanonik dikemas kini dengan bungkusan audit',
          },
        },
      },
      consequence: {
        label: 'Peraturan operasi',
        title: 'Integrasi tidak mendapat pintu sisi ke kebenaran.',
        body: 'Jika vendor atau aliran bayangan tidak boleh menunjukkan resit yang sama, ia bukan sebahagian model operasi teratur—tanpa mengira keselesaan UI.',
      },
    },
    resolutionStages: {
      input: {
        step: 'Input',
        title: 'Peristiwa masuk sebagai fakta membawa bukti.',
        description:
          'Dokumen, tindakan, integrasi, identiti, dan perubahan keadaan ditangkap dengan konteks mencukupi untuk dinilai kemudian.',
      },
      control: {
        step: 'Kawalan',
        title: 'Dasar menentukan autoriti dan pendahuluan.',
        description:
          'Sistem menilai skop penyewa, autoriti peranan, kebolehpercayaan sumber, dan ikatan peraturan sebelum keadaan dibenarkan bergerak.',
      },
      truth: {
        step: 'Kebenaran',
        title: 'Rekod kanonik diselesaikan dan disimpan.',
        description:
          'Keadaan terhasil boleh diperiksa, diaudit, dan digunakan merentas organisasi tanpa bergantung pada penjelasan manual.',
      },
    },
    commercial: {
      eyebrow: 'Postur komersial',
      title: 'Sedia perolehan tanpa teater perolehan.',
      description:
        'Afenda menyelaraskan undang-undang, keselamatan, dan pelaksana pada fakta seni bina yang sama: autoriti terbatas, bukti dikekalkan, dan satu postur rekod kanonik.',
      cta: { primary: 'Jadual semakan eksekutif', secondary: 'Buka dossier sistem' },
      panel: {
        label: 'Dimensi semakan',
        title: 'Apa yang due diligence benar-benar periksa',
        state: 'Bahan diselaraskan',
      },
      review: {
        governance: {
          title: 'Artefak tadbir urus',
          body: 'Matriks kawalan, kerangka DPIA, model segregasi, peta pengekalan—dieksport dari konfigurasi langsung.',
        },
        implementation: {
          title: 'Buku panduan pelaksanaan',
          body: 'Onboarding berfasa dengan rollback jelas, pintu validasi, dan kriteria kejayaan terikat rekod kanonik.',
        },
        security: {
          title: 'Bukti keselamatan',
          body: 'Putaran rahsia, pengikatan SSO, keturunan audit tidak berubah, penghalaan anomali didokumentasikan—bukan hanya diwar-warkan.',
        },
        commercial: {
          title: 'Struktur komersial',
          body: 'Kapasiti, peringkat sokongan, dan sempadan liabiliti terhadap kawalan ciri sebenar—tiada SKU rak.',
        },
      },
      process: {
        index: '04 / Rentak komersial',
        title: 'Dari perbualan pertama ke pengeluaran teratur',
        description: 'Setiap langkah menghasilkan artefak bertandatangan. Tiada yang bergantung pada narasi kosong.',
        steps: {
          scope: {
            label: 'Skop',
            value: 'Permukaan kebenaran dan kontrak integrasi disenaraikan.',
          },
          validate: {
            label: 'Sahkan',
            value: 'Penyewa perintis mematuhi tindanan dasar penuh—tiada pintasan demo.',
          },
          align: {
            label: 'Selaraskan',
            value: 'Undang-undang, IT, dan pihak eksekutif menandatangani pakej seni bina yang sama.',
          },
          commit: {
            label: 'Komit',
            value: 'Pelancaran pengeluaran dengan pengesahan bukti berterusan.',
          },
        },
      },
      record: {
        label: 'Rekod due diligence',
        title: 'SIGN-OFF ACTIVE',
        description:
          'Panel ini menjejaki penyelarasan kontrak antara kawalan dipasarkan dan konfigurasi yang dihantar.',
        footer: 'Dossier terkunci versi · log perubahan di bawah akses korporat',
        fields: {
          model: {
            term: 'Model penghantaran',
            value: 'Satah kawalan single-tenant · pengasingan bebanan multi-tenant',
          },
          basis: {
            term: 'Asas liabiliti',
            value: 'Peta jalan SOC2 Jenis II · lampiran uptime & residensi data',
          },
          review: { term: 'Pakej semakan lembaga', value: 'v2025-Q2 · diedarkan' },
          outcome: {
            term: 'Hasil semasa',
            value: 'Menunggu tandatangan balas CIO · tiada jurang kawalan terbuka',
          },
        },
      },
      consequence: {
        label: 'Akibat komersial',
        title: 'Kontrak merujuk seni bina—bukan slaid.',
        body: 'Apabila pertikaian atau audit tiba, kedua-dua pihak menjejaki obligasi ke kawalan tersenarai dan rekod tidak berubah—bukan tuntutan pemasaran yang ditafsir semula.',
      },
    },
    evidence: {
      eyebrow: 'Seni bina bukti',
      title: 'Kepercayaan adalah sifat rekod—bukan dek slaid.',
      description:
        'Afenda menjadikan bukti struktural: pengikatan identiti, penilaian dasar, komit kanonik, dan keterlihatan audit adalah peringkat kelihatan, bukan nota tambahan.',
      quote: 'Jika tidak boleh dikesan, ia bukan bukti—ia pendapat.',
      panel: {
        label: 'Tindanan bukti',
        title: 'Empat jaminan tidak boleh dikurangkan sebelum kebenaran diiktiraf',
        state: 'Semua peringkat dipenuhi',
      },
      items: {
        identity: {
          title: 'Pengikatan identiti',
          body: 'Pelakon, penyewa, sesi, cap masa, dan skop ditegaskan sebelum tafsiran.',
        },
        policy: {
          title: 'Pintu dasar',
          body: 'Peraturan, kelulusan, pengecualian, dan pecah kaca dinilai dengan rasional direkodkan.',
        },
        record: {
          title: 'Komit kanonik',
          body: 'Peralihan keadaan menulis fakta tahan lama dengan versi dan hash keturunan.',
        },
        audit: {
          title: 'Permukaan audit',
          body: 'Pemeriksa melihat laluan dari peristiwa asal ke hasil dipertahankan—tiada rekonstruksi luar talian.',
        },
      },
      auditPath: {
        index: '03 / Keturunan boleh diperiksa',
        title: 'Rantai minimum setiap regulator minta—dibina masuk',
        description: 'Setiap lompatan diakui kriptografi atau operasi. Membuang lompatan membatalkan rekod.',
        steps: {
          actor: {
            label: 'Pengakuan pelakon',
            value: 'Sesi disokong perkakasan + step-up untuk peralihan sensitif',
          },
          tenant: {
            label: 'Pengasingan penyewa',
            value: 'Keselamatan peringkat baris + larangan panggilan rentas penyewa di tepi API',
          },
          policy: {
            label: 'Penilaian dasar',
            value: 'Versi enjin deterministik dilog dengan hash hasil',
          },
          decision: {
            label: 'Tangkapan keputusan manusia',
            value: 'ID pelulus, bukti autoriti delegasi, cap SLA',
          },
          record: {
            label: 'Kekal kanonik',
            value: 'Shard log peristiwa tier-WORM + pengesahan storan sejuk bermirror',
          },
        },
      },
      record: {
        label: 'Bungkusan disahkan',
        title: 'EVIDENCE-PACK CLOSED',
        description: 'Bungkusan ini memenuhi senarai semak audit dalaman AC-417 tanpa merakit lampiran manual.',
        footer: 'Akar pokok hash · tandatangan kuorum · bendera residensi bidang kuasa',
        fields: {
          source: { term: 'Sumber asal', value: '3 sistem · perbezaan ditandai automatik' },
          control: {
            term: 'Rujukan kawalan',
            value: 'Pemetaan Lampiran A ISO27001 setiap keluarga kawalan',
          },
          result: { term: 'Hash keadaan hasil', value: 'sha256:92f…c11' },
          review: { term: 'Semakan bebas', value: 'Import workbook Big-4 · delta 0' },
        },
      },
      consequence: {
        label: 'Postur audit',
        title: 'Hutang bukti terkumpul—Afenda melunaskan semasa menulis.',
        body: 'Organisasi yang menangguh tangkapan bukti membayar faedah majemuk pada setiap audit, pertikaian, atau peralihan kepimpinan berikutnya. Bukti struktural mengelak trajektori itu.',
      },
    },
    executiveClose: {
      eyebrow: 'Keputusan eksekutif',
      title: 'Langkah seterusnya adalah semakan seni bina—bukan demo lagi.',
      description:
        'Afenda menerbitkan ontologi yang sama untuk perolehan, pembina, auditor, dan operator. Putuskan sama ada satu tulang belakang kebenaran struktural lebih baik daripada kos penyelarasan yang meningkat.',
      cta: {
        workspace: 'Masuk ruang kerja teratur',
        briefing: 'Tempah taklimat eksekutif',
        systemBrief: 'Semak dossier sistem',
      },
      panel: {
        ariaLabel: 'Panel sokongan keputusan eksekutif',
        label: 'Artefak siap lembaga',
        title: 'Yang kepimpinan luluskan',
        governance: {
          title: 'Dossier tadbir urus',
          body: 'Pek dasar, overlay RACI, gambarajah segregasi, kerangka DPIA—dieksport sebagai bungkusan berversi.',
        },
        review: {
          title: 'Memo semakan pasukan merah',
          body: 'Delta pentest pihak ketiga, kawalan kriptografi, keputusan latihan rantai anomaly.',
        },
        close: {
          label: 'Pos pemeriksaan keputusan',
          title: 'Tiada ketidaktahuan seni bina yang tinggal?',
          body: 'Jika apa-apa masih “akan ditakrif dalam pelaksanaan,” semakan belum lengkap—skala tidak membaiki kawalan kabur.',
        },
      },
    },
  },
};

translations.vi = {
  topology: {
    eyebrow: 'Kiến trúc hệ thống',
    title: 'Một luồng duy nhất từ tín hiệu thô đến bản ghi có thể bảo vệ.',
    description:
      'Afenda không phân tán sự thật khắp công cụ. Đầu vào được chuẩn hóa, đánh giá trong lõi phân giải và phát ra trạng thái chuẩn với khả năng kiểm toán.',
    thesis:
      'Nếu tổ chức không vẽ được đường này trên một sơ đồ, không có một sự thật vận hành duy nhất — chỉ những cách hiểu tranh luận.',
    diagram: {
      label: 'Kiến trúc điều khiển',
      title: 'Chuẩn hóa → phân giải → cam kết',
      state: 'Bất biến kiến trúc',
    },
    inputs: {
      title: 'Đầu vào vận hành',
      items: {
        identity: {
          title: 'Tín hiệu định danh',
          body: 'Tác nhân, tenant và ngữ cảnh sở hữu là sự kiện hạng nhất.',
        },
        skills: {
          title: 'Đồ thị năng lực',
          body: 'Kỹ năng, trình độ và cơ cấu nhân sự là thuộc tính được quản trị.',
        },
        activity: {
          title: 'Telemetry thực thi',
          body: 'Sự kiện quy trình, tài liệu và HRIS có nguồn và dấu thời gian.',
        },
        knowledge: {
          title: 'Đối tượng tri thức',
          body: 'Hiện vật và bản ghi học tập gắn với phạm vi và chính sách.',
        },
      },
    },
    connectors: { normalize: 'Chuẩn hóa', resolve: 'Phân giải' },
    controls: {
      title: 'Lõi phân giải',
      items: {
        identityBinding: {
          title: 'Ràng buộc định danh',
          body: 'Mỗi chuyển trạng thái gắn tác nhân và tenant trước khi áp chính sách.',
        },
        policyResolution: {
          title: 'Phân giải chính sách',
          body: 'Thẩm quyền, thứ tự ưu tiên và quy tắc quyết định trạng thái có thể thay đổi.',
        },
        evidenceCommit: {
          title: 'Cam kết bằng chứng',
          body: 'Bằng chứng đính kèm khi ghi — không dựng lại sau.',
        },
      },
    },
    outputs: {
      title: 'Sự thật phát ra',
      items: {
        record: {
          label: 'Bản ghi chuẩn',
          value: 'Một trạng thái đã cam kết để doanh nghiệp vận hành.',
        },
        visibility: {
          label: 'Hiển thị được quản trị',
          value: 'Góc nhìn theo vai trên cùng bản ghi nền.',
        },
        audit: {
          label: 'Đường mòn kiểm toán',
          value: 'Lộ trình từ tín hiệu đến trạng thái được chấp nhận.',
        },
      },
    },
    consequence: {
      label: 'Hệ quả thiết kế',
      title: 'Không thẩm quyền song song.',
      body: 'Nếu kênh có thể thay đổi sự thật doanh nghiệp mà không đi qua cột sống này, Afenda cố ý không coi là được quản trị.',
    },
  },
  integrationReality: {
    eyebrow: 'Thực tế tích hợp',
    title: 'Hệ thống bên ngoài cung cấp tín hiệu. Afenda giữ thẩm quyền.',
    description:
      'ERP, HRIS, định danh và cộng tác vẫn là nguồn — không phải sổ cái sự thật cạnh tranh. Mọi luồng vào đi qua phạm vi định danh, chuẩn hóa, quản trị và kỷ luật cam kết.',
    quote: 'Tích hợp chứng minh điều gì đã qua ranh giới — không phải doanh nghiệp được phép tin gì.',
    panel: {
      label: 'Bề mặt kiểm soát tích hợp',
      title: 'Từ tín hiệu bên ngoài đến bản ghi giới hạn',
      state: 'Ranh giới được thực thi',
      traceLine: 'tín hiệu bên ngoài → ranh giới kiểm soát → bản ghi chuẩn',
    },
    interfaces: {
      identity: {
        title: 'Mặt phẳng định danh',
        body: 'SSO, HR master, nhà thầu và principal liên bang ánh xạ định danh nhân sự theo tenant.',
      },
      systems: {
        title: 'Connector hệ thống ghi nhận',
        body: 'Workday, SAP, BambooHR, ATS, LMS, ticketing — nhập như nguồn được quản trị có dấu thời gian.',
      },
      knowledge: {
        title: 'Tri thức & tài liệu',
        body: 'Đối tượng Confluence, Notion, Drive đăng ký với sở hữu, độ nhạy và thẻ chính sách.',
      },
      governance: {
        title: 'Thực thi quản trị',
        body: 'Gói quy tắc, chuỗi phê duyệt, break-glass và phát hiện trôi dạt trước khi trạng thái tiến.',
      },
    },
    boundary: {
      index: '03 / Ranh giới thực thi',
      title: 'Trình tự không thể bỏ qua',
      description:
        'Mỗi giai đoạn bắt buộc. Bỏ qua giai đoạn không phải tùy chọn cấu hình — đó là hợp đồng tích hợp thất bại.',
      meta: 'trình tự thực thi · không bypass',
      steps: {
        connect: {
          label: 'Kết nối',
          value: 'Connector xác thực với bí mật least-privilege và phạm vi rõ ràng.',
        },
        normalize: {
          label: 'Chuẩn hóa',
          value: 'Ánh xạ schema, khử trùng lặp và cờ xung đột trước chính sách.',
        },
        govern: {
          label: 'Quản trị',
          value: 'Chính sách, phê duyệt và ngoại lệ được đánh giá kèm yêu cầu bằng chứng.',
        },
        commit: {
          label: 'Cam kết',
          value: 'Bản ghi chuẩn được ghi với dòng dõi bất biến.',
        },
      },
    },
    record: {
      label: 'Biên lai tích hợp',
      title: 'BOUNDARY-CLOSED',
      description:
        'Bản ghi này chứng nhận hoạt động bên ngoài đi qua toàn bộ chuỗi thực thi trước khi thay đổi sự thật doanh nghiệp.',
      footer: 'Hash dòng dõi · lịch xoay · chứng thực phạm vi trong hồ sơ',
      tagline: 'giữ nguồn · ranh giới thực thi · trạng thái đã phân giải',
      fields: {
        source: { term: 'Hệ thống nguồn', value: 'Workday HCM (prod-west)' },
        contract: { term: 'Hợp đồng connector', value: 'WD-HCM-2025.3 · đã ký' },
        boundary: { term: 'Điểm kiểm ranh giới', value: 'Định danh ✓ · Chính sách ✓ · Bằng chứng ✓' },
        result: {
          term: 'Kết quả đã cam kết',
          value: 'Bản ghi nhân sự chuẩn được cập nhật kèm gói kiểm toán',
        },
      },
    },
    consequence: {
      label: 'Quy tắc vận hành',
      title: 'Tích hợp không có cửa sau tới sự thật.',
      body: 'Nếu nhà cung cấp hoặc luồng ngầm không trình được cùng biên lai, nó không thuộc mô hình vận hành được quản trị — bất kể tiện UI.',
    },
  },
  resolutionStages: {
    input: {
      step: 'Đầu vào',
      title: 'Sự kiện vào như sự kiện mang bằng chứng.',
      description: 'Tài liệu, hành động, tích hợp, định danh và thay đổi trạng thái được thu đủ ngữ cảnh để xét sau.',
    },
    control: {
      step: 'Kiểm soát',
      title: 'Chính sách quyết định thẩm quyền và thứ tự.',
      description:
        'Hệ thống đánh giá phạm vi tenant, thẩm quyền vai trò, độ tin cậy nguồn và ràng buộc quy tắc trước khi cho phép thay đổi trạng thái.',
    },
    truth: {
      step: 'Sự thật',
      title: 'Bản ghi chuẩn được phân giải và lưu giữ.',
      description:
        'Trạng thái kết quả có thể kiểm tra, kiểm toán và dùng xuyên tổ chức mà không cần giải thích thủ công.',
    },
  },
  commercial: {
    eyebrow: 'Thế mạnh thương mại',
    title: 'Sẵn sàng mua sắm — không làm xiếc thương mại.',
    description:
      'Afenda căn chỉnh pháp lý, bảo mật và triển khai trên cùng sự kiện kiến trúc: thẩm quyền giới hạn, giữ bằng chứng và một thế bản ghi chuẩn.',
    cta: { primary: 'Đặt lịch rà soát lãnh đạo', secondary: 'Mở hồ sơ hệ thống' },
    panel: {
      label: 'Khía cạnh rà soát',
      title: 'Do diligence thực sự kiểm gì',
      state: 'Tài liệu đã thống nhất',
    },
    review: {
      governance: {
        title: 'Hiện vật quản trị',
        body: 'Ma trận kiểm soát, khung DPIA, mô hình phân tách, bản đồ lưu trữ — xuất từ cấu hình thực.',
      },
      implementation: {
        title: 'Sổ tay triển khai',
        body: 'Onboarding theo pha có rollback rõ ràng, cổng kiểm tra và tiêu chí thành công gắn bản ghi chuẩn.',
      },
      security: {
        title: 'Bằng chứng bảo mật',
        body: 'Xoay bí mật, SSO, dòng dõi kiểm toán bất biến, định tuyến bất thường được ghi — không chỉ khẳng định.',
      },
      commercial: {
        title: 'Cấu trúc thương mại',
        body: 'Dung lượng, cấp hỗ trợ và giới hạn trách nhiệm đối chiếu điều khiển thực tế — không SKU trên kệ.',
      },
    },
    process: {
      index: '04 / Nhịp thương mại',
      title: 'Từ cuộc trò chuyện đầu đến sản xuất được quản trị',
      description: 'Mỗi bước tạo hiện vật có chữ ký. Không bước nào dựa vào lời nói suông.',
      steps: {
        scope: {
          label: 'Phạm vi',
          value: 'Liệt kê mặt sự thật và hợp đồng tích hợp.',
        },
        validate: {
          label: 'Xác thực',
          value: 'Tenant pilot tuân đủ chồng chính sách — không tắt demo.',
        },
        align: {
          label: 'Căn chỉnh',
          value: 'Pháp luật, IT và điều hành ký cùng gói kiến trúc.',
        },
        commit: {
          label: 'Cam kết',
          value: 'Triển khai sản xuất với xác minh bằng chứng liên tục.',
        },
      },
    },
    record: {
      label: 'Bản ghi diligence',
      title: 'SIGN-OFF ACTIVE',
      description: 'Bảng theo dõi sự căn chỉnh hợp đồng giữa điều khiển được marketing và cấu hình đã triển khai.',
      footer: 'Hồ sơ khóa phiên bản · nhật ký thay đổi dưới quyền truy cập nội bộ',
      fields: {
        model: {
          term: 'Mô hình triển khai',
          value: 'Mặt phẳng điều khiển đơn-tenant · cô lập tải đa-tenant',
        },
        basis: {
          term: 'Cơ sở trách nhiệm',
          value: 'Lộ trình SOC2 Type II · phụ lụu uptime & cư trú dữ liệu',
        },
        review: { term: 'Gói xem xét HĐQT', value: 'v2025-Q2 · đã lưu hành' },
        outcome: {
          term: 'Kết quả hiện tại',
          value: 'Chờ chữ ký đối ứng CIO · không có lỗ hổng kiểm soát',
        },
      },
    },
    consequence: {
      label: 'Hệ quả thương mại',
      title: 'Hợp đồng trích dẫn kiến trúc — không phải slide.',
      body: 'Khi tranh chấp hoặc kiểm toán, hai bên lần theo nghĩa vụ tới điều khiển được liệt kê và bản ghi bất biến — không phải tuyên bố marketing diễn giải lại.',
    },
  },
  evidence: {
    eyebrow: 'Kiến trúc bằng chứng',
    title: 'Niềm tin là thuộc tính của bản ghi — không phải của slide.',
    description:
      'Afenda làm bằng chứng có cấu trúc: ràng buộc định danh, đánh giá chính sách, cam kết chuẩn và khả năng kiểm toán là giai đoạn hiển thị, không phải chú thích thêm.',
    quote: 'Nếu không lan man được, đó không phải bằng chứng — đó là ý kiến.',
    panel: {
      label: 'Chồng bằng chứng',
      title: 'Bốn đảm bảo không thể rút gọn trước khi công nhận sự thật',
      state: 'Mọi giai đoạn đã đạt',
    },
    items: {
      identity: {
        title: 'Ràng buộc định danh',
        body: 'Tác nhân, tenant, phiên, dấu thời gian và phạm vi được khẳng định trước khi diễn giải.',
      },
      policy: {
        title: 'Cổng chính sách',
        body: 'Quy tắc, phê duyệt, miễn trừ và break-glass được đánh giá và ghi lý do.',
      },
      record: {
        title: 'Cam kết chuẩn',
        body: 'Chuyển trạng thái ghi sự kiện bền với phiên bản và hash dòng dõi.',
      },
      audit: {
        title: 'Bề mặt kiểm toán',
        body: 'Thanh tra thấy đường từ sự kiện gốc tới kết quả được bảo vệ — không tái dựng ngoại tuyến.',
      },
    },
    auditPath: {
      index: '03 / Dòng dõi có thể kiểm tra',
      title: 'Chuỗi tối thiểu mọi cơ quan quản lý yêu cầu — tích hợp sẵn',
      description: 'Mỗi bước được chứng thực mật mã hoặc vận hành. Bỏ bước làm vô hiệu bản ghi.',
      steps: {
        actor: {
          label: 'Chứng thực tác nhân',
          value: 'Phiên có phần cứng + bước thêm cho chuyển trạng thái nhạy cảm',
        },
        tenant: {
          label: 'Cô lập tenant',
          value: 'Bảo mật cấp hàng + cấm gọi liên tenant ở biên API',
        },
        policy: {
          label: 'Đánh giá chính sách',
          value: 'Phiên máy deterministic được log kèm hash kết quả',
        },
        decision: {
          label: 'Ghi nhận quyết định con người',
          value: 'ID người phê duyệt, chứng minh thẩm quyền ủy quyền, SLA dấu thời gian',
        },
        record: {
          label: 'Lưu trữ chuẩn',
          value: 'Mảnh log WORM + chứng thực lưu trữ lạnh phản chiếu',
        },
      },
    },
    record: {
      label: 'Gói đã xác minh',
      title: 'EVIDENCE-PACK CLOSED',
      description: 'Gói đáp ứng danh mục kiểm tra nội bộ AC-417 không cần lắp phụ lụm thủ công.',
      footer: 'Gốc cây hash · chữ ký quorum · cờ cư trú pháp lý',
      fields: {
        source: {
          term: 'Nguồn phát sinh',
          value: '3 hệ thống · lệch tự động cờ',
        },
        control: {
          term: 'Tham chiếu kiểm soát',
          value: 'Ánh xạ ISO27001 Annex A theo họ kiểm soát',
        },
        result: { term: 'Hash trạng thái kết quả', value: 'sha256:92f…c11' },
        review: { term: 'Rà soát độc lập', value: 'Nhập workbook Big-4 · delta 0' },
      },
    },
    consequence: {
      label: 'Thế kiểm toán',
      title: 'Nợ bằng chứng lũy kế — Afenda khấu hao ngay khi ghi.',
      body: 'Hoãn ghi nhận bằng chứng làm chi phí hợp lũy trên mỗi kiểm toán, tranh chấp hoặc chuyển giao lãnh đạo sau đó.',
    },
  },
  executiveClose: {
    eyebrow: 'Quyết định điều hành',
    title: 'Bước tiếp theo là rà soát kiến trúc — không phải demo nữa.',
    description:
      'Afenda công bố cùng bản thể học cho mua hàng, kỹ sư, kiểm toán và vận hành. Hãy chọn một cột sống sự thật cấu trúc hay chi phối đối chiếu tăng dần.',
    cta: {
      workspace: 'Vào không gian làm việc được quản trị',
      briefing: 'Đặt lịch trình báo cấp lãnh đạo',
      systemBrief: 'Xem hồ sơ hệ thống',
    },
    panel: {
      ariaLabel: 'Bảng hỗ trợ quyết định điều hành',
      label: 'Hiện vật sẵn cho HĐQT',
      title: 'Điều lãnh đạo ký nhận',
      governance: {
        title: 'Hồ sơ quản trị',
        body: 'Gói chính sách, lớp RACI, sơ đồ phân tách, khung DPIA — xuất thành gói phiên bản.',
      },
      review: {
        title: 'Bản ghi nhớ rà đỏ',
        body: 'Chênh lệch pentest bên thứ ba, điều khiển mật mã, kết quả diễn tập anomaly.',
      },
      close: {
        label: 'Điểm kiểm quyết định',
        title: 'Còn chỗ trống kiến trúc không?',
        body: 'Nếu mục nào vẫn “định nghĩa khi triển khai,” rà soát chưa xong — quy mô không sửa kiểm soát mơ hồ.',
      },
    },
  },
};

translations['zh-CN'] = {
  topology: {
    eyebrow: '系统拓扑',
    title: '从原始信号到可辩护记录的唯一管线。',
    description: 'Afenda 不会把真理分散在各个工具里。输入经标准化后在解析核心中被评估，并以可审计的规范状态输出。',
    thesis: '如果组织无法用一张图画出这条路径，就无法拥有单一的运营真理—只有分歧的阐释。',
    diagram: {
      label: '控制拓扑',
      title: '标准化 → 解析 → 提交',
      state: '架构不变式',
    },
    inputs: {
      title: '运营输入',
      items: {
        identity: {
          title: '身份信号',
          body: '行为者、租户与所有权上下文作为一等事实。',
        },
        skills: {
          title: '能力图',
          body: '技能、熟练度与劳动力结构是受治理的属性。',
        },
        activity: {
          title: '执行遥测',
          body: '工作流、文档与 HRIS 事件带来源与时间戳。',
        },
        knowledge: {
          title: '知识对象',
          body: '制品与学习记录绑定范围与策略。',
        },
      },
    },
    connectors: { normalize: '标准化', resolve: '解析' },
    controls: {
      title: '解析核心',
      items: {
        identityBinding: {
          title: '身份绑定',
          body: '每次状态迁移在策略运行前先绑定行为者与租户。',
        },
        policyResolution: {
          title: '策略解析',
          body: '权威、优先级与规则决定哪些状态可以改变。',
        },
        evidenceCommit: {
          title: '证据提交',
          body: '在写入记录时附带证明—事后不可重建补办。',
        },
      },
    },
    outputs: {
      title: '输出的真理',
      items: {
        record: {
          label: '规范记录',
          value: '企业可赖以运营的单次提交状态。',
        },
        visibility: {
          label: '受治理可见性',
          value: '同一底层记录的按角色视图。',
        },
        audit: {
          label: '审计轨迹',
          value: '从信号到接受状态的可追溯路径。',
        },
      },
    },
    consequence: {
      label: '设计后果',
      title: '无并行权威。',
      body: '若某一通道绕过此脊柱仍可改变业务真理，Afenda 故意不把它视为受治理。',
    },
  },
  integrationReality: {
    eyebrow: '集成现实',
    title: '外部系统贡献信号；Afenda 保留权威。',
    description:
      'ERP、HRIS、身份与协作工具仍是数据源—而非彼此竞争的真理账本。每条入站路径跨过身份范围、标准化、治理与提交纪律。',
    quote: '集成证明穿过了何种边界——而非业务被允许相信什么。',
    panel: {
      label: '集成控制面',
      title: '从外部信号到有界记录',
      state: '边界已强制执行',
      traceLine: '外部信号 → 受控边界 → 规范记录',
    },
    interfaces: {
      identity: {
        title: '身份平面',
        body: '将 SSO、人力主档、承包商与联邦主体映射到租户范围的人力身份。',
      },
      systems: {
        title: '记录系统连接器',
        body: '将 Workday、SAP、BambooHR、ATS、LMS、工单作为带时间戳的受治理源摄取。',
      },
      knowledge: {
        title: '知识与文档',
        body: '为 Confluence、Notion、Drive 对象注册所有权、敏感性与策略标签。',
      },
      governance: {
        title: '治理执行',
        body: '在状态推进前应用规则包、审批链、破窗权限与漂移检测。',
      },
    },
    boundary: {
      index: '03 / 执行边界',
      title: '不可绕过的序列',
      description: '每阶段为强制。跳过阶段不是配置项—而是失败的集成合同。',
      meta: '执行序列 · 不可绕过',
      steps: {
        connect: {
          label: '连接',
          value: '经身份验证的连接器，最小特权凭据与显式范围。',
        },
        normalize: {
          label: '标准化',
          value: '策略前的模式映射、去重与冲突标记。',
        },
        govern: {
          label: '治理',
          value: '在证据要求下评估策略、审批与例外路径。',
        },
        commit: {
          label: '提交',
          value: '以不可变谱系写入规范记录。',
        },
      },
    },
    record: {
      label: '集成回执',
      title: 'BOUNDARY-CLOSED',
      description: '本条记录证明外部活动已通过完整执行链后才改变企业真理。',
      footer: '谱系哈希 · 轮换计划 · 范围证明已归档',
      tagline: '来源保留 · 边界执行 · 状态已解析',
      fields: {
        source: { term: '源系统', value: 'Workday HCM（prod-west）' },
        contract: { term: '连接器契约', value: 'WD-HCM-2025.3 · 已签署' },
        boundary: { term: '边界检查点', value: '身份 ✓ · 策略 ✓ · 证据 ✓' },
        result: {
          term: '已提交结果',
          value: '规范人力记录随审计包更新',
        },
      },
    },
    consequence: {
      label: '运营规则',
      title: '集成没有通向真理的后门。',
      body: '若供应商或影子流程拿不出相同回执，则不属于受治理运营模型——无论界面多方便。',
    },
  },
  resolutionStages: {
    input: {
      step: '输入',
      title: '事件以携带证据的事实进入。',
      description: '捕获文档、操作、集成、身份与状态变更，并具有足够上下文供后续评判。',
    },
    control: {
      step: '控制',
      title: '策略决定权威与优先级。',
      description: '系统在允许移动状态之前评估租户范围、角色权威、源可靠性与规则绑定。',
    },
    truth: {
      step: '真理',
      title: '规范记录被解析并保留。',
      description: '结果状态可被检查、可被审计并可跨组织使用，无须依赖口述解释。',
    },
  },
  commercial: {
    eyebrow: '商业姿态',
    title: '为采购就绪，而非采购表演。',
    description: 'Afenda 让法务、安全与实施基于同一架构事实对齐：bounded 权威、保留证据及单一规范记录姿态。',
    cta: { primary: '安排高管评审', secondary: '打开系统档案' },
    panel: {
      label: '尽调维度',
      title: '尽调真正检查什么',
      state: '材料已对齐',
    },
    review: {
      governance: {
        title: '治理工件',
        body: '控制矩阵、DPIA 脚手架、分离模型与保留图谱—从实时配置导出。',
      },
      implementation: {
        title: '实施手册',
        body: '分阶段入职，明示回滚、验证关口与绑定规范记录的成功标准。',
      },
      security: {
        title: '安全证据',
        body: '凭据轮换、SSO 绑定、不可变审计血缘与异常路由均有文档——非声称。',
      },
      commercial: {
        title: '商业结构',
        body: '容量、支持与责任边界对齐真实控制能力—无虚列 SKU。',
      },
    },
    process: {
      index: '04 / 商业节奏',
      title: '从首次沟通到受治理生产',
      description: '每步产出可签署工件；不依赖空谈叙事。',
      steps: {
        scope: {
          label: '范围',
          value: '列出真理表面与集成合同。',
        },
        validate: {
          label: '验证',
          value: '试点租户服从完整策略栈——无演示捷径。',
        },
        align: {
          label: '对齐',
          value: '法务、IT 与高管签署同一架构包。',
        },
        commit: {
          label: '提交',
          value: '生产上线并持续验证证据。',
        },
      },
    },
    record: {
      label: '尽调记录',
      title: 'SIGN-OFF ACTIVE',
      description: '面板跟踪市面控制与实际部署之间的合同对齐。',
      footer: '版本锁定档案 · 变更日志在企业访问下',
      fields: {
        model: {
          term: '交付模型',
          value: '单租户控制面 · 多租户工作负载隔离',
        },
        basis: {
          term: '责任基础',
          value: 'SOC2 Type II 路线图 · 合同可用性与数据驻留附件',
        },
        review: { term: '董事会评审包', value: 'v2025-Q2 · 已传阅' },
        outcome: {
          term: '当前结果',
          value: '待 CIO 会签 · 无开放控制缺口',
        },
      },
    },
    consequence: {
      label: '商业后果',
      title: '合同引用架构—而非幻灯片。',
      body: '争议或审计发生时，双方沿列明控制与不可变记录追溯义务—而非重新解读营销表述。',
    },
  },
  evidence: {
    eyebrow: '证据架构',
    title: '信任是记录的属性—不是讲稿。',
    description: 'Afenda 将证据结构化：身份绑定、策略评估、规范提交与审计可见性均为显式阶段，而非事后批注。',
    quote: '若无法追踪，则不是证据—只是观点。',
    panel: {
      label: '证据栈',
      title: '承认真理前四项不可删减保证',
      state: '各阶段均已满足',
    },
    items: {
      identity: {
        title: '身份绑定',
        body: '在解释前断言行为者、租户、会话、时间戳与范围。',
      },
      policy: {
        title: '策略闸口',
        body: '在记录理由前提下评估规则、审批、豁免与破窗。',
      },
      record: {
        title: '规范提交',
        body: '状态迁移写入耐久事实并带版本与谱系哈希。',
      },
      audit: {
        title: '审计界面',
        body: '检查者能看到从始发事件到可辩护结果的完整路径—无离线拼凑。',
      },
    },
    auditPath: {
      index: '03 / 可检查谱系',
      title: '监管机构最低要求的链路—内置',
      description: '每一步均有密码学或运维证明；缺一步记录即失效。',
      steps: {
        actor: {
          label: '行为者证明',
          value: '硬件支撑会话与敏感迁移的强化验证',
        },
        tenant: {
          label: '租户隔离',
          value: '行级安全及 API 边界的跨租户调用禁止',
        },
        policy: {
          label: '策略评估',
          value: '记录确定性引擎版本与结果哈希',
        },
        decision: {
          label: '人为决策捕获',
          value: '审批人 ID、委派权威证明与 SLA 时间戳',
        },
        record: {
          label: '规范持久化',
          value: 'WORM 级事件分片日志与镜像冷存证明',
        },
      },
    },
    record: {
      label: '已验证束',
      title: 'EVIDENCE-PACK CLOSED',
      description: '本束满足内部审计清单 AC-417，无须手工装订附件。',
      footer: '哈希树根 · 法定人数签名 · 管辖驻留标记',
      fields: {
        source: {
          term: '来源系统',
          value: '3 套系统 · 分歧自动标记',
        },
        control: {
          term: '控制引用',
          value: '按控制族关联 ISO27001 附录 A 映射',
        },
        result: { term: '结果状态哈希', value: 'sha256:92f…c11' },
        review: { term: '独立复核', value: '四大工作簿导入 · 差异 0' },
      },
    },
    consequence: {
      label: '审计姿态',
      title: '证据债务会复利—Afenda 在写入时分摊。',
      body: '推迟取证会在后续每次审计、争议或领导班子更替中产生复利成本；结构化证据避免该轨迹。',
    },
  },
  executiveClose: {
    eyebrow: '高管决策',
    title: '下一步是架构评审—不是再做一次演示。',
    description: 'Afenda 向采购、建设者、审计与运营公布同一本体。请选择一条结构性真理脊柱，还是不断升级的对账成本。',
    cta: {
      workspace: '进入受治理工作区',
      briefing: '预约高管简报',
      systemBrief: '审阅系统档案',
    },
    panel: {
      ariaLabel: '高管决策支持面板',
      label: '董事会就绪工件',
      title: '领导层签署的核心内容',
      governance: {
        title: '治理档案袋',
        body: '策略包、RACI 叠加、分离示意图、DPIA 脚手架—导出为版本化合集。',
      },
      review: {
        title: '红队评审备忘录',
        body: '第三方渗透差异、加密控制与异常链路演练结果。',
      },
      close: {
        label: '决策检查点',
        title: '是否仍无架构盲点？',
        body: '若有事项仍标注“实施时再定义”，则评审未完—规模化无法修补模糊控制。',
      },
    },
  },
};

function deepMergeLanding(base, patch) {
  const out = structuredClone(base);
  const landing = out.landing;
  if (!landing || typeof landing !== 'object') return base;
  for (const key of [
    'topology',
    'integrationReality',
    'resolutionStages',
    'commercial',
    'evidence',
    'executiveClose',
  ]) {
    if (patch[key]) landing[key] = structuredClone(patch[key]);
  }
  return out;
}

for (const loc of locales) {
  const p = join(fallbackDir, `${loc}.json`);
  const raw = readFileSync(p, 'utf8');
  const json = JSON.parse(raw);
  const patch = translations[loc];
  if (!patch) {
    console.error('missing translations for', loc);
    process.exit(1);
  }
  writeFileSync(p, `${JSON.stringify(deepMergeLanding(json, patch), null, 2)}\n`);
  console.log('updated', loc);
}
