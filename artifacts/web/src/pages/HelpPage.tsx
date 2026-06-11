import { useLocation } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronStartIcon } from "@/components/icons";

const FAQS = [
  { q: "چطور یک کسب‌وکار ثبت کنم؟", a: "از طریق داشبورد (حساب کاربری → ورود به پنل کسب‌وکار) اطلاعات کسب‌وکارتان را وارد کنید. تیم ما ظرف ۲۴ ساعت بررسی و تأیید می‌کند." },
  { q: "آیا ثبت کسب‌وکار رایگان است؟", a: "بله، ثبت پایه کاملاً رایگان است. برای ویژگی‌های پیشرفته مثل پروموشن و ظاهر ویژه، پلن‌های اشتراک وجود دارد." },
  { q: "چطور با یک کسب‌وکار تماس بگیرم؟", a: "در صفحه کسب‌وکار گزینه‌های «تماس»، «واتساپ» و «درخواست مشاوره» وجود دارد. می‌توانید مستقیم تماس بگیرید." },
  { q: "چطور یک محصول را ذخیره کنم؟", a: "روی آیکون قلب یا ذخیره در کارت محصول یا کسب‌وکار کلیک کنید. موارد ذخیره‌شده در حساب کاربری شما نگهداری می‌شوند." },
  { q: "آیا امکان خرید آنلاین وجود دارد؟", a: "در حال حاضر نزدیکام یک بستر کشف و ارتباط است. خرید مستقیم از طریق تماس با کسب‌وکار انجام می‌شود." },
  { q: "نزدیکام در چه شهرهایی فعال است؟", a: "در حال حاضر در سه استان مازندران، گیلان و گلستان فعال هستیم. به‌زودی به سایر استان‌ها گسترش می‌یابیم." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-3.5 text-start">
        <p className="text-sm font-iran-yekan-x font-bold text-neutral-800 leading-snug">{q}</p>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-neutral-400 shrink-0 ms-2 text-lg">›</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="px-4 pb-4 text-sm font-vazirmatn text-neutral-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [, navigate] = useLocation();
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg pb-12">
      <div className="sticky top-0 z-20 bg-white shadow-sm flex items-center gap-3 px-4 h-14">
        <button type="button" onClick={() => navigate(-1 as unknown as string)} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <ChevronStartIcon size={18} className="text-neutral-700" />
        </button>
        <h1 className="text-base font-iran-yekan-x font-bold text-neutral-900">راهنما و پشتیبانی</h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-base font-iran-yekan-x font-bold text-neutral-900 mb-3">سوالات متداول</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card p-5 bg-blue-50 border border-blue-100 space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <p className="text-sm font-iran-yekan-x font-bold text-blue-800">نیاز به کمک بیشتری دارید؟</p>
          <p className="text-xs font-vazirmatn text-blue-600">تیم پشتیبانی ما شنبه تا پنجشنبه ۹–۱۷ آماده پاسخگویی است.</p>
          <button type="button" onClick={() => navigate("/contact")} className="mt-2 h-10 px-5 rounded-xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold">
            تماس با پشتیبانی
          </button>
        </motion.div>
      </div>
    </div>
  );
}
