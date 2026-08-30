import Link from "next/link";
import { inspectionForms, categories } from "@/lib/inspectionForms";

const kategoriColor: Record<string, string> = {
  "APD": "bg-brand-greenLight text-brand-greenDark",
  "Tools & Equipment": "bg-brand-blueLight text-blue-700",
  "Lifting & Rigging": "bg-brand-purpleLight text-purple-700",
  "Environment": "bg-brand-orangeLight text-orange-700",
  "Listrik & Las": "bg-teal-50 text-teal-700",
  "Peralatan Emergency": "bg-yellow-50 text-yellow-700",
};

export default function FormInspeksiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">📝 Form Inspeksi</h1>
        <p className="text-sm text-brand-muted mt-1">
          Pilih jenis alat/area untuk mengisi checklist inspeksi K3 harian atau berkala.
        </p>
      </div>

      <div className="card p-4 sm:p-5 bg-brand-purpleLight/40 border-brand-purple/20 flex flex-wrap gap-3">
        <Link
          href="/lifting-plan"
          className="flex-1 min-w-[220px] bg-white rounded-xl p-4 shadow-card border border-brand-line hover:border-brand-purple transition-colors"
        >
          <p className="font-semibold text-brand-ink">🏗️ Pengajuan Lifting Plan</p>
          <p className="text-xs text-brand-muted mt-1">Ajukan rencana pekerjaan pengangkatan sebelum lifting dilakukan.</p>
        </Link>
        <Link
          href="/lifting-report"
          className="flex-1 min-w-[220px] bg-white rounded-xl p-4 shadow-card border border-brand-line hover:border-brand-purple transition-colors"
        >
          <p className="font-semibold text-brand-ink">📄 Lifting Report</p>
          <p className="text-xs text-brand-muted mt-1">Laporkan hasil pelaksanaan pekerjaan lifting yang telah disetujui.</p>
        </Link>
      </div>

      {categories.map((cat) => {
        const forms = inspectionForms.filter((f) => f.category === cat);
        if (forms.length === 0) return null;
        return (
          <div key={cat}>
            <h2 className="text-sm font-semibold text-brand-muted mb-2">{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {forms.map((f) => (
                <Link
                  key={f.slug}
                  href={`/form-inspeksi/${f.slug}`}
                  className="card p-4 hover:border-brand-green hover:shadow-md transition-all border border-brand-line"
                >
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${kategoriColor[cat]}`}>
                    {cat}
                  </span>
                  <p className="font-semibold text-brand-ink mt-2 leading-snug">{f.title}</p>
                  <p className="text-xs text-brand-muted mt-1 line-clamp-2">{f.deskripsi}</p>
                  <p className="text-[11px] text-brand-green font-medium mt-2">{f.items.length} item checklist →</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
