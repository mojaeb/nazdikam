import { useLocation } from "wouter";
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
  const [, navigate] = useLocation();

  return (
    <motion.div
      className="px-4 pt-3 pb-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div
        className="card flex items-center gap-3 px-4 h-12 rounded-2xl cursor-pointer active:scale-[0.99] transition-transform"
        role="button"
        tabIndex={0}
        aria-label="جستجو"
        onClick={() => navigate("/search")}
        onKeyDown={e => e.key === "Enter" && navigate("/search")}
      >
        <SearchIcon size={18} className="text-neutral-400 shrink-0" />
        <span className="flex-1 text-body font-vazirmatn text-neutral-400 text-right select-none">
          جستجو در کسب‌وکارها، محصولات و خدمات...
        </span>
        <div className="h-5 w-px bg-neutral-200 shrink-0" />
        <motion.button
          className="text-blue-500 shrink-0"
          whileTap={{ scale: 0.9 }}
          aria-label="جستجوی صوتی"
          onClick={e => {
            e.stopPropagation();
            navigate("/search");
          }}
        >
          <MicIcon />
        </motion.button>
      </div>
    </motion.div>
  );
}
