"use client";

import { useEffect, useState } from "react";
import { kodeLimbahOptions, getJumlahLimbahOptions, getJumlahKemasanOptions, getHariIndo } from "@/lib/limbahB3";

const MAX_FILE_MB = 4;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function LimbahB3Form() {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    tanggal: today,
    lokasiTps: "PT.KPP - Workshop 25",
    rencanaMulai: today,
    rencanaSelesai: today,
    kodeLimbah: kodeLimbahOptions[0],
    tanggalDihasilkanMulai: today,
    tanggalDihasilkanSelesai: today,
    jumlahLimbahKeluar: getJumlahLimbahOptions(kodeLimbahOptions[0])[0],
    jumlahKemasan: getJumlahKemasanOptions(kodeLimbahOptions[0])[0],
    perusahaanPengangkut: "PT. WGI",
    nomorManifest: "",
    nomorKendaraan: "",
    catatan: "",
    actualTanggalPengambilan: "",
    actualJumlah: "",
  });

  const jumlahLimbahOptions = getJumlahLimbahOptions(form.kodeLimbah);
  const jumlahKemasanOptions = getJumlahKemasanOptions(form.kodeLimbah);

  // Saat jenis limbah berganti, reset pilihan jumlah limbah & kemasan
  // supaya tidak menyisakan nilai dari kategori sebelumnya yang sudah tidak relevan.
  useEffect(() => {
    setForm((f) => ({
      ...f,
      jumlahLimbahKeluar: getJumlahLimbahOptions(f.kodeLimbah)[0],
      jumlahKemasan: getJumlahKemasanOptions(f.kodeLimbah)[0],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.kodeLimbah]);

  const [ttdFoto, setTtdFoto] = useState<{ name: string; base64: string } | null>(null);
  const [lampiranFoto, setLampiranFoto] = useState<{ name: string; base64: string } | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>, target: "ttd" | "lampiran") {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError("");
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`Ukuran foto maksimal ${MAX_FILE_MB}MB.`);
      return;
    }
    const base64 = await fileToBase64(file);
    if (target === "ttd") setTtdFoto({ name: file.name, base64 });
    else setLampiranFoto({ name: file.name, base64 });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/limbah-b3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hari: getHariIndo(form.tanggal),
          ttdFotoBase64: ttdFoto?.base64 || null,
          ttdFotoNama: ttdFoto?.name || null,
          lampiranFotoBase64: lampiranFoto?.base64 || null,
          lampiranFotoNama: lampiranFoto?.name || null,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal menyimpan");
      setDone(j.record.nomorForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto card p-6 text-center">
        <p className="text-3xl mb-2">✅</p>
        <p className="font-semibold">Pengajuan Limbah B3 berhasil dikirim</p>
        <p className="text-sm text-brand-muted mt-1">Nomor Form: <b>{done}</b></p>
        <a href="/riwayat-limbah-b3" className="inline-block mt-4 text-sm bg-brand-green text-white px-4 py-2 rounded-lg font-medium">
          Lihat Riwayat Pengajuan
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">♻️ Form Pengajuan Pengambilan Limbah B3</h1>
        <p className="text-sm text-brand-muted mt-1">
          Diisi untuk mengajukan pengambilan limbah Bahan Berbahaya dan Beracun (B3) dari TPS,
          mengacu pada PP No. 22 Tahun 2021 dan Permen LHK No. P.12/2020.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="card p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
          <Field label="Tanggal" required>
            <input required type="date" value={form.tanggal} onChange={(e) => set("tanggal", e.target.value)} className="input" />
            <p className="text-[11px] text-brand-muted mt-1">Hari: <b>{getHariIndo(form.tanggal)}</b></p>
          </Field>
          <Field label="Lokasi TPS Limbah B3">
            <input value={form.lokasiTps} disabled className="input bg-gray-50 text-brand-muted" />
          </Field>
          <Field label="Rencana Tanggal Pengambilan — Mulai" required>
            <input required type="date" value={form.rencanaMulai} onChange={(e) => set("rencanaMulai", e.target.value)} className="input" />
          </Field>
          <Field label="Rencana Tanggal Pengambilan — s/d Selesai" required>
            <input required type="date" value={form.rencanaSelesai} onChange={(e) => set("rencanaSelesai", e.target.value)} className="input" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Kode Limbah / Jenis Limbah" required>
              <select value={form.kodeLimbah} onChange={(e) => set("kodeLimbah", e.target.value)} className="input">
                {kodeLimbahOptions.map((v) => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tanggal Dihasilkan — Dari" required>
            <input required type="date" value={form.tanggalDihasilkanMulai} onChange={(e) => set("tanggalDihasilkanMulai", e.target.value)} className="input" />
          </Field>
          <Field label="Tanggal Dihasilkan — Sampai" required>
            <input required type="date" value={form.tanggalDihasilkanSelesai} onChange={(e) => set("tanggalDihasilkanSelesai", e.target.value)} className="input" />
          </Field>
          <Field label="Masa Simpan Limbah (Sesuai Izin)">
            <input value="90 Hari" disabled className="input bg-gray-50 text-brand-muted" />
          </Field>
          <Field label="Jumlah Limbah yang Dikeluarkan" required>
            <select value={form.jumlahLimbahKeluar} onChange={(e) => set("jumlahLimbahKeluar", e.target.value)} className="input">
              {jumlahLimbahOptions.map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Jumlah Kemasan" required>
            <select value={form.jumlahKemasan} onChange={(e) => set("jumlahKemasan", e.target.value)} className="input">
              {jumlahKemasanOptions.map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Perusahaan Pengangkut">
            <input value={form.perusahaanPengangkut} disabled className="input bg-gray-50 text-brand-muted" />
          </Field>
          <Field label="Nomor Manifest (opsional)">
            <input value={form.nomorManifest} onChange={(e) => set("nomorManifest", e.target.value)} className="input" />
          </Field>
          <Field label="Nomor Kendaraan (opsional)">
            <input value={form.nomorKendaraan} onChange={(e) => set("nomorKendaraan", e.target.value)} className="input" />
          </Field>
        </div>

        <div className="card p-4 sm:p-5 space-y-3">
          <p className="text-sm font-semibold">Catatan & Realisasi (opsional, boleh diisi belakangan)</p>
          <Field label="Catatan">
            <textarea rows={2} value={form.catatan} onChange={(e) => set("catatan", e.target.value)} className="input" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Actual Tanggal Pengambilan">
              <input type="date" value={form.actualTanggalPengambilan} onChange={(e) => set("actualTanggalPengambilan", e.target.value)} className="input" />
            </Field>
            <Field label="Jumlah Aktual">
              <input value={form.actualJumlah} onChange={(e) => set("actualJumlah", e.target.value)} className="input" placeholder="Contoh: 0,432 Ton" />
            </Field>
          </div>
        </div>

        <div className="card p-4 sm:p-5 space-y-3">
          <p className="text-sm font-semibold">Lampiran</p>
          <Field label="Upload Foto TTD (Tanda Tangan Penghasil)">
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, "ttd")} className="input" />
            {ttdFoto && (
              <div className="mt-2 flex items-center gap-3">
                <img src={ttdFoto.base64} alt={ttdFoto.name} className="h-14 w-24 object-contain rounded-lg border border-brand-line bg-white" />
                <span className="text-xs text-brand-muted">{ttdFoto.name}</span>
              </div>
            )}
          </Field>
          <Field label="Upload Foto Lampiran (Tabel Masuk/Keluar TPS)">
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, "lampiran")} className="input" />
            {lampiranFoto && (
              <div className="mt-2 flex items-center gap-3">
                <img src={lampiranFoto.base64} alt={lampiranFoto.name} className="h-14 w-24 object-cover rounded-lg border border-brand-line" />
                <span className="text-xs text-brand-muted">{lampiranFoto.name}</span>
              </div>
            )}
          </Field>
          {fileError && <p className="text-xs text-red-600">{fileError}</p>}
          <p className="text-[11px] text-brand-muted">Maksimal {MAX_FILE_MB}MB per foto.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={submitting} className="bg-brand-green text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-60">
          {submitting ? "Mengirim..." : "Ajukan Pengambilan Limbah B3"}
        </button>
      </form>

      <style>{`.input { margin-top:4px; width:100%; border:1px solid #e5e7eb; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; background:#fff; }`}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-brand-muted">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
