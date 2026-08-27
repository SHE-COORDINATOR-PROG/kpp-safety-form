"use client";

import { useEffect, useState } from "react";

// Daftar ringkas (list) — TIDAK memuat foto/PDF (base64) supaya cepat.
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
  fotoUnitNama: string | null;
  dokumenPdfNama: string | null;
  createdAt: string;
  liftingReport: { id: string } | null;
};

// Detail lengkap — dipanggil hanya saat dibutuhkan (klik Export/Lihat PDF).
type PlanDetail = Plan & {
  fotoUnitBase64: string | null;
  dokumenPdfBase64: string | null;
};

const statusBadge: Record<string, string> = {
  MENUNGGU_PERSETUJUAN: "bg-yellow-50 text-yellow-700",
  DISETUJUI: "bg-brand-greenLight text-brand-greenDark",
  DITOLAK: "bg-red-50 text-red-600",
};

export default function RiwayatLiftingPlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/lifting-plan")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .finally(() => setLoading(false));
  }, []);

  async function getDetail(id: string): Promise<PlanDetail | null> {
    try {
      const res = await fetch(`/api/lifting-plan/${id}`);
      const j = await res.json();
      if (!res.ok) return null;
      return j.plan as PlanDetail;
    } catch {
      return null;
    }
  }

  async function handleLihatPdf(id: string) {
    setLoadingAction(id + "-pdf");
    const detail = await getDetail(id);
    setLoadingAction(null);
    if (!detail?.dokumenPdfBase64) return;
    // Ubah data URL jadi Blob supaya bisa dibuka di tab baru dengan andal.
    const res = await fetch(detail.dokumenPdfBase64);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  async function exportPdf(planListItem: Plan) {
    setLoadingAction(planListItem.id + "-export");
    const plan = await getDetail(planListItem.id);
    setLoadingAction(null);
    if (!plan) return;

    const win = window.open("", "_blank");
    if (!win) return;
    const origin = window.location.origin;
    const row = (label: string, value: string) => `<tr><td class="label">${label}</td><td class="value">${value}</td></tr>`;
    win.document.write(`
      <html>
        <head>
          <title>Lifting Plan ${plan.nomorPengajuan}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body { font-family: 'Times New Roman', serif; padding: 10px 16px; color: #111; font-size: 12px; }
            .header { position: relative; text-align: center; border-bottom: 3px solid #8b5cf6; padding-bottom: 6px; margin-bottom: 10px; min-height: 46px; }
            .header img { position: absolute; left: 0; top: 0; height: 42px; width: auto; }
            .company-name { font-size: 14px; font-weight: bold; line-height: 1.2; padding-top: 2px; }
            .company-sub { font-size: 10px; color: #555; }
            h1 { text-align: center; font-size: 15px; margin: 6px 0 2px; }
            .muted { text-align: center; color: #555; font-size: 11px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 6px; }
            td { border: 1px solid #000; padding: 4px 8px; font-size: 11.5px; vertical-align: top; }
            td.label { width: 38%; font-weight: bold; }
            td.value { color: #1a4fa0; font-weight: bold; }
            img.foto { max-width: 220px; margin-top: 8px; border: 1px solid #ccc; }
            .badge { display:inline-block; padding:2px 10px; border-radius:999px; font-size:10.5px; background:#e8f8ee; color:#0f7a37; }
            .lampiran-title { font-weight: bold; margin-top: 16px; font-size: 12px; }
            .pdf-chip { display:inline-block; margin-top:6px; padding:4px 10px; border:1px solid #999; border-radius:6px; font-size:11px; }
            .approval-row { display: flex; justify-content: space-around; margin-top: 32px; text-align: center; }
            .approval-col { width: 40%; font-size: 11.5px; }
            .approval-line { margin-top: 55px; border-top: 1px solid #000; padding-top: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${origin}/logos/kpp-mining.png" />
            <div class="company-name">KPP MINING</div>
            <div class="company-sub">Program Kerja Plant Safety</div>
          </div>
          <h1>PENGAJUAN LIFTING PLAN — ${plan.nomorPengajuan}</h1>
          <p class="muted">Dicetak ${new Date().toLocaleString("id-ID")}</p>
          <table>
            ${row("Nama Pekerjaan", plan.namaPekerjaan)}
            ${row("Lokasi", plan.lokasi)}
            ${row("Tanggal Rencana", new Date(plan.tanggalRencana).toLocaleDateString("id-ID"))}
            ${row("Jenis Alat Angkat", plan.jenisAlatAngkat)}
            ${row("Berat Beban", `${plan.bebanKg} kg`)}
            ${row("Kapasitas SWL", `${plan.swlKapasitasKg} kg`)}
            ${row("% Beban / SWL", `${plan.persenBeban ?? "-"}%`)}
            ${row("Operator", plan.operator)}
            ${row("Supervisor", plan.supervisor)}
            <tr><td class="label">Status</td><td><span class="badge">${plan.status.replace(/_/g, " ")}</span></td></tr>
          </table>

          <div class="lampiran-title">LAMPIRAN :</div>
          ${plan.fotoUnitBase64 ? `<p style="margin:6px 0 0; font-size:11px;">Foto Unit Alat Angkat:</p><img class="foto" src="${plan.fotoUnitBase64}" />` : `<p style="margin:6px 0 0; font-size:11px; color:#888;">Tidak ada foto unit yang diupload.</p>`}
          ${plan.dokumenPdfBase64 ? `<p style="margin:10px 0 0; font-size:11px;">Foto Dokumen Pendukung:</p><img class="foto" src="${plan.dokumenPdfBase64}" />` : ""}

          <div class="approval-row">
            <div class="approval-col">
              <div class="approval-line">${plan.supervisor}</div>
              Diajukan Oleh (Supervisor)
            </div>
            <div class="approval-col">
              <div class="approval-line">&nbsp;</div>
              Disetujui Oleh
            </div>
          </div>
          <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };</script>
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
                {p.fotoUnitNama && (
                  <span className="text-lg shrink-0" title={p.fotoUnitNama}>📷</span>
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
                {p.dokumenPdfNama && (
                  <button
                    onClick={() => handleLihatPdf(p.id)}
                    disabled={loadingAction === p.id + "-pdf"}
                    className="text-[11px] font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                  >
                    {loadingAction === p.id + "-pdf" ? "Memuat..." : "🖼️ Lihat Foto Dokumen"}
                  </button>
                )}
              </div>

              <button
                onClick={() => exportPdf(p)}
                disabled={loadingAction === p.id + "-export"}
                className="mt-3 text-xs font-medium text-brand-purple underline disabled:opacity-50"
              >
                {loadingAction === p.id + "-export" ? "Menyiapkan..." : "🖨️ Export / Cetak PDF"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
