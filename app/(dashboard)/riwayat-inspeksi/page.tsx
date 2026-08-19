import { prisma } from "@/lib/db";

async function getRecords() {
  try {
    return await prisma.inspectionRecord.findMany({ orderBy: { tanggal: "desc" }, take: 100 });
  } catch {
    return [];
  }
}

const statusBadge: Record<string, string> = {
  BAIK: "bg-brand-greenLight text-brand-greenDark",
  PERLU_PERHATIAN: "bg-yellow-50 text-yellow-700",
  TIDAK_LAYAK: "bg-red-50 text-red-600",
};

export default async function RiwayatInspeksiPage() {
  const records = await getRecords();

  return (
    <div className="space-y-4">
      <h1 className="text-lg sm:text-xl font-bold">🔍 Riwayat Inspeksi</h1>
      <div className="card p-4 sm:p-5 overflow-x-auto">
        {records.length === 0 ? (
          <p className="text-sm text-brand-muted py-6 text-center">
            Belum ada data inspeksi. Isi salah satu{" "}
            <a href="/form-inspeksi" className="text-brand-green underline">Form Inspeksi</a> terlebih dahulu.
          </p>
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-brand-muted border-b border-brand-line">
                <th className="py-2 pr-3 font-medium">Tanggal</th>
                <th className="py-2 pr-3 font-medium">Form</th>
                <th className="py-2 pr-3 font-medium">Kategori</th>
                <th className="py-2 pr-3 font-medium">Unit/Lokasi</th>
                <th className="py-2 pr-3 font-medium">Inspektor</th>
                <th className="py-2 pr-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="py-2.5 pr-3">{new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="py-2.5 pr-3 font-medium">{r.formTitle}</td>
                  <td className="py-2.5 pr-3">{r.category}</td>
                  <td className="py-2.5 pr-3">{r.unitOrLokasi}</td>
                  <td className="py-2.5 pr-3">{r.inspector}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge[r.overallStatus]}`}>
                      {r.overallStatus.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
