# PROGRESS — KPP Safety Dashboard (PT Kalimantan Prima Persada)

> Simpan file ini. Kalau chat dengan Claude penuh/lambat, buka chat baru,
> lampirkan file ini, lalu bilang: "Ini project safety dashboard saya,
> lanjutkan dari sini" — Claude akan langsung paham konteksnya.

## Info Dasar
- **Repo GitHub**: `SHE-COORDINATOR-PROG/kpp-safety-form`
- **Live URL**: https://kpp-safety-form.vercel.app
- **Hosting**: Vercel (auto-deploy tiap ada commit ke branch `main`)
- **Database**: Neon Postgres (project name: `kpp-safety-form`, sudah diisi `DATABASE_URL` & `DIRECT_URL` di Environment Variables Vercel, dan di file `.env` lokal)
- **Stack**: Next.js 14 (App Router) + Prisma + Tailwind CSS
- **Folder lokal di komputer**: `D:\kpp-safety-app`

## Struktur Halaman (App Router)
```
app/
  layout.tsx                     → root layout (minimal, judul: PT Kalimantan Prima Persada)
  page.tsx                       → TIDAK dipakai lagi (halaman lama, sudah dihapus)
  pengajuan-lifting/page.tsx     → link PUBLIK form Lifting Plan (tanpa sidebar, bisa dibagikan)
  api/                           → semua route handler backend (lihat daftar di bawah)
  (dashboard)/                   → route group: semua halaman dengan Sidebar
    layout.tsx                   → bungkus Sidebar + konten
    page.tsx                     → Dashboard utama (chart, stat card)
    form-inspeksi/
      page.tsx                   → daftar 19 form checklist inspeksi
      [slug]/page.tsx            → 1 form checklist (dinamis per alat)
      [slug]/InspectionFormClient.tsx
    riwayat-inspeksi/page.tsx    → riwayat semua hasil inspeksi
    lifting-plan/page.tsx        → form pengajuan lifting plan (dalam app, ada sidebar)
    riwayat-lifting-plan/page.tsx→ riwayat + export PDF lifting plan
    lifting-report/page.tsx      → form + riwayat laporan pelaksanaan lifting
    pengajuan-limbah-b3/page.tsx → form pengajuan pengambilan limbah B3
    riwayat-limbah-b3/page.tsx   → riwayat + export PDF limbah B3
    import-manifest-b3/page.tsx  → upload PDF manifest limbah B3 (drag & drop)
    riwayat-manifest-b3/page.tsx → riwayat manifest B3 (lihat/hapus)
    setting-target/page.tsx      → setting target tahunan per kategori
```

## Menu Sidebar (urutan saat ini)
Dashboard → Riwayat Inspeksi → Form Inspeksi → Pengajuan Lifting Plan →
Riwayat Lifting Plan → Lifting Report → Pengajuan Limbah B3 →
Riwayat Limbah B3 → Import Manifest B3 → Riwayat Manifest B3 → Setting Target

## Kategori Form Inspeksi (19 form)
- **APD** (dulu "Hand & Finger"): APD dan Seragam Kerja
- **Tools & Equipment**: Toolbox, Jack Stand, Jack Pneumatic, Genset, Mesin Press Filter, Compressor Angin
- **Lifting & Rigging**: Crane Truck, Overhead Crane, Telehandler, Forklift
- **Environment** (dulu "Near Water"): Oil Trap, TPS Limbah B3
- **Listrik & Las**: Panel Listrik, Welding Machine, Perlengkapan Welding
- **Peralatan Emergency** (dulu "Sertifikasi & Admin"): 5R, Peralatan Emergency (P3K/APAR/Eyewash), Lotto & Emergency Stop

## Fitur per Modul

### Lifting Plan
- Form: nama pekerjaan, lokasi, tanggal, jenis alat, beban/SWL (otomatis hitung %), operator/rigger/signalman/supervisor, checklist JSA/sertifikat, **upload foto unit alat**, **upload foto dokumen pendukung** (bukan PDF lagi — diganti foto karena masalah upload PDF di HP)
- Ada **link publik** `/pengajuan-lifting` (tanpa login, bisa dibagikan ke pekerja lapangan)
- Riwayat: list ringan (tanpa foto, cepat dimuat) + tombol Export PDF yang fetch foto on-demand
- PDF export: logo PT Kalimantan Prima Persada di kiri atas, nama di tengah, tabel data, **foto unit & foto dokumen sejajar**, ada fallback "⚠ Foto gagal dimuat" kalau gambar korup, area tanda tangan "Diajukan Oleh / Disetujui Oleh"

### Lifting Report
- Form + riwayat digabung 1 halaman
- Export PDF dengan header logo yang sama

### Limbah B3
- Form: hari (otomatis dari tanggal), tanggal, lokasi TPS (fix), rencana tanggal ambil (range), kode limbah (dropdown 9 jenis), tanggal dihasilkan (range), masa simpan (fix 90 hari), **jumlah limbah** & **jumlah kemasan** (dropdown dinamis tergantung jenis limbah: Oli Bekas beda dengan Battery beda dengan lainnya, + ada opsi "Lainnya (Input Manual)"), upload foto TTD & lampiran
- Nomor form otomatis: `LB3-MMYY-XXX`
- Riwayat + Export PDF: logo & nama **PT ASMIN BARA BRONANG** (khusus form ini beda dari yang lain), layout mirip form fisik asli (kotak NO FORM kanan atas, tabel bordered, kotak CATATAN, TTD 3 kolom)

### Manifest B3 (baru)
- Upload PDF manifest (drag & drop), field nomor manifest & keterangan opsional
- Riwayat: list, tombol Lihat PDF (buka di tab baru), tombol Hapus

### Dashboard
- Stat card: Program Selesai, Pencapaian %, Total Inspeksi, Lifting Plan
- Chart 3D custom (SVG isometric) per kategori & per bulan — judulnya sudah tanpa "(3D)"
- Donut status per kategori, tren aktivitas (bar+line)

## Isu yang Pernah Muncul & Solusinya (untuk referensi kalau muncul lagi)
1. **404 di /api/inspeksi** → pastikan folder `app/api/inspeksi`, `lifting-report`, `setting-target` tidak sengaja ikut terhapus
2. **Riwayat lambat dibuka** → penyebabnya list API dulu ikut kirim foto base64 besar; sekarang list API cuma kirim data ringan, foto diambil terpisah lewat endpoint `/api/lifting-plan/[id]` dan `/api/limbah-b3/[id]` saat Export diklik
3. **Foto dari HP gagal submit ("Unexpected token '<'")** → biasanya karena payload kelebihan batas ukuran; sekarang semua foto **otomatis dikompres** di browser (lihat `lib/imageUtils.ts`) sebelum dikirim
4. **Logo tidak muncul di PDF export** → karena `window.print()` dipanggil sebelum gambar selesai dimuat; sekarang pakai `window.onload` + delay 250ms
5. **File tertukar antar folder saat upload manual di GitHub** → selalu cek breadcrumb GitHub sebelum klik "Add file" → "Upload files", pastikan di folder yang benar
6. **`npx prisma db push` bilang "already in sync" padahal ada tabel baru** → biasanya karena file `prisma/schema.prisma` di komputer lokal belum ditimpa dengan versi terbaru (beda dengan yang di GitHub)
7. **Aplikasi lambat pertama dibuka** → Neon (database) & Vercel (server) versi gratis "tidur" kalau tidak dipakai. Ada endpoint `/api/health` yang bisa di-ping berkala (misal pakai cron-job.org, gratis) untuk mencegah ini — belum sempat disetel sepenuhnya, bisa lanjut kapan saja.

## Cara Kerja Deploy (ringkasan)
Karena `git push` dari terminal sempat bermasalah (akun GitHub tertukar), workflow yang dipakai sekarang: **edit lewat sandbox Claude → Claude kasih file/zip → upload manual lewat github.com (Add file → Upload files) → Vercel auto build ulang**. Untuk perubahan skema database, tambahan: copy `prisma/schema.prisma` yang baru ke folder lokal `D:\kpp-safety-app\prisma`, lalu jalankan `npx prisma db push` di terminal VS Code.

## PR / Belum Selesai
- Setup cron-job.org untuk keep-alive `/api/health` (opsional, biar tidak lambat pertama dibuka)
- Belum ada autentikasi login (siapa saja yang punya link bisa akses)
