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

// Oli Bekas pakai satuan Liter/Tangki (khusus)
export const jumlahLimbahOptionsOliBekas = ["8000 L / 7.2 Ton", "1000 L"];
export const jumlahKemasanOptionsOliBekas = ["1 Tangki Kapasitas 8000 L", "1000 L"];

// Rentang berat 0,180 - 3 Ton (kelipatan 0,180 Ton) untuk limbah selain Oli Bekas
export const jumlahLimbahOptionsRentangTon: string[] = (() => {
  const opts: string[] = [];
  for (let v = 0.18; v <= 3.0001; v += 0.18) {
    opts.push(`${v.toFixed(3).replace(".", ",")} Ton`);
  }
  return opts;
})();

// Jumlah kemasan Drum (1-25) untuk limbah padat/non-battery selain Oli Bekas
export const jumlahKemasanOptionsDrum: string[] = Array.from({ length: 25 }, (_, i) => `${i + 1} Drum`);

// Jumlah kemasan Pcs (1-30) khusus Battery/Aki Bekas
export const jumlahKemasanOptionsPcs: string[] = Array.from({ length: 30 }, (_, i) => `${i + 1} Pcs`);

export function isOliBekas(kodeLimbah: string) {
  return kodeLimbah.includes("OLI BEKAS");
}

export function isBattery(kodeLimbah: string) {
  return kodeLimbah.toLowerCase().includes("batery") || kodeLimbah.toLowerCase().includes("aki bekas");
}

export function getJumlahLimbahOptions(kodeLimbah: string): string[] {
  if (isOliBekas(kodeLimbah)) return jumlahLimbahOptionsOliBekas;
  return jumlahLimbahOptionsRentangTon;
}

export function getJumlahKemasanOptions(kodeLimbah: string): string[] {
  if (isOliBekas(kodeLimbah)) return jumlahKemasanOptionsOliBekas;
  if (isBattery(kodeLimbah)) return jumlahKemasanOptionsPcs;
  return jumlahKemasanOptionsDrum;
}

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
