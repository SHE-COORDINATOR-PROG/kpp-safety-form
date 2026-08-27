import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Endpoint ringan untuk "membangunkan" server Vercel dan database Neon
// supaya tidak sempat tidur (auto-suspend) karena lama tidak diakses.
// Dipanggil secara berkala oleh layanan cron eksternal (mis. cron-job.org).
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "DB belum terhubung" }, { status: 200 });
  }
}
