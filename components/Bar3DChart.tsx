"use client";

import { useState } from "react";

export type Bar3DDatum = {
  label: string;
  sudahInspeksi: number;
  belumInspeksi: number;
  color: string; // warna sisi depan (hex)
};

/**
 * Chart batang 3D (efek isometric) dibuat murni dengan SVG,
 * tanpa dependency berat seperti three.js, supaya tetap ringan
 * dan responsif di HP maupun laptop.
 *
 * Setiap batang punya 3 sisi: depan (front), atas (top), samping (side)
 * untuk memberi ilusi kedalaman (depth) 3D.
 */
export default function Bar3DChart({
  title,
  data,
  height = 300,
}: {
  title: string;
  data: Bar3DDatum[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const maxTotal = Math.max(1, ...data.map((d) => d.sudahInspeksi + d.belumInspeksi));
  const chartH = height - 70;
  const depth = 14; // kedalaman efek 3D
  const barW = 34;
  const gap = 28;
  const groupW = barW * 2 + 10;
  const svgW = Math.max(360, data.length * (groupW + gap) + gap + depth);

  function scaledH(v: number) {
    return (v / maxTotal) * (chartH - 10);
  }

  function darken(hex: string, amt: number) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - amt);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const b = Math.max(0, (num & 0x0000ff) - amt);
    return `rgb(${r},${g},${b})`;
  }

  function Bar3D({
    x,
    val,
    color,
    idx,
    keyName,
  }: {
    x: number;
    val: number;
    color: string;
    idx: number;
    keyName: string;
  }) {
    const h = scaledH(val);
    const y = chartH - h;
    const front = color;
    const side = darken(color, 45);
    const isHover = hover === idx;

    return (
      <g
        onMouseEnter={() => setHover(idx)}
        onMouseLeave={() => setHover(null)}
        style={{ cursor: "pointer", transition: "transform 0.15s" }}
        transform={isHover ? `translate(0,-4)` : undefined}
      >
        {/* sisi samping (kanan) */}
        <polygon
          points={`${x + barW},${y} ${x + barW + depth},${y - depth} ${x + barW + depth},${
            chartH - depth
          } ${x + barW},${chartH}`}
          fill={side}
        />
        {/* sisi atas */}
        <polygon
          points={`${x},${y} ${x + depth},${y - depth} ${x + barW + depth},${y - depth} ${x + barW},${y}`}
          fill={color}
          opacity={0.85}
        />
        {/* sisi depan */}
        <rect x={x} y={y} width={barW} height={h} fill={front} rx={2} />
        {isHover && (
          <text
            x={x + barW / 2}
            y={y - depth - 6}
            textAnchor="middle"
            fontSize="12"
            fontWeight={700}
            fill="#1f2937"
          >
            {val}
          </text>
        )}
      </g>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-brand-ink flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-green" />
          {title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-brand-muted">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-brand-green inline-block" /> Sudah Inspeksi
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" /> Belum Inspeksi
          </span>
        </div>
      </div>
      <svg width={svgW} height={height} role="img" aria-label={title}>
        {/* garis dasar */}
        <line x1={0} y1={chartH} x2={svgW} y2={chartH} stroke="#e5e7eb" strokeWidth={1} />
        {data.map((d, i) => {
          const groupX = gap + i * (groupW + gap);
          return (
            <g key={d.label}>
              <Bar3D x={groupX} val={d.sudahInspeksi} color={d.color} idx={i * 2} keyName="sudah" />
              <Bar3D x={groupX + barW + 6} val={d.belumInspeksi} color="#d1d5db" idx={i * 2 + 1} keyName="belum" />
              <text
                x={groupX + barW}
                y={chartH + 18}
                textAnchor="middle"
                fontSize="10.5"
                fill="#6b7280"
              >
                {d.label.length > 12 ? d.label.slice(0, 11) + "…" : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
