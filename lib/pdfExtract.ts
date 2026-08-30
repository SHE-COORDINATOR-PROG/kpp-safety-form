// Membaca isi teks PDF di browser (client-side) memakai pdf.js,
// lalu mencoba menebak Nomor Manifest dari pola teks umum yang biasa
// dipakai di dokumen manifest limbah B3 (mis. "No. Manifest: ...").
//
// CATATAN: karena setiap perusahaan/pengangkut bisa punya format manifest
// yang sedikit berbeda, hasil tebakan ini TIDAK dijamin selalu tepat —
// karena itu hasilnya tetap ditaruh di kolom yang bisa diedit manual,
// bukan langsung dikunci.

export type PdfReadResult = {
  fullText: string;
  nomorManifestGuess: string | null;
};

export async function readManifestPdf(file: File): Promise<PdfReadResult> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  // Worker diambil dari CDN, versinya harus sama persis dengan versi
  // package.json ("pdfjs-dist": "3.11.174") supaya tidak error mismatch.
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  const maxPages = Math.min(pdf.numPages, 3);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((it: any) => it.str || "").join(" ") + "\n";
  }

  return { fullText, nomorManifestGuess: guessManifestNumber(fullText) };
}

function guessManifestNumber(text: string): string | null {
  const patterns = [
    /no\.?\s*manifest\s*[:\-]?\s*([A-Z0-9\-\/\.]{5,30})/i,
    /nomor\s*manifest\s*[:\-]?\s*([A-Z0-9\-\/\.]{5,30})/i,
    /manifest\s*no\.?\s*[:\-]?\s*([A-Z0-9\-\/\.]{5,30})/i,
    /no\.?\s*seri\s*[:\-]?\s*([A-Z0-9\-\/\.]{5,30})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) return m[1].trim();
  }
  return null;
}
