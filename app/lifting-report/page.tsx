"use client";

import { useEffect, useState } from "react";

type Plan = { id: string; nomorPengajuan: string; namaPekerjaan: string; lokasi: string };

export default function LiftingReportPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({
    liftingPlanId: "",
    tanggalPelaksanaan: new Date().toISOString().slice(0, 10),
    waktuMulai: "",
    waktuSelesai: "",
    kondisiCuaca: "Cerah",
    hasilPemeriksaanAlat: "",
    kejadianAbnormal: "",
    insidenTerjadi: false,
    deskripsiInsiden: "",
    disetujuiSupervisor: "",
    status: "SELESAI",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/lifting-plan")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []));
  }, []);

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/lifting-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal menyimpan");
      setDone(true);
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
        <p className="font-semibold">Lifting Report berhasil disimpan</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">📄 Lifting Report</h1>
        <p className="text-sm text-brand-muted mt-1">
          Laporan pelaksanaan pekerjaan lifting berdasarkan Lifting Plan yang sudah diajukan.
        </p>
      </div>

      {plans.length === 0 && (
        <div className="card p-4 text-sm text-yellow-700 bg-yellow-50 border-yellow-200">
          Belum ada Lifting Plan tersimpan. Silakan ajukan{" "}
          <a href="/lifting-plan" className="underline font-medium">Lifting Plan</a> terlebih dahulu.
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="card p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-brand-muted">Referensi Lifting Plan *</label>
            <select
              required
              value={form.liftingPlanId}
              onChange={(e) => set("liftingPlanId", e.target.value)}
              className="input"
            >
              <option value="">— Pilih Lifting Plan —</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomorPengajuan} — {p.namaPekerjaan} ({p.lokasi})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Tanggal Pelaksanaan *</label>
            <input required type="date" value={form.tanggalPelaksanaan} onChange={(e) => set("tanggalPelaksanaan", e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Kondisi Cuaca</label>
            <select value={form.kondisiCuaca} onChange={(e) => set("kondisiCuaca", e.target.value)} className="input">
              {["Cerah", "Berawan", "Hujan Ringan", "Hujan Lebat/Ditunda"].map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Waktu Mulai</label>
            <input type="time" value={form.waktuMulai} onChange={(e) => set("waktuMulai", e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Waktu Selesai</label>
            <input type="time" value={form.waktuSelesai} onChange={(e) => set("waktuSelesai", e.target.value)} className="input" />
          </div>
        </div>

        <div className="card p-4 sm:p-5 space-y-3">
          <div>
            <label className="text-xs font-medium text-brand-muted">Hasil Pemeriksaan Alat Sebelum Lifting (Pre-use) *</label>
            <textarea required rows={3} value={form.hasilPemeriksaanAlat} onChange={(e) => set("hasilPemeriksaanAlat", e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Kejadian Abnormal Selama Proses</label>
            <textarea rows={2} value={form.kejadianAbnormal} onChange={(e) => set("kejadianAbnormal", e.target.value)} className="input" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.insidenTerjadi} onChange={(e) => set("insidenTerjadi", e.target.checked)} />
            Terjadi insiden/kecelakaan saat pelaksanaan
          </label>
          {form.insidenTerjadi && (
            <textarea
              rows={2}
              placeholder="Deskripsikan insiden yang terjadi"
              value={form.deskripsiInsiden}
              onChange={(e) => set("deskripsiInsiden", e.target.value)}
              className="input"
            />
          )}
          <div>
            <label className="text-xs font-medium text-brand-muted">Status Pekerjaan</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input">
              {["SELESAI", "DIHENTIKAN", "TERTUNDA"].map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Disetujui Oleh Supervisor *</label>
            <input required value={form.disetujuiSupervisor} onChange={(e) => set("disetujuiSupervisor", e.target.value)} className="input" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={submitting} className="bg-brand-purple text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-60">
          {submitting ? "Menyimpan..." : "Simpan Lifting Report"}
        </button>
      </form>

      <style>{`.input { margin-top:4px; width:100%; border:1px solid #e5e7eb; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; }`}</style>
    </div>
  );
}
