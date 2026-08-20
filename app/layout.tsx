import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-[68px] lg:pt-8">{children}</main>
    </div>
  );
}
