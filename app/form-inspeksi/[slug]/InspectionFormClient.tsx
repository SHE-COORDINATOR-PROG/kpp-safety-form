"use client";

import { useState } from "react";
import type { InspectionFormConfig } from "@/lib/inspectionForms";

type Hasil = "BAIK" | "PERLU_PERHATIAN" | "TIDAK_ADA";

const hasilOptions: { value: Hasil; label: string; className: string }[] = [
  { value: "BAIK", label: "Baik", className: "peer-checked:bg-brand-green peer-checked:text-white" },
  { value: "PERLU_PERHATIAN", label: "Perlu Perhatian", className: "peer-checked:bg-yellow-500 peer-checked:text-white" },
  { value: "TIDAK_ADA", label: "Tidak Layak / Tidak Ada", className: "peer-checked:bg-red-500 peer-checked:text-white" },
];

export default function InspectionFormClient({ form }: { form: InspectionFormConfig }) {
  const [unitOrLokasi, setUnitOrLokasi] = useState("");
  const [nomorAset, setNomorAset] = useState("");
  const [inspector, setInspector] = useState("");
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [catatanUmum, setCatatanUmum] = useState("");
  const [items, setItems] = useState(
    form.items.map((i) => ({ no: i.no, pertanyaan: i.pertanyaan, hasil: "BAIK" as Hasil, catatan: "" }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function updateItem(idx: number, patch: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/inspeksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formSlug: form.slug,
          unitOrLokasi,
          nomorAset,
          inspector,
          tanggal,
          catatanUmum,
          items,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Gagal menyimpan");
      }
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card p-6 text-center">
        <p className="text-3xl mb-2">✅</p>
        <p className="font-semibold text-brand-ink">Inspeksi berhasil disimpan</p>
        <p className="text-sm text-brand-muted mt-1">Data {form.title} telah tercatat pada riwayat inspeksi.</p>
        <button
          onClick={() => {
            setDone(false);
            setItems(form.items.map((i) => ({ no: i.no, pertanyaan: i.pertanyaan, hasil: "BAIK", catatan: "" })));
            setUnitOrLokasi("");
            setNomorAset("");
            setCatatanUmum("");
          }}
          className="mt-4 text-sm bg-brand-green text-white px-4 py-2 rounded-lg font-medium"
        >
          Isi Inspeksi Baru
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="card p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-brand-muted">Unit / Lokasi yang diperiksa</label>
          <input
            required
            value={unitOrLokasi}
            onChange={(e) => setUnitOrLokasi(e.target.value)}
            className="mt-1 w-full border border-brand-line rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: Forklift FL-02 / Area Workshop"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-muted">Nomor Aset (opsional)</label>
          <input
            value={nomorAset}
            onChange={(e) => setNomorAset(e.target.value)}
            className="mt-1 w-full border border-brand-line rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: AST-00123"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-muted">Nama Inspektor</label>
          <input
            required
            value={inspector}
            onChange={(e) => setInspector(e.target.value)}
            className="mt-1 w-full border border-brand-line rounded-lg px-3 py-2 text-sm"
            placeholder="Nama petugas"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-muted">Tanggal Inspeksi</label>
          <input
            required
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="mt-1 w-full border border-brand-line rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="card p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold">Checklist Pemeriksaan</h3>
        {items.map((it, idx) => (
          <div key={it.no} className="border-b border-gray-100 pb-3 last:border-0">
            <p className="text-sm font-medium text-brand-ink">
              {it.no}. {it.pertanyaan}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {hasilOptions.map((opt) => (
                <label key={opt.value} className="cursor-pointer">
                  <input
                    type="radio"
                    className="peer sr-only"
                    name={`hasil-${idx}`}
                    checked={it.hasil === opt.value}
                    onChange={() => updateItem(idx, { hasil: opt.value })}
                  />
                  <span
                    className={`inline-block text-xs px-3 py-1.5 rounded-full border border-brand-line text-brand-muted ${opt.className}`}
                  >
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            {it.hasil !== "BAIK" && (
              <input
                value={it.catatan}
                onChange={(e) => updateItem(idx, { catatan: e.target.value })}
                placeholder="Catatan temuan (wajib jika bukan Baik)"
                className="mt-2 w-full border border-brand-line rounded-lg px-3 py-1.5 text-xs"
              />
            )}
          </div>
        ))}
      </div>

      <div className="card p-4 sm:p-5">
        <label className="text-xs font-medium text-brand-muted">Catatan Umum</label>
        <textarea
          value={catatanUmum}
          onChange={(e) => setCatatanUmum(e.target.value)}
          rows={3}
          className="mt-1 w-full border border-brand-line rounded-lg px-3 py-2 text-sm"
          placeholder="Rekomendasi atau tindak lanjut..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        disabled={submitting}
        className="w-full sm:w-auto bg-brand-green text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-60"
      >
        {submitting ? "Menyimpan..." : "Simpan Inspeksi"}
      </button>
    </form>
  );
}
