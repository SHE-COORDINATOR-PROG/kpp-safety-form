import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();

    const tanggal = new Date(b.tanggal);
    const mm = String(tanggal.getMonth() + 1).padStart(2, "0");
    const yy = String(tanggal.getFullYear()).slice(-2);

    const totalCount = await prisma.wasteB3Request.count();
    const nomorRegister = totalCount + 1;
    const nomorForm = `LB3-${mm}${yy}-${String(nomorRegister).padStart(3, "0")}`;

    const record = await prisma.wasteB3Request.create({
      data: {
        nomorForm,
        nomorRegister,
        hari: b.hari,
        tanggal,
        lokasiTps: b.lokasiTps || "PT.KPP - Workshop 25",
        rencanaMulai: new Date(b.rencanaMulai),
        rencanaSelesai: new Date(b.rencanaSelesai),
        kodeLimbah: b.kodeLimbah,
        tanggalDihasilkanMulai: new Date(b.tanggalDihasilkanMulai),
        tanggalDihasilkanSelesai: new Date(b.tanggalDihasilkanSelesai),
        jumlahLimbahKeluar: b.jumlahLimbahKeluar,
        jumlahKemasan: b.jumlahKemasan,
        perusahaanPengangkut: b.perusahaanPengangkut || "PT. WGI",
        nomorManifest: b.nomorManifest || null,
        nomorKendaraan: b.nomorKendaraan || null,
        catatan: b.catatan || null,
        actualTanggalPengambilan: b.actualTanggalPengambilan ? new Date(b.actualTanggalPengambilan) : null,
        actualJumlah: b.actualJumlah || null,
        ttdFotoBase64: b.ttdFotoBase64 || null,
        ttdFotoNama: b.ttdFotoNama || null,
        lampiranFotoBase64: b.lampiranFotoBase64 || null,
        lampiranFotoNama: b.lampiranFotoNama || null,
      },
    });

    return NextResponse.json({ ok: true, record });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menyimpan pengajuan. Cek koneksi database." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const records = await prisma.wasteB3Request.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        nomorForm: true,
        nomorRegister: true,
        hari: true,
        tanggal: true,
        lokasiTps: true,
        rencanaMulai: true,
        rencanaSelesai: true,
        kodeLimbah: true,
        tanggalDihasilkanMulai: true,
        tanggalDihasilkanSelesai: true,
        masaSimpanHari: true,
        jumlahLimbahKeluar: true,
        jumlahKemasan: true,
        perusahaanPengangkut: true,
        nomorManifest: true,
        nomorKendaraan: true,
        catatan: true,
        actualTanggalPengambilan: true,
        actualJumlah: true,
        ttdFotoNama: true,
        lampiranFotoNama: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ records });
  } catch {
    return NextResponse.json({ records: [] });
  }
}
