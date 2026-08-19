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
  { href: "/setting-target", label: "Setting Target", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavList = () => (
    <nav className="px-3 space-y-1">
      <p className="px-3 text-[11px] font-bold tracking-widest text-brand-green mb-2 mt-2">
        MAIN MENU
      </p>
      {menu.map((m) => {
        const active = pathname === m.href;
        return (
          <Link
            key={m.href}
            href={m.href}
            onClick={() => setOpen(false)}
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
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-brand-line px-4 py-3 gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <LogoRow size="h-6" />
          <p className="text-[10px] text-brand-muted leading-tight">Safety Dashboard</p>
        </div>
        <button
          aria-label="Buka menu"
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg border border-brand-line"
        >
          ☰
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-brand-line gap-2">
              <LogoRow size="h-7" />
              <button onClick={() => setOpen(false)} className="text-lg shrink-0">✕</button>
            </div>
            <NavList />
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
        </div>
      )}

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
