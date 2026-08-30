import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getFormBySlug } from "@/lib/inspectionForms";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const form = getFormBySlug(body.formSlug);
    if (!form) {
      return NextResponse.json({ error: "Form tidak ditemukan" }, { status: 400 });
    }

    const hasTidakLayak = (body.items || []).some((i: any) => i.hasil === "TIDAK_ADA");
    const hasPerluPerhatian = (body.items || []).some((i: any) => i.hasil === "PERLU_PERHATIAN");

    const record = await prisma.inspectionRecord.create({
      data: {
        formSlug: form.slug,
        formTitle: form.title,
        category: form.category,
        unitOrLokasi: body.unitOrLokasi,
        nomorAset: body.nomorAset || null,
        inspector: body.inspector,
        tanggal: new Date(body.tanggal),
        items: body.items,
        overallStatus: hasTidakLayak ? "TIDAK_LAYAK" : hasPerluPerhatian ? "PERLU_PERHATIAN" : "BAIK",
        catatanUmum: body.catatanUmum || null,
      },
    });

    return NextResponse.json({ ok: true, record });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menyimpan data. Pastikan DATABASE_URL sudah dikonfigurasi." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const formSlug = searchParams.get("formSlug") || undefined;
    const records = await prisma.inspectionRecord.findMany({
      where: formSlug ? { formSlug } : undefined,
      orderBy: { tanggal: "desc" },
      take: 100,
    });
    return NextResponse.json({ records });
  } catch (err) {
    return NextResponse.json({ records: [], error: "DB belum terhubung" }, { status: 200 });
  }
}
