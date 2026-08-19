import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const target = await prisma.programTarget.upsert({
      where: { tahun_kategori: { tahun: Number(b.tahun), kategori: b.kategori } },
      update: { targetProgram: Number(b.targetProgram), targetInspeksi: Number(b.targetInspeksi) },
      create: {
        tahun: Number(b.tahun),
        kategori: b.kategori,
        targetProgram: Number(b.targetProgram),
        targetInspeksi: Number(b.targetInspeksi),
      },
    });
    return NextResponse.json({ ok: true, target });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan target. Cek koneksi database." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tahun = Number(searchParams.get("tahun")) || new Date().getFullYear();
    const targets = await prisma.programTarget.findMany({ where: { tahun } });
    return NextResponse.json({ targets });
  } catch {
    return NextResponse.json({ targets: [] });
  }
}
