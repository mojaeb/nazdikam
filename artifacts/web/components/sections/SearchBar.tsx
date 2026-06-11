import { motion } from "framer-motion";
import { SearchIcon } from "@/components/icons";

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a3 3 0 013 3v7a3 3 0 01-6 0V5a3 3 0 013-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

export function SearchBar() {
  return (
    <motion.div
      className="px-4 pt-3 pb-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="card flex items-center gap-3 px-4 h-12 rounded-2xl">
        <SearchIcon size={18} className="text-neutral-400 shrink-0" />
        <input
          type="search"
          inputMode="search"
          placeholder="جستجو در کسب‌وکارها، محصولات و خدمات..."
          className="flex-1 bg-transparent text-body font-vazirmatn text-neutral-900 placeholder:text-neutral-400 outline-none min-w-0 rtl:text-right"
          readOnly
        />
        <div className="h-5 w-px bg-neutral-200 shrink-0" />
        <motion.button
          className="text-blue-500 shrink-0"
          whileTap={{ scale: 0.9 }}
          aria-label="جستجوی صوتی"
        >
          <MicIcon />
        </motion.button>
      </div>
    </motion.div>
  );
}
