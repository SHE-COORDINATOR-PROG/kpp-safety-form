import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const swl = Number(b.swlKapasitasKg) || 0;
    const beban = Number(b.bebanKg) || 0;
    const persenBeban = swl > 0 ? Math.round((beban / swl) * 1000) / 10 : null;

    const plan = await prisma.liftingPlan.create({
      data: {
        nomorPengajuan: `LP-${Date.now()}`,
        namaPekerjaan: b.namaPekerjaan,
        lokasi: b.lokasi,
        tanggalRencana: new Date(b.tanggalRencana),
        jenisAlatAngkat: b.jenisAlatAngkat,
        bebanKg: beban,
        radiusMeter: b.radiusMeter ? Number(b.radiusMeter) : null,
        swlKapasitasKg: swl,
        persenBeban,
        riggingPlan: b.riggingPlan || null,
        operator: b.operator,
        rigger: b.rigger || null,
        signalman: b.signalman || null,
        supervisor: b.supervisor,
        jsaTerlampir: !!b.jsaTerlampir,
        sertifikatOperator: !!b.sertifikatOperator,
        sertifikatAlat: !!b.sertifikatAlat,
      },
    });
    return NextResponse.json({ ok: true, plan });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menyimpan lifting plan. Cek koneksi database." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const plans = await prisma.liftingPlan.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    return NextResponse.json({ plans });
  } catch {
    return NextResponse.json({ plans: [] });
  }
}
