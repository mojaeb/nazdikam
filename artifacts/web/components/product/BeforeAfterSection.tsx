import { useState } from "react";
import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import type { BeforeAfterImage } from "@/lib/product.types";

interface BeforeAfterSectionProps {
  images: BeforeAfterImage[];
  className?: string;
}

function BeforeAfterSlider({ item }: { item: BeforeAfterImage }) {
  const [split, setSplit] = useState(50);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSplit(Number(e.target.value));
  };

  return (
    <div className="relative h-52 rounded-2xl overflow-hidden select-none">
      {/* After (base layer) */}
      <div className="absolute inset-0" style={{ background: item.after }} />

      {/* Before (clipped on top) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
      >
        <div className="absolute inset-0" style={{ background: item.before }} />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Divider handle */}
      <div
        className="absolute inset-y-0 flex flex-col items-center justify-center z-10"
        style={{ left: `${split}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-0.5 h-full bg-white/80 shadow-lg" />
        <div className="absolute w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-2.5 start-3 bg-black/50 text-white text-[10px] font-vazirmatn px-2 py-0.5 rounded-md backdrop-blur-sm z-10">قبل</div>
      <div className="absolute top-2.5 end-3 bg-black/50 text-white text-[10px] font-vazirmatn px-2 py-0.5 rounded-md backdrop-blur-sm z-10">بعد</div>

      {/* Drag input */}
      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        aria-label="مقایسه قبل و بعد"
      />

      {/* Bottom label */}
      {item.label && (
        <div className="absolute bottom-2.5 inset-x-3 text-center">
          <span className="font-vazirmatn text-[11px] text-white/80 bg-black/40 px-2 py-0.5 rounded-lg backdrop-blur-sm">
            {item.label}
          </span>
        </div>
      )}
    </div>
  );
}

export function BeforeAfterSection({ images, className }: BeforeAfterSectionProps) {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) return null;

  return (
    <div className={cn("bg-white px-4 py-4", className)}>
      <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-3">
        قبل و بعد از استفاده
      </h2>
      <p className="font-vazirmatn text-xs text-neutral-400 mb-3">
        برای مقایسه، نوار جداکننده را بکشید
      </p>

      <BeforeAfterSlider item={images[active]} />

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 justify-center">
          {images.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-blue-500" : "w-1.5 bg-neutral-200"
              )}
              onClick={() => setActive(i)}
              aria-label={`تصویر ${toPersianNumerals(i + 1)}`}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
