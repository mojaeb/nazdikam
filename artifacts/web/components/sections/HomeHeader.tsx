import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BellIcon, ChevronDownIcon, MapPinIcon, UserIcon } from "@/components/icons";

function NazdikamLogo() {
  return (
    <span className="text-title font-iran-yekan-x font-bold text-blue-600">
      نزدیکام
    </span>
  );
}

export function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white transition-shadow duration-200"
      animate={{ boxShadow: scrolled ? "0 2px 12px 0 rgba(0,0,0,0.08)" : "none" }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <NazdikamLogo />

        {/* City selector */}
        <motion.button
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700"
          whileTap={{ scale: 0.97 }}
        >
          <MapPinIcon size={14} className="text-blue-500" />
          <span className="text-xs font-vazirmatn font-medium">بابل</span>
          <ChevronDownIcon size={13} className="text-blue-400" />
        </motion.button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <motion.button
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100"
            whileTap={{ scale: 0.93 }}
          >
            <BellIcon size={20} />
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
          </motion.button>
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100"
            whileTap={{ scale: 0.93 }}
          >
            <UserIcon size={20} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
