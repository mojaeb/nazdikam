import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/lib/product.types";

interface FAQSectionProps {
  faqs: FAQ[];
  className?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 py-3.5 text-start"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={cn(
          "font-vazirmatn text-sm font-medium leading-snug flex-1",
          open ? "text-blue-700" : "text-neutral-800"
        )}>
          {faq.question}
        </span>
        <span className={cn(
          "shrink-0 transition-colors",
          open ? "text-blue-500" : "text-neutral-400"
        )}>
          <ChevronIcon open={open} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="font-vazirmatn text-sm text-neutral-600 leading-relaxed pb-4">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection({ faqs, className }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={cn("bg-white px-4 py-4", className)}>
      <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-3">
        سوالات متداول
      </h2>
      <div className="bg-neutral-50 rounded-2xl px-4 divide-y divide-neutral-100">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </div>
  );
}
