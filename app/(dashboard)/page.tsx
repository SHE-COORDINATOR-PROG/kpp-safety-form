import FilterBar from "@/components/FilterBar";
import StatCard from "@/components/StatCard";
import Bar3DChart from "@/components/Bar3DChart";
import StatusDonut from "@/components/StatusDonut";
import TrendChart from "@/components/TrendChart";
import ExportPptButton from "@/components/ExportPptButton";
import { getDashboardData, bulanNameToIndex, namaBulan } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

const kategoriColor: Record<string, string> = {
  "APD": "#16a34a",
  "Tools & Equipment": "#3b82f6",
  "Lifting & Rigging": "#8b5cf6",
  "Environment": "#f97316",
  "Listrik & Las": "#14b8a6",
  "Peralatan Emergency": "#f5b301",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tahun?: string; bulan?: string };
}) {
  const tahun = Number(searchParams.tahun) || new Date().getFullYear();
  const bulanIndex = bulanNameToIndex(searchParams.bulan);
  const data = await getDashboardData(tahun, bulanIndex);
  const periodeLabel = bulanIndex !== null ? `${namaBulan[bulanIndex]} ${tahun}` : `Tahun ${tahun}`;

  const donutData = data.perKategori.map((k) => ({
    name: k.kategori,
    value: Math.max(k.sudahInspeksi, 0.0001),
    color: kategoriColor[k.kategori] || "#999",
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green inline-block" />
          Program Kerja Plant Safety
        </h1>
        <div className="flex items-center gap-2">
          <ExportPptButton
            data={{
              periodeLabel,
              totalProgram: data.totalProgram,
              programSelesai: data.programSelesai,
              pencapaianPersen: data.pencapaianPersen,
              totalInspeksi: data.totalInspeksi,
              targetInspeksi: data.targetInspeksi,
              totalLiftingPlan: data.totalLiftingPlan,
              perKategori: data.perKategori,
              kategoriColor,
            }}
          />
          <button className="text-sm bg-brand-green text-white px-4 py-2 rounded-lg font-medium">
            ⟳ Sync
          </button>
        </div>
      </div>

      <FilterBar />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Program Selesai"
          value={`${data.programSelesai}`}
          hint={`dari ${data.totalProgram} program`}
          tone="green"
        />
        <StatCard
          label="Pencapaian"
          value={`${data.pencapaianPersen}%`}
          hint="program + inspeksi"
          tone="blue"
        />
        <StatCard
          label="Total Inspeksi"
          value={`${data.totalInspeksi}`}
          hint={`target: ${data.targetInspeksi}`}
          tone="purple"
        />
        <StatCard
          label="Lifting Plan"
          value={`${data.totalLiftingPlan}`}
          hint="pengajuan tahun ini"
          tone="orange"
        />
      </div>

      {/* Progress bar total */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            📈 Pencapaian Total
          </h3>
          <span className="font-bold text-brand-ink">{data.pencapaianPersen}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full"
            style={{ width: `${Math.min(100, data.pencapaianPersen)}%` }}
          />
        </div>
        <p className="text-xs text-brand-muted mt-2">
          Filter: {bulanIndex !== null ? `${searchParams.bulan} ` : ""}Tahun {tahun} | Program: {data.programSelesai}/{data.totalProgram} | Inspeksi: {data.totalInspeksi}
        </p>
      </div>

      {/* Chart 3D per kategori + status donut */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4 sm:p-5">
          <Bar3DChart
            title="Pencapaian Inspeksi per Kategori"
            data={data.perKategori.map((k) => ({
              label: k.kategori,
              sudahInspeksi: k.sudahInspeksi,
              belumInspeksi: k.belumInspeksi,
              color: kategoriColor[k.kategori] || "#3b82f6",
            }))}
          />
        </div>
        <div className="card p-4 sm:p-5">
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">🧭 Status per Kategori</h3>
          <StatusDonut data={donutData} />
        </div>
      </div>

      {/* Chart 3D per bulan + tren aktivitas */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4 sm:p-5">
          <Bar3DChart
            title="Pencapaian Inspeksi per Bulan"
            data={data.perBulan.map((b) => ({
              label: b.bulan,
              sudahInspeksi: b.sudahInspeksi,
              belumInspeksi: b.belumInspeksi,
              color: "#16a34a",
            }))}
          />
        </div>
        <div className="card p-4 sm:p-5">
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">📈 Tren Aktivitas</h3>
          <TrendChart data={data.perBulan.map((b) => ({
            bulan: b.bulan,
            program: b.program,
            inspeksi: b.inspeksi,
            targetProgram: b.targetProgram,
            targetInspeksi: b.targetInspeksi,
          }))} />
        </div>
      </div>

      {/* Ringkasan per kategori */}
      <div className="card p-4 sm:p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">📋 Ringkasan per Kategori</h3>
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-brand-muted border-b border-brand-line">
              <th className="py-2 pr-3 font-medium">Kategori</th>
              <th className="py-2 pr-3 font-medium">Target</th>
              <th className="py-2 pr-3 font-medium">Selesai</th>
              <th className="py-2 pr-3 font-medium">Belum</th>
              <th className="py-2 pr-3 font-medium">%</th>
              <th className="py-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.perKategori.map((k) => {
              const pct = k.target > 0 ? Math.round((k.sudahInspeksi / k.target) * 100) : 0;
              const tercapai = pct >= 80;
              return (
                <tr key={k.kategori} className="border-b border-gray-50">
                  <td className="py-2.5 pr-3 font-medium">{k.kategori}</td>
                  <td className="py-2.5 pr-3">{k.target}</td>
                  <td className="py-2.5 pr-3">{k.sudahInspeksi}</td>
                  <td className="py-2.5 pr-3">{k.belumInspeksi}</td>
                  <td className="py-2.5 pr-3">{pct}%</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        tercapai ? "bg-brand-greenLight text-brand-greenDark" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {tercapai ? "✓ Tercapai" : "✕ Kurang"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
