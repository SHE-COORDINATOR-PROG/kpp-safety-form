"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export type DonutDatum = { name: string; value: number; color: string };

export default function StatusDonut({ data }: { data: DonutDatum[] }) {
  return (
    <div className="w-full">
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-1">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5 text-xs text-brand-muted">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
