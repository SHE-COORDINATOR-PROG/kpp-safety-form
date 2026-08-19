import { PrismaClient } from "@prisma/client";
import { inspectionForms } from "../lib/inspectionForms";

const prisma = new PrismaClient();

async function main() {
  const tahun = new Date().getFullYear();

  // Target default per kategori
  const categories = Array.from(new Set(inspectionForms.map((f) => f.category)));
  for (const kategori of categories) {
    const total = inspectionForms.filter((f) => f.category === kategori).length;
    await prisma.programTarget.upsert({
      where: { tahun_kategori: { tahun, kategori } },
      update: {},
      create: { tahun, kategori, targetProgram: total, targetInspeksi: total * 2 },
    });
  }

  // Contoh beberapa data inspeksi supaya dashboard tidak kosong
  const sample = inspectionForms.slice(0, 6);
  for (const [idx, f] of sample.entries()) {
    await prisma.inspectionRecord.create({
      data: {
        formSlug: f.slug,
        formTitle: f.title,
        category: f.category,
        unitOrLokasi: `Unit Contoh ${idx + 1}`,
        inspector: "Admin Demo",
        tanggal: new Date(tahun, idx % 12, 10),
        items: f.items.map((it) => ({ ...it, hasil: "BAIK", catatan: "" })),
        overallStatus: "BAIK",
      },
    });
  }

  console.log("Seed selesai ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
