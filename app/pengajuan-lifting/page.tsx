import LiftingPlanForm from "@/components/LiftingPlanForm";
import LogoRow from "@/components/LogoRow";

export const metadata = {
  title: "Pengajuan Lifting Plan — KPP Mining",
};

export default function PengajuanLiftingPublicPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="border-b border-brand-line bg-white px-4 sm:px-8 py-4">
        <LogoRow size="h-8" />
        <p className="text-xs text-brand-muted mt-1">
          Form pengajuan Lifting Plan — dapat diisi langsung tanpa login.
        </p>
      </div>
      <div className="p-4 sm:p-8">
        <LiftingPlanForm standalone />
      </div>
    </div>
  );
}
