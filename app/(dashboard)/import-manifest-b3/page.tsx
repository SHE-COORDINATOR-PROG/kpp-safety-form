"use client";

import { useRef, useState } from "react";

const MAX_FILE_MB = 3;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImportManifestB3Page() {
  const [file, setFile] = useState<{ name: string; base64: string } | null>(null);
  const [nomorManifest, setNomorManifest] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(f: File | undefined) {
    setError("");
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("File harus berformat PDF.");
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${MAX_FILE_MB}MB.`);
      return;
    }
    const base64 = await fileToBase64(f);
    setFile({ name: f.name, base64 });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Silakan pilih atau drag file manifest PDF terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/manifest-b3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaFile: file.name,
          fileBase64: file.base64,
          nomorManifest,
          keterangan,
          uploadedBy,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal mengupload");
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto card p-6 text-center">
        <p className="text-3xl mb-2">✅</p>
        <p className="font-semibold">Manifest B3 berhasil diupload</p>
        <div className="flex gap-2 justify-center mt-4">
          <a href="/riwayat-manifest-b3" className="text-sm bg-brand-green text-white px-4 py-2 rounded-lg font-medium">
            Lihat Riwayat Manifest
          </a>
          <button
            onClick={() => {
              setDone(false);
              setFile(null);
              setNomorManifest("");
              setKeterangan("");
            }}
            className="text-sm border border-brand-line px-4 py-2 rounded-lg font-medium"
          >
            Upload Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">📥 Import Manifest Limbah B3</h1>
        <p className="text-sm text-brand-muted mt-1">
          Upload dokumen manifest (bukti serah terima resmi) limbah B3 dalam format PDF.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`card p-8 text-center cursor-pointer border-2 border-dashed transition-colors ${
            dragOver ? "border-brand-green bg-brand-greenLight" : "border-brand-line"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => processFile(e.target.files?.[0])}
          />
          {file ? (
            <div>
              <p className="text-3xl mb-2">📄</p>
              <p className="font-medium text-brand-ink">{file.name}</p>
              <p className="text-xs text-brand-muted mt-1">Klik atau drag file lain untuk mengganti</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl mb-2">⬆️</p>
              <p className="font-medium text-brand-ink">Drag & drop file PDF manifest di sini</p>
              <p className="text-xs text-brand-muted mt-1">atau klik untuk memilih file (maks. {MAX_FILE_MB}MB)</p>
            </div>
          )}
        </div>

        <div className="card p-4 sm:p-5 space-y-3">
          <div>
            <label className="text-xs font-medium text-brand-muted">Nomor Manifest (opsional)</label>
            <input value={nomorManifest} onChange={(e) => setNomorManifest(e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Keterangan (opsional)</label>
            <textarea rows={2} value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted">Diupload Oleh</label>
            <input value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} className="input" placeholder="Nama Anda" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={submitting} className="bg-brand-green text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-60">
          {submitting ? "Mengupload..." : "Upload Manifest"}
        </button>
      </form>

      <style>{`.input { margin-top:4px; width:100%; border:1px solid #e5e7eb; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; background:#fff; }`}</style>
    </div>
  );
}
