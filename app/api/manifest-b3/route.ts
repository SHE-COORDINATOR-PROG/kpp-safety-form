import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.fileBase64 || !b.namaFile) {
      return NextResponse.json({ error: "File belum dipilih" }, { status: 400 });
    }
    const record = await prisma.manifestB3.create({
      data: {
        namaFile: b.namaFile,
        fileBase64: b.fileBase64,
        nomorManifest: b.nomorManifest || null,
        keterangan: b.keterangan || null,
        uploadedBy: b.uploadedBy || null,
      },
    });
    return NextResponse.json({ ok: true, record: { id: record.id, namaFile: record.namaFile } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengupload manifest. Cek koneksi database." }, { status: 500 });
  }
}

// Daftar ringkas — TANPA isi file (base64) supaya cepat dimuat.
export async function GET() {
  try {
    const records = await prisma.manifestB3.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        namaFile: true,
        nomorManifest: true,
        keterangan: true,
        uploadedBy: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ records });
  } catch {
    return NextResponse.json({ records: [] });
  }
}
