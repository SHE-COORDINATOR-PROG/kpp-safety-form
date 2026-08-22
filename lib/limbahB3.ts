export const kodeLimbahOptions = [
  "B105d / OLI BEKAS",
  "B110D / Filter Bekas",
  "A108D / Hose Bekas",
  "A102d-1 / Batery (Aki Bekas)",
  "B110D / Majun & Padatan",
  "B110D / Serbuk Gergaji Bekas",
  "B105d-2 / Sludge (Lumpur Bekas Oli)",
  "B104d / Kemasan B3",
  "B105D / Grease",
];

export const jumlahLimbahOptions = ["8000 L / 7.2 Ton", "1000 L"];

export const jumlahKemasanOptions = ["1 Tangki Kapasitas 8000 L", "1000 L"];

const hariIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function getHariIndo(tanggal: string | Date): string {
  const d = typeof tanggal === "string" ? new Date(tanggal) : tanggal;
  return hariIndo[d.getDay()];
}

export function formatTanggalIndo(tanggal: string | Date): string {
  const d = typeof tanggal === "string" ? new Date(tanggal) : tanggal;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
