import { useState } from "react";
import { useLocation } from "wouter";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { UnifiedHamburgerDrawer } from "@/components/shared/UnifiedHamburgerDrawer";
import { BottomNav } from "@/components/sections/BottomNav";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { useAuth } from "@/src/contexts/AuthContext";

interface DashboardShellProps {
  children: React.ReactNode;
}

/* ─── Drawer adapter ─────────────────────────────────
   Must live inside DashboardShell so it has access to
   ActiveBusinessContext (provided by DashboardPage).    */
function DashboardDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { business, allBusinesses, switchBusiness } = useActiveBusiness();
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  const businesses = allBusinesses.map(b => ({
    id: b.id,
    name: b.name,
    city: b.city ?? "",
    province: b.province ?? "",
  }));

  const handleSwitchToBusiness = async (id: number) => {
    if (id !== business?.id) {
      await switchBusiness(id);
    }
    navigate("/business");
    onClose();
  };

  return (
    <UnifiedHamburgerDrawer
      open={open}
      onClose={onClose}
      businesses={businesses}
      activeBusinessId={business?.id ?? null}
      onSwitchToPersonal={() => { navigate("/account"); onClose(); }}
      onSwitchToBusiness={handleSwitchToBusiness}
      onAddBusiness={() => { navigate("/account/create-business"); onClose(); }}
      onLogout={async () => { await logout(); navigate("/"); onClose(); }}
    />
  );
}

/* ─── Shell ─────────────────────────────────────────── */
export function DashboardShell({ children }: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24" dir="rtl">
      <UnifiedHeader
        onHamburger={() => setMenuOpen(true)}
        notificationCount={3}
        onBellPress={() => navigate("/business/notifications")}
      />

      <main id="dashboard-main" tabIndex={-1}>
        {children}
      </main>

      <BottomNav />

      <DashboardDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
