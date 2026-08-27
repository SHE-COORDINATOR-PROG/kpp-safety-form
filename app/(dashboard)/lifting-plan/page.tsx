import LiftingPlanForm from "@/components/LiftingPlanForm";
import PublicLinkBox from "@/components/PublicLinkBox";

export default function LiftingPlanPage() {
  return (
    <div className="space-y-4">
      <PublicLinkBox path="/pengajuan-lifting" label="Link publik pengajuan Lifting Plan (bisa dibagikan ke pekerja lapangan tanpa perlu login):" />
      <LiftingPlanForm />
    </div>
  );
}
