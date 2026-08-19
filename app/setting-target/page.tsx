"use client";

import { useEffect, useState } from "react";
import { categories } from "@/lib/inspectionForms";

export default function SettingTargetPage() {
  const tahun = new Date().getFullYear();
  const [values, setValues] = useState<Record<string, { targetProgram: string; targetInspeksi: string }>>(
    Object.fromEntries(categories.map((c) => [c, { targetProgram: "1", targetInspeksi: "2" }]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch(`/api/setting-target?tahun=${tahun}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.targets?.length) return;
        setValues((prev) => {
          const next = { ...prev };
          for (const t of d.targets) {
            next[t.kategori] = {
              targetProgram: String(t.targetProgram),
              targetInspeksi: String(t.targetInspeksi),
            };
          }
          return next;
        });
      });
  }, []);

  async function saveOne(kategori: string) {
    setSaving(kategori);
    setSavedMsg("");
    try {
      await fetch("/api/setting-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tahun, kategori, ...values[kategori] }),
      });
      setSavedMsg(`Target ${kategori} tersimpan`);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-lg sm:text-xl font-bold">⚙️ Setting Target ({tahun})</h1>
      <p className="text-sm text-brand-muted -mt-2">
        Tentukan target jumlah program dan inspeksi per kategori untuk tahun berjalan.
      </p>
      {savedMsg && <p className="text-sm text-brand-green">{savedMsg}</p>}

      <div className="card divide-y divide-gray-100">
        {categories.map((c) => (
          <div key={c} className="p-4 sm:p-5 grid sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <p className="text-sm font-medium">{c}</p>
            </div>
            <div>
              <label className="text-[11px] text-brand-muted">Target Program</label>
              <input
                type="number"
                value={values[c].targetProgram}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [c]: { ...v[c], targetProgram: e.target.value } }))
                }
                className="w-full mt-1 border border-brand-line rounded-lg px-2.5 py-1.5 text-sm"
              />
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-[11px] text-brand-muted">Target Inspeksi</label>
                <input
                  type="number"
                  value={values[c].targetInspeksi}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [c]: { ...v[c], targetInspeksi: e.target.value } }))
                  }
                  className="w-full mt-1 border border-brand-line rounded-lg px-2.5 py-1.5 text-sm"
                />
              </div>
              <button
                onClick={() => saveOne(c)}
                disabled={saving === c}
                className="text-xs bg-brand-green text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-60"
              >
                {saving === c ? "..." : "Simpan"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
