# KPP Mining — Safety Dashboard

Aplikasi dashboard Program Kerja Plant Safety + 21 form inspeksi K3, dibangun dengan
**Next.js 14 (App Router) + Prisma + Neon Postgres + Tailwind CSS**. Responsif untuk
laptop maupun HP.

## Fitur

- Dashboard ringkasan (stat card, progress bar, 2 chart batang 3D, donut status, tren aktivitas, tabel ringkasan)
- 19 form checklist inspeksi alat/area K3 (lihat daftar di `lib/inspectionForms.ts`), lengkap dengan referensi dasar hukum
- Form Pengajuan Lifting Plan + Lifting Report (terhubung satu sama lain)
- Upload metadata dokumen program, riwayat upload, riwayat aspek, riwayat inspeksi
- Setting target program/inspeksi tahunan per kategori
- Sidebar responsif: tampil permanen di layar besar, jadi drawer + hamburger menu di HP

> ⚠️ **Catatan penting soal dasar hukum**: referensi regulasi (UU No.1/1970, PP 50/2012,
> Permenaker, dsb) pada tiap form adalah rujukan umum yang relevan. Mohon diverifikasi
> ulang oleh tim HSE/Legal perusahaan terhadap versi regulasi terbaru yang berlaku
> sebelum dipakai sebagai dokumen resmi.

---

## 1. Menjalankan di Komputer Lokal

```bash
# 1. Install dependency
npm install

# 2. Salin file environment
cp .env.example .env
# lalu isi DATABASE_URL dengan connection string Neon (lihat langkah di bawah)

# 3. Push skema ke database
npx prisma db push

# 4. (Opsional) isi data contoh
npm run seed

# 5. Jalankan development server
npm run dev
```

Buka `http://localhost:3000`.

---

## 2. Membuat Database di Neon (Postgres Serverless)

1. Buka **https://neon.tech** → daftar/login (bisa pakai akun GitHub).
2. Klik **New Project**, beri nama misalnya `kpp-safety-db`, pilih region terdekat (mis. Singapore).
3. Setelah project dibuat, buka tab **Connection Details**.
4. Pilih mode **Pooled connection** (untuk aplikasi serverless seperti Vercel), lalu **copy** connection string-nya — formatnya kira-kira:
   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Tempel ke `.env` sebagai `DATABASE_URL`.
6. Neon juga menyediakan **direct connection** (tanpa `-pooler`) — pakai ini untuk `DIRECT_URL` di `.env` (dipakai Prisma saat migrasi).
7. Jalankan `npx prisma db push` dari komputer lokal untuk membuat seluruh tabel di database Neon.

---

## 3. Upload Project ke GitHub

```bash
cd kpp-safety-app
git init
git add .
git commit -m "Initial commit: KPP Mining Safety Dashboard"
```

1. Buka **https://github.com/new**, buat repository baru, misalnya `kpp-safety-dashboard` (boleh Private).
2. **Jangan** centang "Add README" (karena sudah ada dari project ini).
3. Hubungkan repo lokal ke GitHub sesuai instruksi yang muncul, contoh:
   ```bash
   git remote add origin https://github.com/USERNAME/kpp-safety-dashboard.git
   git branch -M main
   git push -u origin main
   ```

---

## 4. Deploy ke Vercel

1. Buka **https://vercel.com** → login pakai akun GitHub yang sama.
2. Klik **Add New → Project**, pilih repository `kpp-safety-dashboard` yang baru di-push.
3. Vercel otomatis mendeteksi framework **Next.js** — biarkan default build command (`npm run build`) dan output-nya.
4. Sebelum klik **Deploy**, buka bagian **Environment Variables** dan tambahkan:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | connection string pooled dari Neon |
   | `DIRECT_URL` | connection string direct dari Neon |
5. Klik **Deploy**. Tunggu proses build selesai (skrip `postinstall` otomatis menjalankan `prisma generate`).
6. Setelah selesai, Vercel memberi URL publik, misalnya `https://kpp-safety-dashboard.vercel.app`.

### Tips integrasi Neon ⇄ Vercel (opsional, lebih praktis)
Di Vercel Marketplace tersedia integrasi **Neon** resmi: buka *Storage* tab pada project Vercel → **Connect Database** → pilih **Neon** → ikuti wizard. Ini otomatis mengisi environment variable `DATABASE_URL` tanpa copy-paste manual.

### Setiap kali ada perubahan skema database
```bash
npx prisma db push   # jalankan dari lokal, mengarah ke DATABASE_URL Neon yang sama dengan production
git add . && git commit -m "update"
git push
```
Vercel otomatis re-deploy setiap kali ada push ke branch `main`.

---

## 5. Struktur Project (ringkas)

```
app/
  page.tsx                 → Dashboard
  form-inspeksi/           → Daftar & detail 19 form checklist
  lifting-plan/            → Form pengajuan lifting plan
  lifting-report/          → Form laporan lifting
  upload-dokumen/          → Upload metadata dokumen program
  riwayat-*/                → Halaman riwayat (upload, aspek, inspeksi)
  setting-target/          → Setting target tahunan
  api/                     → Route handler (CRUD ke database)
components/                → Sidebar, StatCard, Bar3DChart, StatusDonut, TrendChart
lib/
  inspectionForms.ts       → Konfigurasi 19 form + dasar hukum + checklist
  dashboard.ts             → Agregasi data untuk dashboard
  db.ts                    → Prisma client
prisma/
  schema.prisma            → Skema database
  seed.ts                  → Data contoh
```

## 6. Pengembangan Lanjutan (opsional)

- **Upload file fisik**: hubungkan `Vercel Blob` atau `Supabase Storage` di endpoint `app/api/upload-dokumen/route.ts`.
- **Autentikasi login**: tambahkan `next-auth` agar hanya user terdaftar yang bisa mengisi inspeksi.
- **Export PDF/Excel** hasil inspeksi: gunakan library seperti `exceljs` atau `pdf-lib` di route handler baru.
- **Notifikasi approval Lifting Plan**: integrasikan email/WhatsApp API saat status berubah.
