import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { CloseIcon } from "@/components/icons";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA]" dir="rtl">
      {/* Fixed dark topbar with hamburger trigger */}
      <DashboardTopbar onHamburger={() => setMenuOpen(true)} />

      {/* Main content — full width, no sidebar column */}
      <main className="pt-[60px] min-h-screen pb-8" id="dashboard-main" tabIndex={-1}>
        {children}
      </main>

      {/* ─── Hamburger Drawer ─── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer — slides from the right (start in RTL) */}
            <motion.div
              className="fixed inset-y-0 start-0 z-50 w-[280px] bg-white overflow-hidden flex flex-col"
              style={{ boxShadow: "0 0 40px rgba(0,0,0,0.2)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              role="dialog"
              aria-label="منوی ناوبری"
              aria-modal="true"
            >
              {/* Drawer header */}
              <div
                className="h-[60px] flex items-center justify-between px-4 shrink-0"
                style={{ backgroundColor: "#0F172A" }}
              >
                <span className="font-iran-yekan-x font-bold text-white text-base">منو</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(false)}
                  aria-label="بستن منو"
                >
                  <CloseIcon size={16} className="text-white/80" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto">
                <DashboardSidebar onNavigate={() => setMenuOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
