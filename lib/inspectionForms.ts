// Konfigurasi seluruh form inspeksi.
// CATATAN PENTING: Dasar hukum yang dicantumkan adalah regulasi K3 umum yang
// relevan di Indonesia (UU No.1/1970, PP 50/2012, dan Permenaker terkait).
// Sebelum digunakan secara resmi, mohon diverifikasi ulang oleh tim
// HSE/Legal perusahaan terhadap versi regulasi terbaru yang berlaku,
// karena peraturan dapat direvisi dari waktu ke waktu.

export type ChecklistItem = {
  no: number;
  pertanyaan: string;
};

export type InspectionFormConfig = {
  slug: string;
  title: string;
  category:
    | "APD"
    | "Tools & Equipment"
    | "Lifting & Rigging"
    | "Environment"
    | "Listrik & Las"
    | "Peralatan Emergency";
  dasarHukum: string[];
  deskripsi: string;
  items: ChecklistItem[];
};

const UU_K3 = "UU No. 1 Tahun 1970 tentang Keselamatan Kerja";
const SMK3 = "PP No. 50 Tahun 2012 tentang Penerapan SMK3";

export const inspectionForms: InspectionFormConfig[] = [
  {
    slug: "toolbox",
    title: "Inspeksi Toolbox (Kotak Alat Kerja)",
    category: "Tools & Equipment",
    dasarHukum: [UU_K3, SMK3, "Permenaker No. 38 Tahun 2016 tentang K3 Pesawat Tenaga dan Produksi"],
    deskripsi: "Pemeriksaan kelengkapan dan kondisi alat tangan (hand tools) dalam toolbox kerja.",
    items: [
      { no: 1, pertanyaan: "Kondisi fisik toolbox (tidak retak/rusak, mudah dibawa)" },
      { no: 2, pertanyaan: "Kelengkapan alat sesuai daftar isi (checklist isi box)" },
      { no: 3, pertanyaan: "Kondisi kunci pas/ring/socket tidak aus atau selip" },
      { no: 4, pertanyaan: "Kondisi obeng, tang, palu tidak retak gagang/kepala" },
      { no: 5, pertanyaan: "Tidak ada alat modifikasi/tidak standar (unsafe tools)" },
      { no: 6, pertanyaan: "Alat ukur (meteran/multitester) berfungsi & terkalibrasi" },
      { no: 7, pertanyaan: "Tidak ada alat tajam tanpa pelindung/sarung" },
      { no: 8, pertanyaan: "Label/kode identitas toolbox tersedia dan terbaca" },
    ],
  },
  {
    slug: "crane-truck",
    title: "Inspeksi Crane Truck",
    category: "Lifting & Rigging",
    dasarHukum: [UU_K3, "Permenaker No. 8 Tahun 2020 tentang K3 Pesawat Angkat dan Angkut", SMK3],
    deskripsi: "Pemeriksaan harian (pre-use inspection) unit crane truck sebelum dioperasikan.",
    items: [
      { no: 1, pertanyaan: "SIA/SILO dan Akta Izin alat masih berlaku" },
      { no: 2, pertanyaan: "Sertifikat/lisensi operator (SIO) masih berlaku" },
      { no: 3, pertanyaan: "Load chart/SWL tertera jelas dan terbaca di kabin" },
      { no: 4, pertanyaan: "Kondisi wire rope/sling tidak putus, kink, atau korosi berlebih" },
      { no: 5, pertanyaan: "Hook dilengkapi safety latch dan tidak deformasi" },
      { no: 6, pertanyaan: "Fungsi limit switch (anti two-block) berfungsi normal" },
      { no: 7, pertanyaan: "Outrigger/stabilizer berfungsi dan pad dalam kondisi baik" },
      { no: 8, pertanyaan: "Alarm/lampu rotary, klakson mundur berfungsi" },
      { no: 9, pertanyaan: "Kondisi hidrolik tidak ada kebocoran" },
      { no: 10, pertanyaan: "APAR tersedia di unit dan masih dalam masa berlaku" },
    ],
  },
  {
    slug: "overhead-crane",
    title: "Inspeksi Overhead Crane",
    category: "Lifting & Rigging",
    dasarHukum: [UU_K3, "Permenaker No. 8 Tahun 2020 tentang K3 Pesawat Angkat dan Angkut", SMK3],
    deskripsi: "Pemeriksaan berkala overhead crane/hoist crane di area kerja/workshop.",
    items: [
      { no: 1, pertanyaan: "Riksa uji berkala (akta/SILO) masih berlaku" },
      { no: 2, pertanyaan: "Kondisi rel/girder tidak retak dan terpasang kokoh" },
      { no: 3, pertanyaan: "Wire rope/chain hoist tidak aus, putus, atau berkarat" },
      { no: 4, pertanyaan: "Hook & safety latch berfungsi baik, tidak deformasi" },
      { no: 5, pertanyaan: "Limit switch naik/turun dan gerak lintang berfungsi" },
      { no: 6, pertanyaan: "Remote/pendant control berfungsi normal, tombol tidak macet" },
      { no: 7, pertanyaan: "Emergency stop berfungsi" },
      { no: 8, pertanyaan: "Area di bawah lintasan crane bebas dari penghalang" },
      { no: 9, pertanyaan: "Load chart/SWL tercantum jelas pada unit" },
      { no: 10, pertanyaan: "Operator memiliki lisensi (SIO) yang masih berlaku" },
    ],
  },
  {
    slug: "telehandler-merlo",
    title: "Inspeksi Telehandler (Merlo)",
    category: "Lifting & Rigging",
    dasarHukum: [UU_K3, "Permenaker No. 8 Tahun 2020 tentang K3 Pesawat Angkat dan Angkut", SMK3],
    deskripsi: "Pemeriksaan harian unit telehandler sebelum digunakan mengangkat/memindahkan beban.",
    items: [
      { no: 1, pertanyaan: "SIA/Izin alat dan SIO operator masih berlaku" },
      { no: 2, pertanyaan: "Load chart sesuai attachment yang terpasang" },
      { no: 3, pertanyaan: "Kondisi boom teleskopik, tidak ada kebocoran hidrolik" },
      { no: 4, pertanyaan: "Fork/attachment terkunci sempurna dan tidak retak" },
      { no: 5, pertanyaan: "Fungsi rem parkir & rem kerja normal" },
      { no: 6, pertanyaan: "Ban dalam kondisi baik, tekanan sesuai standar" },
      { no: 7, pertanyaan: "Seatbelt dan ROPS/FOPS berfungsi baik" },
      { no: 8, pertanyaan: "Kaca spion, lampu kerja, dan alarm mundur berfungsi" },
      { no: 9, pertanyaan: "Indikator kemiringan (level indicator) berfungsi" },
      { no: 10, pertanyaan: "APAR tersedia dan sabuk pengaman kondisi baik" },
    ],
  },
  {
    slug: "forklift",
    title: "Inspeksi Forklift",
    category: "Lifting & Rigging",
    dasarHukum: [UU_K3, "Permenaker No. 8 Tahun 2020 tentang K3 Pesawat Angkat dan Angkut", SMK3],
    deskripsi: "Pemeriksaan harian (pre-use checklist) unit forklift sebelum dioperasikan.",
    items: [
      { no: 1, pertanyaan: "SIA/Izin alat dan SIO operator masih berlaku" },
      { no: 2, pertanyaan: "Garpu (fork) tidak retak, bengkok, atau aus berlebih" },
      { no: 3, pertanyaan: "Rantai angkat (lift chain) tidak kendor/berkarat" },
      { no: 4, pertanyaan: "Rem kerja dan rem parkir berfungsi normal" },
      { no: 5, pertanyaan: "Klakson, lampu, dan alarm mundur berfungsi" },
      { no: 6, pertanyaan: "Overhead guard tidak retak/deformasi" },
      { no: 7, pertanyaan: "Kondisi ban sesuai standar (tidak botak/pecah)" },
      { no: 8, pertanyaan: "Load chart/kapasitas angkut tertera jelas" },
      { no: 9, pertanyaan: "Tidak ada kebocoran oli hidrolik/bahan bakar" },
      { no: 10, pertanyaan: "APAR tersedia dan berfungsi baik" },
    ],
  },
  {
    slug: "jack-stand",
    title: "Inspeksi Jack Stand",
    category: "Tools & Equipment",
    dasarHukum: [UU_K3, "Permenaker No. 38 Tahun 2016 tentang K3 Pesawat Tenaga dan Produksi", SMK3],
    deskripsi: "Pemeriksaan kondisi jack stand (dudukan penopang) sebelum digunakan menopang beban.",
    items: [
      { no: 1, pertanyaan: "Kapasitas beban (rating) tertera jelas dan terbaca" },
      { no: 2, pertanyaan: "Tidak ada retak/deformasi pada rangka dan dudukan" },
      { no: 3, pertanyaan: "Base/kaki penopang stabil dan rata" },
      { no: 4, pertanyaan: "Tidak ada karat berlebih yang mengurangi kekuatan" },
      { no: 5, pertanyaan: "Digunakan sesuai kapasitas beban maksimum" },
      { no: 6, pertanyaan: "Label inspeksi/tanggal riksa uji terakhir tersedia" },
    ],
  },
  {
    slug: "jack-pneumatic",
    title: "Inspeksi Jack Pneumatic (Dongkrak Angin)",
    category: "Tools & Equipment",
    dasarHukum: [UU_K3, "Permenaker No. 38 Tahun 2016 tentang K3 Pesawat Tenaga dan Produksi", SMK3],
    deskripsi: "Pemeriksaan dongkrak bertenaga angin/hidrolik-pneumatik sebelum dioperasikan.",
    items: [
      { no: 1, pertanyaan: "Kapasitas angkat (rating) tertera jelas" },
      { no: 2, pertanyaan: "Selang angin tidak retak, bocor, atau menggembung" },
      { no: 3, pertanyaan: "Sambungan quick coupler terpasang rapat, tidak bocor" },
      { no: 4, pertanyaan: "Piston/dudukan angkat tidak bengkok atau bocor oli" },
      { no: 5, pertanyaan: "Katup pelepas tekanan (relief valve) berfungsi" },
      { no: 6, pertanyaan: "Base stabil dan tidak retak" },
      { no: 7, pertanyaan: "Tersedia jack stand pendamping saat digunakan (tidak berdiri sendiri)" },
    ],
  },
  {
    slug: "genset",
    title: "Inspeksi Genset",
    category: "Tools & Equipment",
    dasarHukum: [UU_K3, "Permenaker No. 38 Tahun 2016 tentang K3 Pesawat Tenaga dan Produksi", "Permenaker No. 12 Tahun 2015 tentang K3 Listrik di Tempat Kerja"],
    deskripsi: "Pemeriksaan unit genset (generator set) sebagai sumber daya cadangan.",
    items: [
      { no: 1, pertanyaan: "Grounding/pentanahan unit terpasang dan terukur baik" },
      { no: 2, pertanyaan: "Panel kontrol dan indikator (voltmeter/frekuensi) berfungsi" },
      { no: 3, pertanyaan: "Tidak ada kebocoran bahan bakar/oli pelumas" },
      { no: 4, pertanyaan: "Sistem pendingin (radiator) dalam kondisi baik" },
      { no: 5, pertanyaan: "Peredam suara (silencer) dan knalpot tidak bocor" },
      { no: 6, pertanyaan: "APAR jenis sesuai tersedia di dekat unit" },
      { no: 7, pertanyaan: "Kabel power dan terminal koneksi dalam kondisi baik" },
      { no: 8, pertanyaan: "Emergency stop berfungsi baik" },
      { no: 9, pertanyaan: "Area sekitar genset bersih dari material mudah terbakar" },
    ],
  },
  {
    slug: "panel-listrik",
    title: "Inspeksi Panel Listrik",
    category: "Listrik & Las",
    dasarHukum: [UU_K3, "Permenaker No. 12 Tahun 2015 tentang K3 Listrik di Tempat Kerja", SMK3],
    deskripsi: "Pemeriksaan panel distribusi listrik (LVMDP/sub-panel) di area kerja.",
    items: [
      { no: 1, pertanyaan: "Pintu panel dapat terkunci dan tertutup rapat" },
      { no: 2, pertanyaan: "Label single line diagram/identitas beban tersedia" },
      { no: 3, pertanyaan: "Tidak ada tanda panas berlebih (hot spot/gosong) pada terminal" },
      { no: 4, pertanyaan: "MCB/breaker berfungsi normal, tidak ada yang di-jumper" },
      { no: 5, pertanyaan: "Sistem grounding/pentanahan panel terukur sesuai standar" },
      { no: 6, pertanyaan: "Tidak ada kabel terkelupas/sambungan terbuka" },
      { no: 7, pertanyaan: "Rambu bahaya listrik terpasang di area panel" },
      { no: 8, pertanyaan: "Akses ke panel bebas dari halangan (min. 1 meter)" },
      { no: 9, pertanyaan: "APAR jenis CO2/tepung kering tersedia di dekat panel" },
    ],
  },
  {
    slug: "oil-trap",
    title: "Inspeksi Oil Trap",
    category: "Environment",
    dasarHukum: [
      "PP No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup",
      UU_K3,
    ],
    deskripsi: "Pemeriksaan bak penangkap oli (oil trap/oil catcher) pada saluran drainase area kerja.",
    items: [
      { no: 1, pertanyaan: "Tidak ada ceceran oli yang lolos ke saluran umum" },
      { no: 2, pertanyaan: "Ketebalan lapisan oli belum melebihi kapasitas trap" },
      { no: 3, pertanyaan: "Struktur bak tidak retak/bocor" },
      { no: 4, pertanyaan: "Penutup/cover oil trap terpasang dengan baik" },
      { no: 5, pertanyaan: "Jadwal pembersihan/pengurasan berkala terdokumentasi" },
      { no: 6, pertanyaan: "Oli yang terkumpul dikelola sesuai prosedur limbah B3" },
      { no: 7, pertanyaan: "Area sekitar oil trap bersih, tidak ada tumpahan sekunder" },
    ],
  },
  {
    slug: "tps-limbah-b3",
    title: "Inspeksi TPS Limbah B3",
    category: "Environment",
    dasarHukum: [
      "PP No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup",
      "Permen LHK No. P.12/2020 tentang Penyimpanan Limbah B3",
    ],
    deskripsi: "Pemeriksaan Tempat Penyimpanan Sementara (TPS) Limbah Bahan Berbahaya dan Beracun.",
    items: [
      { no: 1, pertanyaan: "Izin/persetujuan TPS Limbah B3 masih berlaku" },
      { no: 2, pertanyaan: "Simbol dan label limbah B3 terpasang sesuai jenis limbah" },
      { no: 3, pertanyaan: "Lantai kedap air dan memiliki bak penampung tumpahan (secondary containment)" },
      { no: 4, pertanyaan: "Limbah disimpan sesuai masa simpan yang diizinkan (tidak melebihi batas)" },
      { no: 5, pertanyaan: "Pemisahan limbah sesuai karakteristik (tidak dicampur)" },
      { no: 6, pertanyaan: "Tersedia APAR dan spill kit di sekitar TPS" },
      { no: 7, pertanyaan: "Manifest/logbook keluar-masuk limbah B3 terisi lengkap" },
      { no: 8, pertanyaan: "Akses masuk TPS dibatasi (hanya petugas berwenang)" },
      { no: 9, pertanyaan: "Atap dan ventilasi TPS dalam kondisi baik" },
    ],
  },
  {
    slug: "apd-seragam",
    title: "Inspeksi APD dan Seragam Kerja",
    category: "APD",
    dasarHukum: [UU_K3, "Permenaker No. 8 Tahun 2010 tentang Alat Pelindung Diri", SMK3],
    deskripsi: "Pemeriksaan kelengkapan dan kelayakan Alat Pelindung Diri serta seragam kerja karyawan.",
    items: [
      { no: 1, pertanyaan: "Helm safety tidak retak dan tali dagu berfungsi" },
      { no: 2, pertanyaan: "Sepatu safety (steel toe) dalam kondisi baik, sol tidak aus" },
      { no: 3, pertanyaan: "Sarung tangan sesuai jenis pekerjaan dan tidak sobek" },
      { no: 4, pertanyaan: "Kacamata/pelindung mata tersedia dan lensa tidak baret" },
      { no: 5, pertanyaan: "Rompi/seragam reflektif dalam kondisi layak pakai" },
      { no: 6, pertanyaan: "Ear plug/ear muff tersedia untuk area bising" },
      { no: 7, pertanyaan: "Masker/respirator sesuai area kerja berdebu/berbahaya" },
      { no: 8, pertanyaan: "APD tambahan (full body harness, dll) sesuai kebutuhan tugas" },
    ],
  },
  {
    slug: "welding-machine",
    title: "Inspeksi Welding Machine",
    category: "Listrik & Las",
    dasarHukum: [UU_K3, "Permenaker No. 2 Tahun 1982 tentang Kualifikasi Juru Las", "Permenaker No. 12 Tahun 2015 tentang K3 Listrik di Tempat Kerja"],
    deskripsi: "Pemeriksaan mesin las (welding machine) sebelum digunakan untuk pekerjaan pengelasan.",
    items: [
      { no: 1, pertanyaan: "Kabel input dan output tidak terkelupas/rusak" },
      { no: 2, pertanyaan: "Grounding mesin las terpasang dengan baik" },
      { no: 3, pertanyaan: "Casing/body mesin tidak retak dan tertutup rapat" },
      { no: 4, pertanyaan: "Kipas pendingin (cooling fan) berfungsi normal" },
      { no: 5, pertanyaan: "Panel indikator ampere/voltage berfungsi" },
      { no: 6, pertanyaan: "Tidak ada tanda hangus/percikan pada konektor" },
      { no: 7, pertanyaan: "Sertifikat juru las (welder) operator masih berlaku" },
      { no: 8, pertanyaan: "APAR tersedia di dekat area pengelasan" },
    ],
  },
  {
    slug: "perlengkapan-welding",
    title: "Inspeksi Perlengkapan Welding",
    category: "Listrik & Las",
    dasarHukum: [UU_K3, "Permenaker No. 2 Tahun 1982 tentang Kualifikasi Juru Las", "Permenaker No. 8 Tahun 2010 tentang Alat Pelindung Diri"],
    deskripsi: "Pemeriksaan perlengkapan pendukung pengelasan: regulator, selang gas, APD las, dan welding curtain.",
    items: [
      { no: 1, pertanyaan: "Regulator gas (oksigen/asetilen/argon) tidak bocor" },
      { no: 2, pertanyaan: "Selang gas tidak retak, getas, atau bocor sambungan" },
      { no: 3, pertanyaan: "Flashback arrestor terpasang pada regulator dan torch" },
      { no: 4, pertanyaan: "Tabung gas berdiri tegak dan diikat/dirantai dengan aman" },
      { no: 5, pertanyaan: "Apron, sarung tangan las, dan face shield tersedia & layak pakai" },
      { no: 6, pertanyaan: "Welding curtain/tirai las terpasang untuk mencegah paparan sinar UV" },
      { no: 7, pertanyaan: "Area kerja las bebas dari material mudah terbakar" },
      { no: 8, pertanyaan: "Alat pemadam api ringan tersedia di lokasi" },
    ],
  },
  {
    slug: "5r",
    title: "Inspeksi 5R (Ringkas, Rapi, Resik, Rawat, Rajin)",
    category: "Peralatan Emergency",
    dasarHukum: [UU_K3, SMK3],
    deskripsi: "Audit penerapan budaya 5R (housekeeping) di area kerja sebagai bagian dari SMK3.",
    items: [
      { no: 1, pertanyaan: "Ringkas: barang tidak terpakai sudah disingkirkan dari area kerja" },
      { no: 2, pertanyaan: "Rapi: barang/alat memiliki tempat tetap dan diberi label" },
      { no: 3, pertanyaan: "Resik: area kerja bersih dari sampah, ceceran oli, dan debu" },
      { no: 4, pertanyaan: "Rawat: standar 5R terdokumentasi dan dipatuhi rutin" },
      { no: 5, pertanyaan: "Rajin: karyawan konsisten menjalankan 5R tanpa diingatkan" },
      { no: 6, pertanyaan: "Jalur evakuasi dan akses APAR tidak terhalang barang" },
      { no: 7, pertanyaan: "Penandaan/marka lantai (jalur pejalan kaki, area kerja) jelas terlihat" },
    ],
  },
  {
    slug: "peralatan-emergency",
    title: "Inspeksi Peralatan Emergency (P3K, APAR, Eyewash)",
    category: "Peralatan Emergency",
    dasarHukum: [
      UU_K3,
      "Permenaker No. 15 Tahun 2008 tentang P3K di Tempat Kerja",
      "Permenaker No. 4 Tahun 1980 tentang Syarat Pemasangan dan Pemeliharaan APAR",
    ],
    deskripsi: "Pemeriksaan kesiapan kotak P3K, Alat Pemadam Api Ringan (APAR), dan unit eyewash station.",
    items: [
      { no: 1, pertanyaan: "Kotak P3K terisi lengkap sesuai daftar isi standar" },
      { no: 2, pertanyaan: "Obat/alkes dalam kotak P3K belum kedaluwarsa" },
      { no: 3, pertanyaan: "APAR memiliki tekanan sesuai indikator (hijau/normal)" },
      { no: 4, pertanyaan: "Segel dan pin APAR masih utuh (belum pernah dipakai)" },
      { no: 5, pertanyaan: "APAR mudah dijangkau, tidak terhalang, tinggi sesuai standar" },
      { no: 6, pertanyaan: "Tanggal inspeksi/kartu kontrol APAR terisi rutin bulanan" },
      { no: 7, pertanyaan: "Eyewash station berfungsi, air mengalir bersih & lancar" },
      { no: 8, pertanyaan: "Rambu lokasi P3K/APAR/eyewash terpasang jelas" },
    ],
  },
  {
    slug: "mesin-press-filter",
    title: "Inspeksi Mesin Press Filter",
    category: "Tools & Equipment",
    dasarHukum: [UU_K3, "Permenaker No. 38 Tahun 2016 tentang K3 Pesawat Tenaga dan Produksi", SMK3],
    deskripsi: "Pemeriksaan mesin press filter (filter press) yang digunakan pada proses pemisahan cairan/padatan.",
    items: [
      { no: 1, pertanyaan: "Pelindung/guard bagian bergerak (moving part) terpasang lengkap" },
      { no: 2, pertanyaan: "Emergency stop berfungsi dan mudah dijangkau" },
      { no: 3, pertanyaan: "Sistem hidrolik tidak ada kebocoran tekanan" },
      { no: 4, pertanyaan: "Panel kontrol dan indikator tekanan berfungsi normal" },
      { no: 5, pertanyaan: "Interlock/sensor pengaman pintu press berfungsi" },
      { no: 6, pertanyaan: "Tidak ada suara/getaran abnormal saat beroperasi" },
      { no: 7, pertanyaan: "Area sekitar mesin bersih dan bebas tumpahan" },
      { no: 8, pertanyaan: "Operator memahami prosedur LOTO sebelum maintenance" },
    ],
  },
  {
    slug: "compressor-angin",
    title: "Inspeksi Compressor Angin dan Line Pipa",
    category: "Tools & Equipment",
    dasarHukum: [UU_K3, "Permenaker No. 37 Tahun 2016 tentang K3 Bejana Tekan dan Tangki Timbun", "Permenaker No. 38 Tahun 2016 tentang K3 Pesawat Tenaga dan Produksi"],
    deskripsi: "Pemeriksaan unit kompresor udara dan jaringan pipa distribusi udara bertekanan.",
    items: [
      { no: 1, pertanyaan: "Safety valve/relief valve berfungsi dan tidak diikat/dimatikan" },
      { no: 2, pertanyaan: "Pressure gauge berfungsi dan menunjukkan tekanan wajar" },
      { no: 3, pertanyaan: "Tangki penampung (air receiver tank) tidak ada indikasi korosi/retak" },
      { no: 4, pertanyaan: "Riksa uji bejana tekan (jika ada) masih berlaku" },
      { no: 5, pertanyaan: "Sambungan line pipa tidak ada kebocoran udara" },
      { no: 6, pertanyaan: "Selang bertekanan tidak retak/menggembung, klem terpasang baik" },
      { no: 7, pertanyaan: "Guard belt/pulley pada unit kompresor terpasang lengkap" },
      { no: 8, pertanyaan: "Sistem drain kondensat berfungsi normal" },
    ],
  },
  {
    slug: "lotto-emergency-stop",
    title: "Inspeksi Lotto & Emergency Stop Unit",
    category: "Peralatan Emergency",
    dasarHukum: [UU_K3, "Permenaker No. 38 Tahun 2016 tentang K3 Pesawat Tenaga dan Produksi", SMK3],
    deskripsi: "Pemeriksaan kelengkapan Lock Out Tag Out (LOTO) dan fungsi tombol emergency stop pada unit/mesin.",
    items: [
      { no: 1, pertanyaan: "Gembok dan tag LOTO tersedia dan tidak rusak" },
      { no: 2, pertanyaan: "Prosedur LOTO tertulis tersedia dan mudah diakses" },
      { no: 3, pertanyaan: "Setiap titik isolasi energi teridentifikasi dan diberi label" },
      { no: 4, pertanyaan: "Emergency stop button berfungsi dan mudah dijangkau" },
      { no: 5, pertanyaan: "Emergency stop menghentikan seluruh fungsi mesin secara efektif" },
      { no: 6, pertanyaan: "Karyawan yang berwenang memasang LOTO sudah terlatih" },
      { no: 7, pertanyaan: "Papan/log status LOTO aktif terdokumentasi dengan baik" },
    ],
  },
];

export function getFormBySlug(slug: string) {
  return inspectionForms.find((f) => f.slug === slug);
}

export const categories = [
  "APD",
  "Tools & Equipment",
  "Lifting & Rigging",
  "Environment",
  "Listrik & Las",
  "Peralatan Emergency",
] as const;
