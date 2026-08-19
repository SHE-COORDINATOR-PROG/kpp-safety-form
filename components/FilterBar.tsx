"use client";

import { useRouter, useSearchParams } from "next/navigation";

const bulanList = [
  "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const tahun = sp.get("tahun") || String(new Date().getFullYear());
  const bulan = sp.get("bulan") || "Semua Bulan";

  function update(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    params.set(key, value);
    router.push(`/?${params.toString()}`);
  }

  function reset() {
    router.push("/");
  }

  return (
    <div className="card p-4 flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-brand-muted flex items-center gap-1.5">
        📅 Periode:
      </span>
      <select
        value={bulan}
        onChange={(e) => update("bulan", e.target.value)}
        className="text-sm border border-brand-line rounded-lg px-3 py-1.5 bg-white"
      >
        {bulanList.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>
      <select
        value={tahun}
        onChange={(e) => update("tahun", e.target.value)}
        className="text-sm border border-brand-line rounded-lg px-3 py-1.5 bg-white"
      >
        {[2024, 2025, 2026, 2027].map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <button
        onClick={reset}
        className="text-sm border border-brand-line rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50"
      >
        Reset
      </button>
      <button
        onClick={() => update("tahun", String(new Date().getFullYear()))}
        className="text-sm rounded-lg px-3 py-1.5 bg-brand-greenLight text-brand-greenDark font-medium"
      >
        Tahun {new Date().getFullYear()}
      </button>
    </div>
  );
}
