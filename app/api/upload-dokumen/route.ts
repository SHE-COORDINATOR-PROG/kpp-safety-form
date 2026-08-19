import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const doc = await prisma.uploadedDocument.create({
      data: {
        kategori: b.kategori,
        namaFile: b.namaFile,
        url: b.url || "#",
        bulan: Number(b.bulan),
        tahun: Number(b.tahun),
        uploadedBy: b.uploadedBy,
      },
    });
    return NextResponse.json({ ok: true, doc });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan. Cek koneksi database." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const docs = await prisma.uploadedDocument.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ docs });
  } catch {
    return NextResponse.json({ docs: [] });
  }
}
