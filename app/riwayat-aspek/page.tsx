import { getDashboardData } from "@/lib/dashboard";
import { inspectionForms } from "@/lib/inspectionForms";

export default async function RiwayatAspekPage() {
  const data = await getDashboardData(new Date().getFullYear());

  return (
    <div className="space-y-4">
      <h1 className="text-lg sm:text-xl font-bold">📋 Riwayat Aspek</h1>
      <p className="text-sm text-brand-muted -mt-3">
        Rekap jenis alat/aspek yang tercakup dalam program inspeksi K3, dikelompokkan per kategori.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {data.perKategori.map((k) => {
          const forms = inspectionForms.filter((f) => f.category === k.kategori);
          return (
            <div key={k.kategori} className="card p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-ink">{k.kategori}</h3>
                <span className="text-xs bg-brand-greenLight text-brand-greenDark px-2 py-1 rounded-full font-medium">
                  {k.sudahInspeksi}/{k.target} alat
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {forms.map((f) => (
                  <li key={f.slug} className="text-sm text-brand-muted flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                    {f.title}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
