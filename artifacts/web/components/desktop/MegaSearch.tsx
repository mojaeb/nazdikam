import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon } from "@/components/icons";
import { getPopularCategories } from "@/lib/mock-categories";

const POPULAR_SEARCHES = [
  "عسل طبیعی مازندران",
  "رستوران سنتی بابل",
  "صنایع دستی گیلان",
  "ویلا در شمال",
  "ماهی دودی",
  "چای لاهیجان",
  "اقامتگاه بوم‌گردی",
  "سفال محلی",
];

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8" />
    </svg>
  );
}

function CategoryIcon({ path }: { path: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path.split(/(?= M)/).map((segment, i) => (
        <path key={i} d={segment.trim()} />
      ))}
    </svg>
  );
}

export function MegaSearch() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const quickCategories = getPopularCategories().slice(0, 7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/search");
  };

  return (
    <section
      className="relative overflow-hidden py-20"
      style={{ background: "linear-gradient(135deg, #0f2d6e 0%, #1860DB 50%, #0D9488 100%)" }}
      aria-label="جستجوی اصلی"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 start-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 end-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/3 translate-x-1/3" />
        <div className="absolute top-1/2 start-1/4 w-48 h-48 rounded-full bg-teal-400/10" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title */}
          <motion.p
            className="text-white/70 font-vazirmatn text-sm mb-3 tracking-wide"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            مازندران · گیلان · گلستان
          </motion.p>
          <motion.h1
            className="font-iran-yekan-x font-bold text-white text-4xl leading-tight mb-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            کسب‌وکارها و محصولات محلی را کشف کنید
          </motion.h1>
          <motion.p
            className="text-white/70 font-vazirmatn text-base mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            از رستوران‌های اصیل تا صنایع دستی بومی — همه در نزدیکی شما
          </motion.p>

          {/* Search input */}
          <motion.form
            onSubmit={handleSubmit}
            className="relative mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <motion.div
              className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden"
              animate={{ boxShadow: focused ? "0 20px 60px rgba(0,0,0,0.25)" : "0 8px 30px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Search icon button (end/left in RTL) */}
              <button
                type="submit"
                className="flex items-center gap-2 h-16 ps-5 pe-4 bg-blue-500 hover:bg-blue-600 transition-colors text-white shrink-0"
                aria-label="جستجو"
              >
                <SearchIcon size={20} className="text-white" />
                <span className="font-vazirmatn text-sm font-bold hidden sm:block">جستجو</span>
              </button>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="کسب‌وکار، محصول یا خدمات را جستجو کنید..."
                className="flex-1 h-16 px-5 font-vazirmatn text-base text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none text-end"
                dir="rtl"
                aria-label="جستجو"
              />

              {/* Mic icon (start/right in RTL) */}
              <button
                type="button"
                className="w-14 h-16 flex items-center justify-center text-neutral-400 hover:text-blue-500 transition-colors shrink-0"
                aria-label="جستجوی صوتی"
              >
                <MicIcon />
              </button>
            </motion.div>

            {/* Suggestion dropdown */}
            <AnimatePresence>
              {focused && (
                <motion.div
                  className="absolute top-full inset-x-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-5">
                    <p className="text-xs font-vazirmatn text-neutral-400 mb-3 text-start">جستجوهای محبوب</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map(term => (
                        <button
                          key={term}
                          type="button"
                          className="h-8 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-vazirmatn text-neutral-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                          onMouseDown={() => { setQuery(term); navigate("/search"); }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Popular searches (always visible) */}
          <motion.div
            className="flex items-center justify-center gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-white/60 font-vazirmatn text-xs shrink-0">محبوب:</span>
            {POPULAR_SEARCHES.slice(0, 5).map(term => (
              <button
                key={term}
                type="button"
                className="h-7 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-vazirmatn transition-colors border border-white/20"
                onClick={() => navigate("/search")}
              >
                {term}
              </button>
            ))}
          </motion.div>

          {/* Quick categories */}
          <motion.div
            className="flex items-center justify-center gap-4 flex-wrap mt-8 pt-8 border-t border-white/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {quickCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className="flex flex-col items-center gap-2 group"
                onClick={() => navigate(`/categories/${cat.slug}`)}
                aria-label={cat.name}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    <CategoryIcon path={cat.iconPath} />
                  </span>
                </div>
                <span className="text-white/75 font-vazirmatn text-[11px] group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
