import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const report = await prisma.liftingReport.create({
      data: {
        liftingPlanId: b.liftingPlanId,
        tanggalPelaksanaan: new Date(b.tanggalPelaksanaan),
        waktuMulai: b.waktuMulai || null,
        waktuSelesai: b.waktuSelesai || null,
        kondisiCuaca: b.kondisiCuaca || null,
        hasilPemeriksaanAlat: b.hasilPemeriksaanAlat,
        kejadianAbnormal: b.kejadianAbnormal || null,
        insidenTerjadi: !!b.insidenTerjadi,
        deskripsiInsiden: b.deskripsiInsiden || null,
        disetujuiSupervisor: b.disetujuiSupervisor,
        status: b.status || "SELESAI",
      },
    });
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menyimpan lifting report. Pastikan Lifting Plan ID valid." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reports = await prisma.liftingReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { liftingPlan: true },
    });
    return NextResponse.json({ reports });
  } catch {
    return NextResponse.json({ reports: [] });
  }
}
