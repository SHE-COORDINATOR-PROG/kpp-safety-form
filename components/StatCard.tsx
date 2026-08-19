export default function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "green" | "blue" | "purple" | "orange";
}) {
  const toneMap = {
    green: "bg-brand-greenLight text-brand-greenDark",
    blue: "bg-brand-blueLight text-blue-700",
    purple: "bg-brand-purpleLight text-purple-700",
    orange: "bg-brand-orangeLight text-orange-700",
  } as const;

  return (
    <div className={`rounded-xl2 p-4 sm:p-5 ${toneMap[tone]} shadow-card`}>
      <p className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase opacity-80">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
      <p className="text-[11px] sm:text-xs opacity-70 mt-0.5">{hint}</p>
    </div>
  );
}
