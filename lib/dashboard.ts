import { prisma } from "@/lib/db";
import { inspectionForms, categories } from "@/lib/inspectionForms";

const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export async function getDashboardData(tahun: number) {
  const emptyResult = {
    totalProgram: inspectionForms.length,
    programSelesai: 0,
    totalInspeksi: 0,
    totalLiftingPlan: 0,
    targetInspeksi: inspectionForms.length * 2,
    pencapaianPersen: 0,
    perKategori: categories.map((c) => ({
      kategori: c,
      target: inspectionForms.filter((f) => f.category === c).length,
      sudahInspeksi: 0,
      belumInspeksi: inspectionForms.filter((f) => f.category === c).length,
    })),
    perBulan: namaBulan.map((b) => ({
      bulan: b.slice(0, 3),
      program: 0,
      inspeksi: 0,
      upload: 0,
      targetProgram: Math.round(inspectionForms.length / 12),
      targetInspeksi: Math.round((inspectionForms.length * 2) / 12),
      sudahInspeksi: 0,
      belumInspeksi: Math.round((inspectionForms.length * 2) / 12),
    })),
  };

  try {
    const start = new Date(tahun, 0, 1);
    const end = new Date(tahun + 1, 0, 1);

    const [records, totalLiftingPlan] = await Promise.all([
      prisma.inspectionRecord.findMany({
        where: { tanggal: { gte: start, lt: end } },
        select: { formSlug: true, category: true, tanggal: true },
      }),
      prisma.liftingPlan.count({ where: { tanggalRencana: { gte: start, lt: end } } }),
    ]);

    const distinctSlugsInspected = new Set(records.map((r) => r.formSlug));

    const perKategori = categories.map((c) => {
      const formsInCategory = inspectionForms.filter((f) => f.category === c);
      const target = formsInCategory.length;
      const slugsInCategoryInspected = new Set(
        records.filter((r) => r.category === c).map((r) => r.formSlug)
      );
      const sudahInspeksi = slugsInCategoryInspected.size;
      return {
        kategori: c,
        target,
        sudahInspeksi,
        belumInspeksi: Math.max(0, target - sudahInspeksi),
      };
    });

    const perBulan = namaBulan.map((b, idx) => {
      const recordsBulan = records.filter((r) => r.tanggal.getMonth() === idx);
      const targetInspeksiBulanan = Math.round((inspectionForms.length * 2) / 12);
      return {
        bulan: b.slice(0, 3),
        program: new Set(recordsBulan.map((r) => r.formSlug)).size,
        inspeksi: recordsBulan.length,
        upload: 0,
        targetProgram: Math.round(inspectionForms.length / 12),
        targetInspeksi: targetInspeksiBulanan,
        sudahInspeksi: recordsBulan.length,
        belumInspeksi: Math.max(0, targetInspeksiBulanan - recordsBulan.length),
      };
    });

    const totalProgram = inspectionForms.length;
    const programSelesai = distinctSlugsInspected.size;
    const totalInspeksi = records.length;
    const targetInspeksi = inspectionForms.length * 2; // asumsi target 2x inspeksi/tahun per alat
    const pencapaianPersen = Math.round(
      ((programSelesai / totalProgram) * 0.5 + (Math.min(totalInspeksi, targetInspeksi) / targetInspeksi) * 0.5) * 100
    );

    return {
      totalProgram,
      programSelesai,
      totalInspeksi,
      totalLiftingPlan,
      targetInspeksi,
      pencapaianPersen: isFinite(pencapaianPersen) ? pencapaianPersen : 0,
      perKategori,
      perBulan,
    };
  } catch (err) {
    // Database belum terhubung (mis. saat development awal tanpa Neon) —
    // tampilkan struktur kosong supaya UI tetap render tanpa error.
    console.error("Gagal mengambil data dashboard:", err);
    return emptyResult;
  }
}
