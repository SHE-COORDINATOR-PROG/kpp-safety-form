import { prisma } from "@/lib/db";

async function getDocs() {
  try {
    return await prisma.uploadedDocument.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    return [];
  }
}

export default async function RiwayatUploadPage() {
  const docs = await getDocs();
  return (
    <div className="space-y-4">
      <h1 className="text-lg sm:text-xl font-bold">🕓 Riwayat Upload</h1>
      <div className="card p-4 sm:p-5 overflow-x-auto">
        {docs.length === 0 ? (
          <p className="text-sm text-brand-muted py-6 text-center">Belum ada dokumen yang diupload.</p>
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-brand-muted border-b border-brand-line">
                <th className="py-2 pr-3 font-medium">Tanggal</th>
                <th className="py-2 pr-3 font-medium">Kategori</th>
                <th className="py-2 pr-3 font-medium">Nama File</th>
                <th className="py-2 pr-3 font-medium">Periode</th>
                <th className="py-2 pr-3 font-medium">Diupload Oleh</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b border-gray-50">
                  <td className="py-2.5 pr-3">{new Date(d.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="py-2.5 pr-3">{d.kategori}</td>
                  <td className="py-2.5 pr-3 font-medium">{d.namaFile}</td>
                  <td className="py-2.5 pr-3">{d.bulan}/{d.tahun}</td>
                  <td className="py-2.5 pr-3">{d.uploadedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
