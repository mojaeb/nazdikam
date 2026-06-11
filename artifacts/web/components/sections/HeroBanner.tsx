import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ChevronEndIcon } from "@/components/icons";

const SLIDE_DURATION = 4500;

function NorthernIranDecoration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" className="opacity-20" aria-hidden="true">
      <path d="M10 60 Q30 20 50 40 Q70 60 90 30 Q100 15 110 25" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="38" r="5" fill="white" opacity="0.4" />
      <circle cx="65" cy="52" r="4" fill="white" opacity="0.3" />
      <circle cx="95" cy="28" r="6" fill="white" opacity="0.35" />
      <path d="M20 65 L20 55 L26 55 L26 65Z M40 65 L40 50 L46 50 L46 65Z M60 65 L60 58 L66 58 L66 65Z" fill="white" opacity="0.2" />
    </svg>
  );
}

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroSlides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="px-4 pb-4">
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ height: 196 }}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[current].id}
            className="absolute inset-0 flex flex-col justify-between p-5"
            style={{ background: heroSlides[current].accentGradient }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
          >
            {/* Tag */}
            <div className="self-start">
              <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-vazirmatn px-2.5 py-1 rounded-full">
                {heroSlides[current].tag}
              </span>
            </div>

            {/* Decoration */}
            <div className="absolute top-4 start-0">
              <NorthernIranDecoration />
            </div>

            {/* Text content */}
            <div className="space-y-2">
              <h2 className="text-title-lg font-iran-yekan-x font-bold text-white leading-snug">
                {heroSlides[current].title}
              </h2>
              <p className="text-xs font-vazirmatn text-white/75 leading-relaxed line-clamp-2">
                {heroSlides[current].subtitle}
              </p>
              <motion.button
                className="mt-1 flex items-center gap-1.5 bg-white text-blue-700 text-xs font-vazirmatn font-bold px-4 py-2 rounded-xl"
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.1 }}
              >
                {heroSlides[current].cta}
                <ChevronEndIcon size={13} />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-4 end-5 flex gap-1.5">
          {heroSlides.map((_, i) => (
            <motion.button
              key={i}
              className="rounded-full bg-white transition-all duration-300"
              animate={{
                width: i === current ? 20 : 6,
                opacity: i === current ? 1 : 0.4,
              }}
              style={{ height: 6 }}
              onClick={() => setCurrent(i)}
              aria-label={`اسلاید ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
