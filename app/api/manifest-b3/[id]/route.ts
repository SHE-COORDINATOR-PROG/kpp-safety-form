import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const record = await prisma.manifestB3.findUnique({ where: { id: params.id } });
    if (!record) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ record });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.manifestB3.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}
