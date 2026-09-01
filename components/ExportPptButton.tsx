"use client";

import { useState } from "react";
import type { K3PptData } from "@/lib/exportPpt";

export default function ExportPptButton({ data }: { data: K3PptData }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const { generateK3Ppt } = await import("@/lib/exportPpt");
      await generateK3Ppt(data);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat file PowerPoint. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="text-sm bg-brand-orange text-white px-4 py-2 rounded-lg font-medium disabled:opacity-60 flex items-center gap-1.5"
    >
      {loading ? "Membuat..." : "📊 Export PPT"}
    </button>
  );
}
