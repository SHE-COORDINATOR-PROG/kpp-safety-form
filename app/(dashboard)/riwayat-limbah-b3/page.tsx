"use client";

import { useEffect, useState } from "react";
import { formatTanggalIndo } from "@/lib/limbahB3";

// Daftar ringkas — tanpa foto (base64) supaya cepat dimuat.
type Req = {
  id: string;
  nomorForm: string;
  nomorRegister: number;
  hari: string;
  tanggal: string;
  lokasiTps: string;
  rencanaMulai: string;
  rencanaSelesai: string;
  kodeLimbah: string;
  tanggalDihasilkanMulai: string;
  tanggalDihasilkanSelesai: string;
  masaSimpanHari: number;
  jumlahLimbahKeluar: string;
  jumlahKemasan: string;
  perusahaanPengangkut: string;
  nomorManifest: string | null;
  nomorKendaraan: string | null;
  catatan: string | null;
  actualTanggalPengambilan: string | null;
  actualJumlah: string | null;
  ttdFotoNama: string | null;
  lampiranFotoNama: string | null;
  status: string;
};

// Detail lengkap dengan foto — diambil hanya saat Export diklik.
type ReqDetail = Req & {
  ttdFotoBase64: string | null;
  lampiranFotoBase64: string | null;
};

export default function RiwayatLimbahB3Page() {
  const [records, setRecords] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/limbah-b3")
      .then((r) => r.json())
      .then((d) => setRecords(d.records || []))
      .finally(() => setLoading(false));
  }, []);

  async function exportPdf(item: Req) {
    setExportingId(item.id);
    let r: ReqDetail = item as ReqDetail;
    try {
      const res = await fetch(`/api/limbah-b3/${item.id}`);
      const j = await res.json();
      if (res.ok) r = j.record;
    } finally {
      setExportingId(null);
    }

    const win = window.open("", "_blank");
    if (!win) return;
    const origin = window.location.origin;
    const row = (label: string, value: string) => `
      <tr><td class="label">${label}</td><td class="value">${value}</td></tr>
    `;
    win.document.write(`
      <html>
        <head>
          <title>${r.nomorForm}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body { font-family: 'Times New Roman', serif; padding: 10px 16px; color: #111; font-size: 12px; }
            .header { position: relative; text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 6px; margin-bottom: 8px; min-height: 46px; }
            .header img { position: absolute; left: 0; top: 0; height: 44px; width: auto; }
            .company-name { font-size: 15px; font-weight: bold; line-height: 1.2; padding-top: 2px; }
            .company-sub { font-size: 10px; color: #555; }
            .no-form { border: 1px solid #000; position: absolute; right: 0; top: 0; padding: 3px 10px; font-size: 10px; font-weight: bold; }
            h1 { text-align: center; font-size: 15px; margin: 6px 0 1px; }
            h2 { text-align: center; font-size: 12px; margin: 0 0 10px; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; margin-top: 6px; }
            td { border: 1px solid #000; padding: 3px 8px; font-size: 11.5px; }
            td.label { width: 38%; font-weight: bold; }
            td.value { color: #1a4fa0; font-weight: bold; }
            .catatan-box { border: 1px solid #000; border-top: none; padding: 14px 10px; font-size: 11.5px; min-height: 24px; }
            .catatan-title { border: 1px solid #000; border-bottom: none; text-align: center; font-weight: bold; padding: 3px; font-size: 11.5px; }
            .ttd-row { display: flex; justify-content: space-between; margin-top: 18px; text-align: center; }
            .ttd-col { width: 30%; font-size: 11px; }
            .ttd-col img { max-height: 50px; margin-bottom: 4px; }
            .ttd-line { margin-top: 4px; font-weight: bold; }
            .lampiran-title { font-weight: bold; margin-top: 14px; font-size: 11.5px; }
            .lampiran-title img { display: block; max-width: 100%; max-height: 260px; object-fit: contain; margin-top: 6px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${origin}/logos/asmin-bara-bronang.png" />
            <div class="company-name">PT ASMIN BARA BRONANG</div>
            <div class="company-sub">Program Kerja Plant Safety</div>
            <div class="no-form">NO FORM<br/>${r.nomorForm}</div>
          </div>
          <h1>FORM PENGAJUAN PENGAMBILAN LIMBAH B3</h1>
          <h2>Reg. ${String(r.nomorRegister).padStart(3, "0")}</h2>
          <table>
            ${row("HARI", r.hari)}
            ${row("TANGGAL", formatTanggalIndo(r.tanggal))}
            ${row("LOKASI TPS LIMBAH B3 :", r.lokasiTps)}
            ${row("RENCANA TANGGAL PENGAMBILAN :", `${formatTanggalIndo(r.rencanaMulai)}  s/d  ${formatTanggalIndo(r.rencanaSelesai)}`)}
            ${row("KODE LIMBAH/JENIS LIMBAH :", r.kodeLimbah)}
            ${row("TANGGAL DIHASILKAN :", `${formatTanggalIndo(r.tanggalDihasilkanMulai)} - ${formatTanggalIndo(r.tanggalDihasilkanSelesai)}`)}
            ${row("MASA SIMPAN LIMBAH (SESUAI IJIN) :", `${r.masaSimpanHari} Hari`)}
            ${row("JUMLAH LIMBAH YANG DIKELUARKAN :", r.jumlahLimbahKeluar)}
            ${row("JUMLAH KEMASAN :", r.jumlahKemasan)}
            ${row("PERUSAHAAN PENGANGKUT :", r.perusahaanPengangkut)}
            ${row("NOMOR MANIFEST :", r.nomorManifest || "-")}
            ${row("NOMOR KENDARAAN :", r.nomorKendaraan || "-")}
          </table>
          <div class="catatan-title">CATATAN</div>
          <div class="catatan-box">${r.catatan || ""}</div>
          <table>
            ${row("Actual tanggal pengambilan :", r.actualTanggalPengambilan ? formatTanggalIndo(r.actualTanggalPengambilan) : "-")}
            ${row("Jumlah :", r.actualJumlah || "-")}
          </table>

          <div class="ttd-row">
            <div class="ttd-col">
              ${r.ttdFotoBase64 ? `<img src="${r.ttdFotoBase64}" />` : ""}
              <div class="ttd-line">____________________</div>
              (PENGHASIL)
            </div>
            <div class="ttd-col">
              <div style="height:50px;"></div>
              <div class="ttd-line">____________________</div>
              (PENGANGKUT)
            </div>
            <div class="ttd-col">
              <div style="height:50px;"></div>
              <div class="ttd-line">____________________</div>
              (VALIDATOR)
            </div>
          </div>

          ${r.lampiranFotoBase64 ? `<div class="lampiran-title">LAMPIRAN :<img src="${r.lampiranFotoBase64}" /></div>` : ""}

          <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };</script>
        </body>
      </html>
    `);
    win.document.close();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold">♻️ Riwayat Pengajuan Limbah B3</h1>
        <p className="text-sm text-brand-muted mt-1">
          Semua pengajuan pengambilan limbah B3 yang pernah dibuat.{" "}
          <a href="/pengajuan-limbah-b3" className="text-brand-green underline">Ajukan baru</a>
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-brand-muted">Memuat data...</p>
      ) : records.length === 0 ? (
        <div className="card p-6 text-center text-sm text-brand-muted">
          Belum ada pengajuan Limbah B3.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {records.map((r) => (
            <div key={r.id} className="card p-4 sm:p-5">
              <p className="text-[11px] font-semibold text-brand-green">{r.nomorForm}</p>
              <p className="font-semibold text-brand-ink mt-0.5">{r.kodeLimbah}</p>
              <p className="text-xs text-brand-muted mt-0.5">
                {r.hari}, {formatTanggalIndo(r.tanggal)} · {r.lokasiTps}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div><span className="text-brand-muted">Rencana Ambil:</span> {formatTanggalIndo(r.rencanaMulai)} - {formatTanggalIndo(r.rencanaSelesai)}</div>
                <div><span className="text-brand-muted">Jumlah:</span> {r.jumlahLimbahKeluar}</div>
                <div><span className="text-brand-muted">Kemasan:</span> {r.jumlahKemasan}</div>
                <div><span className="text-brand-muted">Pengangkut:</span> {r.perusahaanPengangkut}</div>
              </div>
              <button
                onClick={() => exportPdf(r)}
                disabled={exportingId === r.id}
                className="mt-3 text-xs font-medium text-brand-green underline disabled:opacity-50"
              >
                {exportingId === r.id ? "Menyiapkan..." : "🖨️ Export / Cetak PDF"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
