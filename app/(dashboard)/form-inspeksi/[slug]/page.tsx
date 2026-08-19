import { notFound } from "next/navigation";
import { getFormBySlug } from "@/lib/inspectionForms";
import InspectionFormClient from "./InspectionFormClient";

export default function FormDetailPage({ params }: { params: { slug: string } }) {
  const form = getFormBySlug(params.slug);
  if (!form) return notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <p className="text-xs font-semibold text-brand-green">{form.category}</p>
        <h1 className="text-lg sm:text-xl font-bold mt-1">{form.title}</h1>
        <p className="text-sm text-brand-muted mt-1">{form.deskripsi}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {form.dasarHukum.map((d) => (
            <span key={d} className="text-[10px] bg-gray-100 text-brand-muted px-2 py-1 rounded-full">
              {d}
            </span>
          ))}
        </div>
      </div>
      <InspectionFormClient form={form} />
    </div>
  );
}
