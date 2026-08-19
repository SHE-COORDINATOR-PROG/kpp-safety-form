"use client";

import { useState } from "react";
import { categories } from "@/lib/inspectionForms";

export default function UploadDokumenPage() {
  const [form, setForm] = useState({
    kategori: categories[0] as string,
    namaFile: "",
    bulan: String(new Date().getMonth() + 1),
    tahun: String(new Date().getFullYear()),
    uploadedBy: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/upload-dokumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <h1 className="text-lg sm:text-xl font-bold">✅ Upload Dokumen Program</h1>
      <p className="text-sm text-brand-muted -mt-3">
        Catat bukti dokumen pelaksanaan program kerja (mis. berita acara, foto kegiatan, sertifikat).
      </p>

      {done ? (
        <div className="card p-6 text-center">
          <p className="text-3xl mb-2">✅</p>
          <p className="font-semibold">Dokumen tercatat</p>
          <button onClick={() => setDone(false)} className="mt-3 text-sm text-brand-green underline">
            Upload dokumen lain
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="card p-4 sm:p-5 space-y-3">
          <div>
            <label className="text-xs font-medium text-brand-muted">Kategori Program</label>
            <select
              value={form.kategori}
              onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
              className="input"
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Nama File / Judul Dokumen</label>
            <input
              required
              value={form.namaFile}
              onChange={(e) => setForm((f) => ({ ...f, namaFile: e.target.value }))}
              className="input"
              placeholder="Contoh: BA Inspeksi Forklift Januari.pdf"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-brand-muted">Bulan</label>
              <select value={form.bulan} onChange={(e) => setForm((f) => ({ ...f, bulan: e.target.value }))} className="input">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-brand-muted">Tahun</label>
              <input type="number" value={form.tahun} onChange={(e) => setForm((f) => ({ ...f, tahun: e.target.value }))} className="input" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Diupload oleh</label>
            <input required value={form.uploadedBy} onChange={(e) => setForm((f) => ({ ...f, uploadedBy: e.target.value }))} className="input" />
          </div>
          <p className="text-[11px] text-brand-muted">
            Catatan: versi ini mencatat metadata dokumen. Untuk penyimpanan file fisik, hubungkan layanan
            storage seperti Vercel Blob atau Supabase Storage (lihat README bagian pengembangan lanjutan).
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} className="bg-brand-green text-white px-5 py-2 rounded-lg font-medium disabled:opacity-60">
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      )}
      <style>{`.input { margin-top:4px; width:100%; border:1px solid #e5e7eb; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; }`}</style>
    </div>
  );
}
