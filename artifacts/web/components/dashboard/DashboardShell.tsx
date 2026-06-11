import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#F7F8FA]" dir="rtl">
      {/* Fixed topbar */}
      <DashboardTopbar />

      {/* Body — below topbar */}
      <div className="flex pt-[60px] min-h-screen">
        {/* Desktop sidebar — sticky, hidden on mobile */}
        <aside
          className="hidden lg:block w-64 shrink-0"
          aria-label="ناوبری داشبورد"
        >
          <div className="sticky top-[60px] h-[calc(100vh-60px)] bg-white border-e border-neutral-100 overflow-y-auto">
            <DashboardSidebar />
          </div>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 min-w-0 pb-20 lg:pb-6"
          id="dashboard-main"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <DashboardMobileNav />
    </div>
  );
}
