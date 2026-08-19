"use client";

import { useState } from "react";

export default function LiftingPlanPage() {
  const [form, setForm] = useState({
    namaPekerjaan: "",
    lokasi: "",
    tanggalRencana: new Date().toISOString().slice(0, 10),
    jenisAlatAngkat: "Mobile Crane",
    bebanKg: "",
    radiusMeter: "",
    swlKapasitasKg: "",
    riggingPlan: "",
    operator: "",
    rigger: "",
    signalman: "",
    supervisor: "",
    jsaTerlampir: false,
    sertifikatOperator: false,
    sertifikatAlat: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const persen =
    Number(form.swlKapasitasKg) > 0
      ? Math.round((Number(form.bebanKg || 0) / Number(form.swlKapasitasKg)) * 1000) / 10
      : null;

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/lifting-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal menyimpan");
      setDone(j.plan.nomorPengajuan);
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
        <p className="font-semibold">Pengajuan Lifting Plan berhasil dikirim</p>
        <p className="text-sm text-brand-muted mt-1">Nomor pengajuan: <b>{done}</b></p>
        <p className="text-xs text-brand-muted mt-1">Status: Menunggu Persetujuan Supervisor</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">🏗️ Pengajuan Lifting Plan</h1>
        <p className="text-sm text-brand-muted mt-1">
          Wajib diisi sebelum pelaksanaan pekerjaan pengangkatan (lifting), mengacu pada
          Permenaker No. 8 Tahun 2020 tentang K3 Pesawat Angkat dan Angkut serta UU No. 1 Tahun 1970.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="card p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
          <Field label="Nama Pekerjaan" required>
            <input required value={form.namaPekerjaan} onChange={(e) => set("namaPekerjaan", e.target.value)} className="input" />
          </Field>
          <Field label="Lokasi" required>
            <input required value={form.lokasi} onChange={(e) => set("lokasi", e.target.value)} className="input" />
          </Field>
          <Field label="Tanggal Rencana" required>
            <input required type="date" value={form.tanggalRencana} onChange={(e) => set("tanggalRencana", e.target.value)} className="input" />
          </Field>
          <Field label="Jenis Alat Angkat">
            <select value={form.jenisAlatAngkat} onChange={(e) => set("jenisAlatAngkat", e.target.value)} className="input">
              {["Mobile Crane", "Crane Truck", "Overhead Crane", "Telehandler", "Forklift"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Berat Beban (kg)" required>
            <input required type="number" value={form.bebanKg} onChange={(e) => set("bebanKg", e.target.value)} className="input" />
          </Field>
          <Field label="Radius Angkat (meter)">
            <input type="number" value={form.radiusMeter} onChange={(e) => set("radiusMeter", e.target.value)} className="input" />
          </Field>
          <Field label="Kapasitas SWL Alat (kg)" required>
            <input required type="number" value={form.swlKapasitasKg} onChange={(e) => set("swlKapasitasKg", e.target.value)} className="input" />
          </Field>
          <Field label="% Beban terhadap SWL">
            <div className={`input flex items-center font-semibold ${persen && persen > 80 ? "text-red-600" : "text-brand-greenDark"}`}>
              {persen !== null ? `${persen}%` : "-"}
            </div>
          </Field>
        </div>

        <div className="card p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
          <Field label="Operator" required>
            <input required value={form.operator} onChange={(e) => set("operator", e.target.value)} className="input" />
          </Field>
          <Field label="Rigger">
            <input value={form.rigger} onChange={(e) => set("rigger", e.target.value)} className="input" />
          </Field>
          <Field label="Signalman">
            <input value={form.signalman} onChange={(e) => set("signalman", e.target.value)} className="input" />
          </Field>
          <Field label="Supervisor Penanggung Jawab" required>
            <input required value={form.supervisor} onChange={(e) => set("supervisor", e.target.value)} className="input" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Metode Rigging / Alat Bantu Angkat">
              <textarea rows={3} value={form.riggingPlan} onChange={(e) => set("riggingPlan", e.target.value)} className="input" />
            </Field>
          </div>
        </div>

        <div className="card p-4 sm:p-5 space-y-2">
          <p className="text-sm font-semibold mb-1">Kelengkapan Dokumen</p>
          {[
            ["jsaTerlampir", "JSA (Job Safety Analysis) terlampir"],
            ["sertifikatOperator", "Sertifikat/SIO operator masih berlaku"],
            ["sertifikatAlat", "Sertifikat/SIA alat angkat masih berlaku"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(form as any)[key]}
                onChange={(e) => set(key as any, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={submitting} className="bg-brand-purple text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-60">
          {submitting ? "Mengirim..." : "Ajukan Lifting Plan"}
        </button>
      </form>

      <style>{`.input { margin-top:4px; width:100%; border:1px solid #e5e7eb; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; }`}</style>
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
