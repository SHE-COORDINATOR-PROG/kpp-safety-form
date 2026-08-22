"use client";

import { useEffect, useState } from "react";

type Plan = {
  id: string;
  nomorPengajuan: string;
  namaPekerjaan: string;
  lokasi: string;
  tanggalRencana: string;
  jenisAlatAngkat: string;
  bebanKg: number;
  swlKapasitasKg: number;
  persenBeban: number | null;
  operator: string;
  supervisor: string;
  status: string;
  fotoUnitBase64: string | null;
  dokumenPdfBase64: string | null;
  dokumenPdfNama: string | null;
  createdAt: string;
  liftingReport: { id: string } | null;
};

const statusBadge: Record<string, string> = {
  MENUNGGU_PERSETUJUAN: "bg-yellow-50 text-yellow-700",
  DISETUJUI: "bg-brand-greenLight text-brand-greenDark",
  DITOLAK: "bg-red-50 text-red-600",
};

export default function RiwayatLiftingPlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lifting-plan")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .finally(() => setLoading(false));
  }, []);

  function exportPdf(plan: Plan) {
    const win = window.open("", "_blank");
    if (!win) return;
    const origin = window.location.origin;
    win.document.write(`
      <html>
        <head>
          <title>Lifting Plan ${plan.nomorPengajuan}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #1f2937; }
            .header { position: relative; text-align: center; border-bottom: 3px solid #8b5cf6; padding-bottom: 6px; margin-bottom: 14px; min-height: 46px; }
            .header img { position: absolute; left: 0; top: 0; height: 42px; width: auto; }
            .header .company-name { font-size: 14px; font-weight: bold; line-height: 1.2; padding-top: 2px; }
            .header .company-sub { font-size: 10px; color: #6b7280; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            .muted { color: #6b7280; font-size: 12px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; vertical-align: top; }
            td.label { color: #6b7280; width: 220px; }
            img.foto { max-width: 240px; margin-top: 10px; border-radius: 8px; }
            .badge { display:inline-block; padding:3px 10px; border-radius:999px; font-size:11px; background:#e8f8ee; color:#0f7a37; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${origin}/logos/kpp-mining.png" />
            <div class="company-name">KPP MINING</div>
            <div class="company-sub">Program Kerja Plant Safety</div>
          </div>
          <h1>Pengajuan Lifting Plan — ${plan.nomorPengajuan}</h1>
          <p class="muted">Dicetak ${new Date().toLocaleString("id-ID")}</p>
          <table>
            <tr><td class="label">Nama Pekerjaan</td><td>${plan.namaPekerjaan}</td></tr>
            <tr><td class="label">Lokasi</td><td>${plan.lokasi}</td></tr>
            <tr><td class="label">Tanggal Rencana</td><td>${new Date(plan.tanggalRencana).toLocaleDateString("id-ID")}</td></tr>
            <tr><td class="label">Jenis Alat Angkat</td><td>${plan.jenisAlatAngkat}</td></tr>
            <tr><td class="label">Berat Beban</td><td>${plan.bebanKg} kg</td></tr>
            <tr><td class="label">Kapasitas SWL</td><td>${plan.swlKapasitasKg} kg</td></tr>
            <tr><td class="label">% Beban / SWL</td><td>${plan.persenBeban ?? "-"}%</td></tr>
            <tr><td class="label">Operator</td><td>${plan.operator}</td></tr>
            <tr><td class="label">Supervisor</td><td>${plan.supervisor}</td></tr>
            <tr><td class="label">Status</td><td><span class="badge">${plan.status.replace(/_/g, " ")}</span></td></tr>
          </table>
          ${plan.fotoUnitBase64 ? `<p class="muted" style="margin-top:16px;">Foto Unit:</p><img class="foto" src="${plan.fotoUnitBase64}" />` : ""}
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">📚 Riwayat Lifting Plan</h1>
        <p className="text-sm text-brand-muted mt-1">Semua pengajuan Lifting Plan yang pernah dibuat, termasuk yang dikirim lewat link publik.</p>
      </div>

      {loading ? (
        <p className="text-sm text-brand-muted">Memuat data...</p>
      ) : plans.length === 0 ? (
        <div className="card p-6 text-center text-sm text-brand-muted">
          Belum ada pengajuan Lifting Plan. <a href="/lifting-plan" className="text-brand-purple underline">Ajukan sekarang</a>.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold text-brand-purple">{p.nomorPengajuan}</p>
                  <p className="font-semibold text-brand-ink mt-0.5">{p.namaPekerjaan}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{p.lokasi} · {p.jenisAlatAngkat}</p>
                </div>
                {p.fotoUnitBase64 && (
                  <img src={p.fotoUnitBase64} alt="foto unit" className="w-14 h-14 rounded-lg object-cover border border-brand-line shrink-0" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div><span className="text-brand-muted">Tanggal:</span> {new Date(p.tanggalRencana).toLocaleDateString("id-ID")}</div>
                <div><span className="text-brand-muted">Beban:</span> {p.bebanKg}kg / {p.swlKapasitasKg}kg ({p.persenBeban ?? "-"}%)</div>
                <div><span className="text-brand-muted">Operator:</span> {p.operator}</div>
                <div><span className="text-brand-muted">Supervisor:</span> {p.supervisor}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${statusBadge[p.status] || "bg-gray-100 text-gray-600"}`}>
                  {p.status.replace(/_/g, " ")}
                </span>
                {p.liftingReport ? (
                  <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-brand-blueLight text-blue-700">
                    Report tersedia
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                    Belum ada report
                  </span>
                )}
                {p.dokumenPdfBase64 && (
                  <a
                    href={p.dokumenPdfBase64}
                    download={p.dokumenPdfNama || "dokumen.pdf"}
                    className="text-[11px] font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    📄 Lihat PDF
                  </a>
                )}
              </div>

              <button
                onClick={() => exportPdf(p)}
                className="mt-3 text-xs font-medium text-brand-purple underline"
              >
                🖨️ Export / Cetak PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
