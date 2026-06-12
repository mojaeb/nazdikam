import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Icons ─────────────────────────────────────────── */
function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Types ─────────────────────────────────────────── */
export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

export interface BottomSheetSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  title: string;
  placeholder?: string;
  emptyOption?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

/* ─── Component ─────────────────────────────────────── */
export function BottomSheetSelect({
  value,
  onChange,
  options,
  title,
  placeholder = "انتخاب کنید",
  emptyOption,
  searchable = true,
  disabled = false,
  className,
}: BottomSheetSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedLabel = useMemo(
    () => options.find(o => o.value === value)?.label ?? (value ? value : ""),
    [value, options]
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    const lower = q.toLowerCase();
    const opts = q
      ? options.filter(
          o =>
            o.label.toLowerCase().includes(lower) ||
            (o.group?.toLowerCase().includes(lower) ?? false)
        )
      : options;

    const groups = new Map<string, SelectOption[]>();
    for (const opt of opts) {
      const key = opt.group ?? "";
      const arr = groups.get(key) ?? [];
      arr.push(opt);
      groups.set(key, arr);
    }
    return groups;
  }, [options, query]);

  const hasResults = Array.from(filtered.values()).some(a => a.length > 0);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={cn(
          "w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4",
          "flex items-center justify-between gap-2 text-start transition-all",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400",
          "active:bg-neutral-100",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        aria-haspopup="listbox"
      >
        <span className={cn("text-sm font-vazirmatn truncate", value ? "text-neutral-800" : "text-neutral-400")}>
          {selectedLabel || placeholder}
        </span>
        <span className="shrink-0 text-neutral-400">
          <ChevronIcon />
        </span>
      </button>

      {/* ── Bottom sheet portal ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl flex flex-col overflow-hidden"
              style={{ maxHeight: "78vh" }}
              dir="rtl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-neutral-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-neutral-100 shrink-0">
                <span className="font-vazirmatn font-bold text-[15px] text-neutral-800">{title}</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 active:bg-neutral-200"
                  aria-label="بستن"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Search input */}
              {searchable && (
                <div className="px-4 py-3 border-b border-neutral-100 shrink-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-neutral-400">
                      <SearchIcon />
                    </div>
                    <input
                      type="search"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="جستجو..."
                      autoComplete="off"
                      className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 pe-9 ps-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Options list */}
              <div className="overflow-y-auto flex-1 pb-safe-bottom" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)" }}>
                {/* Optional "no selection" row */}
                {emptyOption && !query && (
                  <button
                    type="button"
                    onClick={() => handleSelect("")}
                    className="w-full flex items-center justify-between px-5 h-12 active:bg-neutral-50 transition-colors border-b border-neutral-100"
                  >
                    <span className={cn("font-vazirmatn text-sm", !value ? "text-teal-600 font-semibold" : "text-neutral-500")}>
                      {emptyOption}
                    </span>
                    {!value && <span className="text-teal-500"><CheckIcon /></span>}
                  </button>
                )}

                {/* Grouped options */}
                {Array.from(filtered.entries()).map(([group, opts]) => (
                  <div key={group}>
                    {group && (
                      <div className="px-5 pt-3 pb-1.5 bg-neutral-50/70">
                        <span className="text-[11px] font-vazirmatn font-bold text-neutral-400 tracking-wide">
                          {group}
                        </span>
                      </div>
                    )}
                    {opts.map(opt => {
                      const isSelected = opt.value === value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(opt.value)}
                          className={cn(
                            "w-full flex items-center justify-between px-5 h-12 transition-colors",
                            isSelected ? "bg-teal-50/60 active:bg-teal-100" : "active:bg-neutral-50"
                          )}
                        >
                          <span className={cn(
                            "font-vazirmatn text-sm",
                            isSelected ? "text-teal-600 font-semibold" : "text-neutral-700"
                          )}>
                            {opt.label}
                          </span>
                          {isSelected && <span className="text-teal-500"><CheckIcon /></span>}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Empty search result */}
                {!hasResults && (
                  <div className="text-center py-12">
                    <p className="text-sm font-vazirmatn text-neutral-400">نتیجه‌ای یافت نشد</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
