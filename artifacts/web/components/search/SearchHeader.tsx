import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

function BackArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a3 3 0 013 3v7a3 3 0 01-6 0V5a3 3 0 013-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function CloseSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface SearchHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  onBack: () => void;
  onVoice: () => void;
  onSubmit: () => void;
  className?: string;
}

export function SearchHeader({
  query,
  onQueryChange,
  onBack,
  onVoice,
  onSubmit,
  className,
}: SearchHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={cn("flex items-center gap-2 px-3 h-14 bg-white border-b border-neutral-100", className)}>
      {/* Back — start (right in RTL) */}
      <motion.button
        type="button"
        className="w-9 h-9 flex items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors shrink-0"
        whileTap={{ scale: 0.93 }}
        onClick={onBack}
        aria-label="بازگشت"
      >
        <BackArrowIcon />
      </motion.button>

      {/* Input */}
      <div className="flex-1 flex items-center gap-2 bg-neutral-100 rounded-2xl px-3.5 h-10">
        <SearchIcon size={16} className="text-neutral-400 shrink-0" />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          placeholder="جستجو در نزدیکام..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSubmit()}
          className="flex-1 bg-transparent text-body font-vazirmatn text-neutral-900 placeholder:text-neutral-400 outline-none min-w-0 text-right"
          aria-label="جستجو"
          autoComplete="off"
          autoCorrect="off"
        />

        {/* Clear / Mic toggle */}
        <AnimatePresence mode="wait" initial={false}>
          {query.length > 0 ? (
            <motion.button
              key="clear"
              type="button"
              className="w-5 h-5 flex items-center justify-center rounded-full bg-neutral-400 text-white shrink-0"
              whileTap={{ scale: 0.9 }}
              onClick={() => onQueryChange("")}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              aria-label="پاک کردن"
            >
              <CloseSmallIcon />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              type="button"
              className="text-blue-500 shrink-0"
              whileTap={{ scale: 0.9 }}
              onClick={onVoice}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              aria-label="جستجوی صوتی"
            >
              <MicIcon />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
