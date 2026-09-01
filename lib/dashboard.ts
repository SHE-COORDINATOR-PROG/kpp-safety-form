import { prisma } from "@/lib/db";
import { inspectionForms, categories } from "@/lib/inspectionForms";

export const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function bulanNameToIndex(nama: string | undefined): number | null {
  if (!nama || nama === "Semua Bulan") return null;
  const idx = namaBulan.findIndex((b) => b.toLowerCase() === nama.toLowerCase());
  return idx === -1 ? null : idx;
}

// bulanIndex: 0-11 (Januari=0). Jika null/undefined -> tampilkan data 1 tahun penuh.
export async function getDashboardData(tahun: number, bulanIndex?: number | null) {
  const totalTarget = inspectionForms.length;
  const emptyResult = {
    totalProgram: totalTarget,
    programSelesai: 0,
    totalInspeksi: 0,
    totalLiftingPlan: 0,
    targetInspeksi: totalTarget * 2,
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
      targetProgram: Math.round(totalTarget / 12),
      targetInspeksi: Math.round((totalTarget * 2) / 12),
      sudahInspeksi: 0,
      belumInspeksi: Math.round((totalTarget * 2) / 12),
    })),
  };

  try {
    // Rentang untuk query utama: kalau bulan dipilih, persempit ke bulan itu saja;
    // kalau tidak, pakai 1 tahun penuh (dipakai juga untuk chart per-bulan/tren).
    const yearStart = new Date(tahun, 0, 1);
    const yearEnd = new Date(tahun + 1, 0, 1);
    const hasBulanFilter = bulanIndex !== null && bulanIndex !== undefined;
    const rangeStart = hasBulanFilter ? new Date(tahun, bulanIndex as number, 1) : yearStart;
    const rangeEnd = hasBulanFilter ? new Date(tahun, (bulanIndex as number) + 1, 1) : yearEnd;

    const [recordsInRange, recordsFullYear, totalLiftingPlan] = await Promise.all([
      prisma.inspectionRecord.findMany({
        where: { tanggal: { gte: rangeStart, lt: rangeEnd } },
        select: { formSlug: true, category: true, tanggal: true },
      }),
      // tetap ambil data 1 tahun penuh untuk chart tren bulanan, supaya konteks tahunan tidak hilang
      prisma.inspectionRecord.findMany({
        where: { tanggal: { gte: yearStart, lt: yearEnd } },
        select: { formSlug: true, category: true, tanggal: true },
      }),
      prisma.liftingPlan.count({ where: { tanggalRencana: { gte: rangeStart, lt: rangeEnd } } }),
    ]);

    const distinctSlugsInspected = new Set(recordsInRange.map((r) => r.formSlug));

    const perKategori = categories.map((c) => {
      const formsInCategory = inspectionForms.filter((f) => f.category === c);
      const target = formsInCategory.length;
      const slugsInCategoryInspected = new Set(
        recordsInRange.filter((r) => r.category === c).map((r) => r.formSlug)
      );
      const sudahInspeksi = slugsInCategoryInspected.size;
      return {
        kategori: c,
        target,
        sudahInspeksi,
        belumInspeksi: Math.max(0, target - sudahInspeksi),
      };
    });

    // Chart per-bulan: kalau ada filter bulan aktif, bulan lain ditampilkan 0
    // supaya keseluruhan dashboard konsisten mengikuti filter yang dipilih.
    const perBulan = namaBulan.map((b, idx) => {
      const targetInspeksiBulanan = Math.round((totalTarget * 2) / 12);
      if (hasBulanFilter && idx !== bulanIndex) {
        return {
          bulan: b.slice(0, 3),
          program: 0,
          inspeksi: 0,
          targetProgram: Math.round(totalTarget / 12),
          targetInspeksi: targetInspeksiBulanan,
          sudahInspeksi: 0,
          belumInspeksi: 0,
        };
      }
      const recordsBulan = recordsFullYear.filter((r) => r.tanggal.getMonth() === idx);
      return {
        bulan: b.slice(0, 3),
        program: new Set(recordsBulan.map((r) => r.formSlug)).size,
        inspeksi: recordsBulan.length,
        targetProgram: Math.round(totalTarget / 12),
        targetInspeksi: targetInspeksiBulanan,
        sudahInspeksi: recordsBulan.length,
        belumInspeksi: Math.max(0, targetInspeksiBulanan - recordsBulan.length),
      };
    });

    const totalProgram = totalTarget;
    const programSelesai = distinctSlugsInspected.size;
    const totalInspeksi = recordsInRange.length;
    const targetInspeksiTahunan = totalTarget * 2;
    const targetInspeksi = hasBulanFilter ? Math.round(targetInspeksiTahunan / 12) : targetInspeksiTahunan;
    const pencapaianPersen = Math.round(
      ((programSelesai / totalProgram) * 0.5 + (Math.min(totalInspeksi, targetInspeksi) / Math.max(targetInspeksi, 1)) * 0.5) * 100
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
    console.error("Gagal mengambil data dashboard:", err);
    return emptyResult;
  }
}
