"use client";

import { useEffect, useState } from "react";

type Manifest = {
  id: string;
  namaFile: string;
  nomorManifest: string | null;
  keterangan: string | null;
  uploadedBy: string | null;
  createdAt: string;
};

export default function RiwayatManifestB3Page() {
  const [records, setRecords] = useState<Manifest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function loadData() {
    setLoading(true);
    fetch("/api/manifest-b3")
      .then((r) => r.json())
      .then((d) => setRecords(d.records || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleLihat(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/manifest-b3/${id}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      const blobRes = await fetch(j.record.fileBase64);
      const blob = await blobRes.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      alert("Gagal membuka file.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleHapus(id: string) {
    if (!confirm("Hapus manifest ini?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/manifest-b3/${id}`, { method: "DELETE" });
      loadData();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">🗂️ Riwayat Manifest Limbah B3</h1>
        <p className="text-sm text-brand-muted mt-1">
          Semua dokumen manifest yang pernah diupload.{" "}
          <a href="/import-manifest-b3" className="text-brand-green underline">Upload baru</a>
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-brand-muted">Memuat data...</p>
      ) : records.length === 0 ? (
        <div className="card p-6 text-center text-sm text-brand-muted">Belum ada manifest yang diupload.</div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {records.map((m) => (
            <div key={m.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-brand-ink flex items-center gap-2">📄 {m.namaFile}</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  {m.nomorManifest ? `No. ${m.nomorManifest} · ` : ""}
                  {new Date(m.createdAt).toLocaleDateString("id-ID")}
                  {m.uploadedBy ? ` · oleh ${m.uploadedBy}` : ""}
                </p>
                {m.keterangan && <p className="text-xs text-brand-muted mt-0.5">{m.keterangan}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLihat(m.id)}
                  disabled={busyId === m.id}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-greenLight text-brand-greenDark disabled:opacity-50"
                >
                  {busyId === m.id ? "Memuat..." : "Lihat PDF"}
                </button>
                <button
                  onClick={() => handleHapus(m.id)}
                  disabled={busyId === m.id}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
