// Generate file PowerPoint (.pptx) berisi ringkasan pencapaian K3,
// mengikuti filter periode (tahun/bulan) yang sedang aktif di Dashboard.
// Dijalankan sepenuhnya di browser (client-side), tidak perlu server.

type KategoriDatum = {
  kategori: string;
  target: number;
  sudahInspeksi: number;
  belumInspeksi: number;
};

export type K3PptData = {
  periodeLabel: string; // contoh: "Juli 2026" atau "Tahun 2026"
  totalProgram: number;
  programSelesai: number;
  pencapaianPersen: number;
  totalInspeksi: number;
  targetInspeksi: number;
  totalLiftingPlan: number;
  perKategori: KategoriDatum[];
  kategoriColor: Record<string, string>;
};

const BRAND = {
  green: "16A34A",
  greenDark: "0F7A37",
  blue: "3B82F6",
  purple: "8B5CF6",
  orange: "F97316",
  ink: "1F2937",
  muted: "6B7280",
  line: "E5E7EB",
  red: "DC2626",
};

export async function generateK3Ppt(data: K3PptData) {
  const pptxgenModule = await import("pptxgenjs");
  const pptxgen = pptxgenModule.default;
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";

  const origin = window.location.origin;
  const logos = [
    `${origin}/logos/kpp-mining.png`,
    `${origin}/logos/ciss.png`,
    `${origin}/logos/asto.png`,
    `${origin}/logos/plant-asto.jpeg`,
  ];

  // ===== Slide 1: Cover =====
  const s1 = pptx.addSlide();
  s1.background = { color: "FFFFFF" };
  let logoX = 0.5;
  for (const src of logos) {
    try {
      s1.addImage({ path: src, x: logoX, y: 0.4, h: 0.6, w: 0.6, sizing: { type: "contain", w: 1.1, h: 0.6 } });
    } catch {
      // kalau satu logo gagal dimuat, lanjut saja tanpa menghentikan proses
    }
    logoX += 1.3;
  }
  s1.addShape("rect", { x: 0, y: 3.0, w: 13.33, h: 0.06, fill: { color: BRAND.green } });
  s1.addText("LAPORAN PENCAPAIAN K3", {
    x: 0.5, y: 3.3, w: 12.3, h: 0.8, fontSize: 36, bold: true, color: BRAND.ink, fontFace: "Arial",
  });
  s1.addText("Program Kerja Plant Safety", {
    x: 0.5, y: 4.05, w: 12.3, h: 0.5, fontSize: 18, color: BRAND.muted, fontFace: "Arial",
  });
  s1.addText(`Periode: ${data.periodeLabel}`, {
    x: 0.5, y: 4.6, w: 12.3, h: 0.5, fontSize: 16, bold: true, color: BRAND.green, fontFace: "Arial",
  });
  s1.addText(`Dicetak ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`, {
    x: 0.5, y: 6.8, w: 12.3, h: 0.4, fontSize: 11, color: BRAND.muted, fontFace: "Arial",
  });

  // ===== Slide 2: Ringkasan Angka =====
  const s2 = pptx.addSlide();
  s2.background = { color: "FFFFFF" };
  s2.addText("Ringkasan Pencapaian", { x: 0.5, y: 0.35, w: 12, h: 0.6, fontSize: 26, bold: true, color: BRAND.ink, fontFace: "Arial" });
  s2.addShape("rect", { x: 0.5, y: 0.95, w: 1.2, h: 0.05, fill: { color: BRAND.green } });

  const cards: { label: string; value: string; hint: string; color: string }[] = [
    { label: "PROGRAM SELESAI", value: `${data.programSelesai}`, hint: `dari ${data.totalProgram} program`, color: BRAND.green },
    { label: "PENCAPAIAN", value: `${data.pencapaianPersen}%`, hint: "program + inspeksi", color: BRAND.blue },
    { label: "TOTAL INSPEKSI", value: `${data.totalInspeksi}`, hint: `target: ${data.targetInspeksi}`, color: BRAND.purple },
    { label: "LIFTING PLAN", value: `${data.totalLiftingPlan}`, hint: "pengajuan periode ini", color: BRAND.orange },
  ];
  const cardW = 2.9, gap = 0.3, startX = 0.5, cardY = 1.5, cardH = 1.9;
  cards.forEach((c, i) => {
    const x = startX + i * (cardW + gap);
    s2.addShape("roundRect", { x, y: cardY, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: c.color, transparency: 88 }, line: { color: c.color, width: 1 } });
    s2.addText(c.label, { x: x + 0.15, y: cardY + 0.15, w: cardW - 0.3, h: 0.35, fontSize: 10.5, bold: true, color: c.color, fontFace: "Arial" });
    s2.addText(c.value, { x: x + 0.15, y: cardY + 0.5, w: cardW - 0.3, h: 0.8, fontSize: 34, bold: true, color: BRAND.ink, fontFace: "Arial" });
    s2.addText(c.hint, { x: x + 0.15, y: cardY + 1.35, w: cardW - 0.3, h: 0.35, fontSize: 10, color: BRAND.muted, fontFace: "Arial" });
  });

  // Progress bar total
  const pbY = 4.0;
  s2.addText("Pencapaian Total", { x: 0.5, y: pbY, w: 4, h: 0.4, fontSize: 14, bold: true, color: BRAND.ink, fontFace: "Arial" });
  s2.addText(`${data.pencapaianPersen}%`, { x: 10.5, y: pbY, w: 2.3, h: 0.4, fontSize: 14, bold: true, color: BRAND.ink, align: "right", fontFace: "Arial" });
  s2.addShape("roundRect", { x: 0.5, y: pbY + 0.45, w: 12.3, h: 0.25, rectRadius: 0.12, fill: { color: "F0F0F0" }, line: { type: "none" } });
  const pbW = Math.max(0.2, (Math.min(100, data.pencapaianPersen) / 100) * 12.3);
  s2.addShape("roundRect", { x: 0.5, y: pbY + 0.45, w: pbW, h: 0.25, rectRadius: 0.12, fill: { color: BRAND.green }, line: { type: "none" } });

  // ===== Slide 3: Chart per kategori (native bar chart) =====
  const s3 = pptx.addSlide();
  s3.background = { color: "FFFFFF" };
  s3.addText("Pencapaian Inspeksi per Kategori", { x: 0.5, y: 0.35, w: 12, h: 0.6, fontSize: 24, bold: true, color: BRAND.ink, fontFace: "Arial" });

  const chartLabels = data.perKategori.map((k) => k.kategori);
  const chartData = [
    { name: "Sudah Inspeksi", labels: chartLabels, values: data.perKategori.map((k) => k.sudahInspeksi) },
    { name: "Belum Inspeksi", labels: chartLabels, values: data.perKategori.map((k) => k.belumInspeksi) },
  ];
  s3.addChart(pptx.ChartType.bar, chartData, {
    x: 0.5, y: 1.1, w: 12.3, h: 5.8,
    barDir: "col",
    chartColors: [BRAND.green, "D1D5DB"],
    showLegend: true,
    legendPos: "b",
    showValue: true,
    dataLabelFontSize: 10,
    catAxisLabelFontSize: 11,
    valAxisLabelFontSize: 11,
  });

  // ===== Slide 4: Ringkasan tabel per kategori =====
  const s4 = pptx.addSlide();
  s4.background = { color: "FFFFFF" };
  s4.addText("Ringkasan per Kategori", { x: 0.5, y: 0.35, w: 12, h: 0.6, fontSize: 24, bold: true, color: BRAND.ink, fontFace: "Arial" });

  const headerRow = ["Kategori", "Target", "Selesai", "Belum", "%", "Status"].map((t) => ({
    text: t,
    options: { bold: true, color: "FFFFFF", fill: { color: BRAND.green }, fontSize: 12, align: "center" as const },
  }));
  const bodyRows = data.perKategori.map((k) => {
    const pct = k.target > 0 ? Math.round((k.sudahInspeksi / k.target) * 100) : 0;
    const tercapai = pct >= 80;
    return [
      { text: k.kategori, options: { fontSize: 11.5, color: BRAND.ink } },
      { text: `${k.target}`, options: { fontSize: 11.5, align: "center" as const } },
      { text: `${k.sudahInspeksi}`, options: { fontSize: 11.5, align: "center" as const } },
      { text: `${k.belumInspeksi}`, options: { fontSize: 11.5, align: "center" as const } },
      { text: `${pct}%`, options: { fontSize: 11.5, align: "center" as const } },
      {
        text: tercapai ? "Tercapai" : "Kurang",
        options: {
          fontSize: 11, align: "center" as const, bold: true, color: "FFFFFF",
          fill: { color: tercapai ? BRAND.greenDark : BRAND.red },
        },
      },
    ];
  });
  s4.addTable([headerRow, ...bodyRows], {
    x: 0.5, y: 1.15, w: 12.3, h: 5.5,
    border: { type: "solid", color: BRAND.line, pt: 1 },
    autoPage: false,
    colW: [4.3, 1.6, 1.6, 1.6, 1.5, 1.7],
  });

  const fileName = `Laporan-K3-${data.periodeLabel.replace(/\s+/g, "-")}.pptx`;
  await pptx.writeFile({ fileName });
}
