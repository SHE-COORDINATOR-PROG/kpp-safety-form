"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export type TrendDatum = {
  bulan: string;
  program: number;
  inspeksi: number;
  targetProgram: number;
  targetInspeksi: number;
};

export default function TrendChart({ data }: { data: TrendDatum[] }) {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f2" />
          <XAxis dataKey="bulan" tick={{ fontSize: 10.5, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 10.5, fill: "#6b7280" }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="program" name="Program" fill="#16a34a" radius={[3, 3, 0, 0]} barSize={12} />
          <Bar dataKey="inspeksi" name="Inspeksi" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={12} />
          <Line type="monotone" dataKey="targetProgram" name="Tgt Prog" stroke="#f97316" strokeDasharray="4 3" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="targetInspeksi" name="Tgt Insp" stroke="#14b8a6" strokeDasharray="4 3" dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
