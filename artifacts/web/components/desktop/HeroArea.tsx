import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessCardFeatured } from "@/components/business/BusinessCardFeatured";
import { heroSlides } from "@/lib/mock-data";
import { mockBusinesses } from "@/lib/mock-businesses";

const SLIDE_DURATION = 4500;

const featuredBusinesses = mockBusinesses.filter(b => b.featured).slice(0, 2);

function ArrowButton({ direction, onClick }: { direction: "start" | "end"; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white z-20 transition-colors"
      style={direction === "start" ? { insetInlineStart: "12px" } : { insetInlineEnd: "12px" }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={direction === "start" ? "اسلاید قبلی" : "اسلاید بعدی"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {direction === "start"
          ? <polyline points="9 18 15 12 9 6" />
          : <polyline points="15 18 9 12 15 6" />
        }
      </svg>
    </motion.button>
  );
}

export function HeroArea() {
  const [, navigate] = useLocation();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setCurrent(c => (c + 1) % heroSlides.length), SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [current, paused]);

  const prev = () => setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent(c => (c + 1) % heroSlides.length);

  return (
    <section className="bg-white py-10" aria-label="محتوای اصلی">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="grid gap-6" style={{ gridTemplateColumns: "340px 1fr" }}>
          {/* Start (right in RTL): Featured businesses sidebar */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-lg">کسب‌وکارهای برگزیده</h2>
              <button
                type="button"
                className="text-xs font-vazirmatn text-blue-600 hover:text-blue-700"
                onClick={() => navigate("/search")}
              >
                همه
              </button>
            </div>
            {featuredBusinesses.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <BusinessCardFeatured business={b} />
              </motion.div>
            ))}
          </div>

          {/* End (left in RTL): Hero carousel */}
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{ minHeight: 420 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              {heroSlides.map((slide, i) =>
                i !== current ? null : (
                  <motion.div
                    key={slide.id}
                    className="absolute inset-0 flex flex-col justify-end p-10"
                    style={{ background: slide.accentGradient }}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.55 }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 max-w-lg">
                      <span className="inline-block h-6 px-3 rounded-xl bg-white/20 text-white text-xs font-vazirmatn font-bold mb-4">
                        {slide.tag}
                      </span>
                      <h2 className="font-iran-yekan-x font-bold text-white text-3xl leading-tight mb-3">
                        {slide.title}
                      </h2>
                      <p className="text-white/80 font-vazirmatn text-sm mb-6 leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 h-12 px-7 rounded-2xl bg-white text-neutral-900 font-vazirmatn font-bold text-sm hover:bg-neutral-100 transition-colors shadow-lg"
                        onClick={() => navigate("/categories")}
                      >
                        {slide.cta}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-6 end-8 flex gap-2">
                      {heroSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`rounded-full transition-all ${idx === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
                          onClick={() => setCurrent(idx)}
                          aria-label={`اسلاید ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>

            <ArrowButton direction="start" onClick={prev} />
            <ArrowButton direction="end" onClick={next} />
          </div>
        </div>
      </div>
    </section>
  );
}
