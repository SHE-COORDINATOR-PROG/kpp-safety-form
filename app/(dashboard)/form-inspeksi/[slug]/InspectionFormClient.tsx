"use client";

import { useState } from "react";
import type { InspectionFormConfig } from "@/lib/inspectionForms";

type Hasil = "BAIK" | "PERLU_PERHATIAN" | "TIDAK_ADA";

const hasilLabel: Record<Hasil, string> = {
  BAIK: "Baik",
  PERLU_PERHATIAN: "Perlu Perhatian",
  TIDAK_ADA: "Tidak Layak / Tidak Ada",
};

const hasilColor: Record<Hasil, string> = {
  BAIK: "text-brand-greenDark",
  PERLU_PERHATIAN: "text-yellow-700",
  TIDAK_ADA: "text-red-600",
};

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
            className="input"
            placeholder="Contoh: Forklift FL-02 / Area Workshop"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-muted">Nomor Aset (opsional)</label>
          <input
            value={nomorAset}
            onChange={(e) => setNomorAset(e.target.value)}
            className="input"
            placeholder="Contoh: AST-00123"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-muted">Nama Inspektor</label>
          <input
            required
            value={inspector}
            onChange={(e) => setInspector(e.target.value)}
            className="input"
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
            className="input"
          />
        </div>
      </div>

      <div className="card p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-semibold">Checklist Pemeriksaan</h3>
        {items.map((it, idx) => (
          <div key={it.no} className="border border-brand-line rounded-xl p-3 sm:p-4">
            <p className="text-sm font-medium text-brand-ink">
              {it.no}. {it.pertanyaan}
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2.5">
              <div>
                <label className="text-[11px] font-medium text-brand-muted">Hasil Pemeriksaan</label>
                <select
                  value={it.hasil}
                  onChange={(e) => updateItem(idx, { hasil: e.target.value as Hasil })}
                  className={`input font-medium ${hasilColor[it.hasil]}`}
                >
                  {(Object.keys(hasilLabel) as Hasil[]).map((h) => (
                    <option key={h} value={h}>{hasilLabel[h]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-brand-muted">
                  Catatan Temuan {it.hasil !== "BAIK" && <span className="text-red-500">*</span>}
                </label>
                <input
                  required={it.hasil !== "BAIK"}
                  value={it.catatan}
                  onChange={(e) => updateItem(idx, { catatan: e.target.value })}
                  placeholder={it.hasil === "BAIK" ? "Opsional" : "Wajib diisi"}
                  className="input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 sm:p-5">
        <label className="text-xs font-medium text-brand-muted">Catatan Umum</label>
        <textarea
          value={catatanUmum}
          onChange={(e) => setCatatanUmum(e.target.value)}
          rows={3}
          className="input"
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

      <style>{`.input { margin-top:4px; width:100%; border:1px solid #e5e7eb; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; background:#fff; }`}</style>
    </form>
  );
}
