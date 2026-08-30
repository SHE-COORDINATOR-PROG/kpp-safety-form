"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import LogoRow from "./LogoRow";

const menu = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/riwayat-inspeksi", label: "Riwayat Inspeksi", icon: "🔍" },
  { href: "/form-inspeksi", label: "Form Inspeksi", icon: "📝" },
  { href: "/lifting-plan", label: "Pengajuan Lifting Plan", icon: "🏗️" },
  { href: "/riwayat-lifting-plan", label: "Riwayat Lifting Plan", icon: "📚" },
  { href: "/lifting-report", label: "Lifting Report", icon: "📄" },
  { href: "/pengajuan-limbah-b3", label: "Pengajuan Limbah B3", icon: "♻️" },
  { href: "/riwayat-limbah-b3", label: "Riwayat Limbah B3", icon: "🗂️" },
  { href: "/import-manifest-b3", label: "Import Manifest B3", icon: "📥" },
  { href: "/riwayat-manifest-b3", label: "Riwayat Manifest B3", icon: "🗃️" },
  { href: "/setting-target", label: "Setting Target", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavList = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="px-3 py-2 space-y-1">
      <p className="px-3 text-[11px] font-bold tracking-widest text-brand-green mb-2 mt-2">
        MAIN MENU
      </p>
      {menu.map((m) => {
        const active = pathname === m.href;
        return (
          <Link
            key={m.href}
            href={m.href}
            onClick={onItemClick}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-brand-green text-white shadow-sm"
                : "text-brand-ink hover:bg-brand-greenLight"
            )}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar — fixed di luar alur flex, supaya selalu full width */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-brand-line">
        <div className="flex items-center justify-between px-4 py-2.5 gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <LogoRow size="h-6" />
            <p className="text-[10px] text-brand-muted leading-tight">Safety Dashboard</p>
          </div>
          <button
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-lg border border-brand-line shrink-0 text-lg leading-none"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Dropdown menu mobile — muncul di bawah header, hilang lagi setelah pilih menu */}
        {open && (
          <div className="border-t border-brand-line bg-white max-h-[75vh] overflow-y-auto shadow-lg">
            <NavList onItemClick={() => setOpen(false)} />
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-brand-line bg-white h-screen sticky top-0 overflow-y-auto">
        <div className="flex flex-col gap-2 px-5 py-5 border-b border-brand-line">
          <LogoRow size="h-8" />
          <p className="text-xs text-brand-muted leading-tight">Safety Dashboard</p>
        </div>
        <NavList />
      </aside>
    </>
  );
}
