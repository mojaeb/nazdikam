import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchIcon, MapPinIcon, ChevronStartIcon } from "@/components/icons";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import { BottomNav } from "@/components/sections/BottomNav";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";

const PROVINCES = ["همه", "مازندران", "گیلان", "گلستان"];
const CATEGORIES = ["همه", "رستوران", "کافه", "خدمات", "صنایع دستی", "پارچه و خیاطی", "داروخانه", "عکاسی", "زنبورداری"];

function MapPlaceholder() {
  return (
    <div className="relative w-full bg-neutral-100 overflow-hidden" style={{ height: 240 }}>
      {/* Stylised map background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        backgroundColor: "#f0fdf4",
      }} />
      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 240" preserveAspectRatio="xMidYMid slice">
        <path d="M0 120 Q100 100 200 120 Q300 140 390 120" stroke="#bbf7d0" strokeWidth="8" fill="none" />
        <path d="M0 80 Q120 70 200 90 Q280 110 390 80" stroke="#d1fae5" strokeWidth="5" fill="none" />
        <path d="M100 0 Q110 60 120 120 Q130 180 140 240" stroke="#bbf7d0" strokeWidth="6" fill="none" />
        <path d="M250 0 Q260 80 265 120 Q270 160 260 240" stroke="#d1fae5" strokeWidth="4" fill="none" />
      </svg>
      {/* Pin markers */}
      {[
        { cx: 90, cy: 100, color: "#1860DB" },
        { cx: 200, cy: 115, color: "#059669" },
        { cx: 300, cy: 90, color: "#D97706" },
        { cx: 150, cy: 160, color: "#7C3AED" },
        { cx: 310, cy: 170, color: "#DC2626" },
      ].map((pin, i) => (
        <g key={i} style={{ transform: `translate(${pin.cx}px, ${pin.cy}px)` }}>
          <circle r="10" fill={pin.color} opacity="0.2" />
          <circle r="5" fill={pin.color} />
        </g>
      ))}
      {/* Center overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 text-center shadow-sm">
          <p className="text-xs font-iran-yekan-x font-bold text-neutral-800">نقشه تعاملی</p>
          <p className="text-[10px] font-vazirmatn text-neutral-500 mt-0.5">به‌زودی فعال می‌شود</p>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("همه");
  const [category, setCategory] = useState("همه");

  const { businesses: allBusinesses, isLoading: isBusinessesLoading } = useBusinessSearch({
    q: query || undefined,
    province: province === "همه" ? undefined : province,
    per_page: 50,
  });

  const filtered = allBusinesses.filter(b => {
    if (category === "همه") return true;
    return b.category.includes(category);
  });

  return (
    <div dir="rtl" className="flex flex-col bg-white" style={{ height: "100dvh" }}>
      {/* ─── Header ──────────────────────────────────── */}
      <div className="shrink-0 bg-white z-20 px-4 pt-3 pb-2 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/")} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
            <ChevronStartIcon size={18} className="text-neutral-700" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-neutral-400 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="جستجو در نقشه..."
              className="w-full h-10 rounded-xl bg-neutral-100 ps-9 pe-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Province filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {PROVINCES.map(p => (
            <button key={p} type="button" onClick={() => setProvince(p)}
              className={cn("shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn font-medium transition-colors",
                province === p ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600")}>
              {p}
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {CATEGORIES.map(c => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className={cn("shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn transition-colors",
                category === c ? "bg-teal-600 text-white" : "bg-neutral-100 text-neutral-600")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Map ─────────────────────────────────────── */}
      <div className="shrink-0">
        <MapPlaceholder />
      </div>

      {/* ─── Business list ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain bg-page-bg">
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <p className="text-xs font-vazirmatn text-neutral-500">
            {filtered.length === 0 ? "نتیجه‌ای یافت نشد" : `${filtered.length} کسب‌وکار نزدیک`}
          </p>
          <div className="flex items-center gap-1">
            <MapPinIcon size={12} className="text-blue-500" />
            <span className="text-xs font-vazirmatn text-blue-500">
              {province === "همه" ? "همه مناطق" : province}
            </span>
          </div>
        </div>

        <div className="px-4 pt-1 pb-24 space-y-3">
          {filtered.length === 0 ? (
            <motion.div className="flex flex-col items-center justify-center py-16 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MapPinIcon size={40} className="text-neutral-300" />
              <p className="text-sm font-vazirmatn text-neutral-400">کسب‌وکاری یافت نشد</p>
            </motion.div>
          ) : (
            filtered.map((b, i) => (
              <motion.div key={b.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <BusinessCardHorizontal business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ─── Bottom Nav ─────────────────────────────── */}
      <BottomNav />
    </div>
  );
}
