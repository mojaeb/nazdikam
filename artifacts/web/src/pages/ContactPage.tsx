import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronStartIcon } from "@/components/icons";

export default function ContactPage() {
  const [, navigate] = useLocation();
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg pb-12">
      <div className="sticky top-0 z-20 bg-white shadow-sm flex items-center gap-3 px-4 h-14">
        <button type="button" onClick={() => navigate(-1 as unknown as string)} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <ChevronStartIcon size={18} className="text-neutral-700" />
        </button>
        <h1 className="text-base font-iran-yekan-x font-bold text-neutral-900">تماس با ما</h1>
      </div>

      <div className="px-4 pt-6 space-y-5">
        <motion.p className="text-body font-vazirmatn text-neutral-600 leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          برای ارتباط با تیم پشتیبانی نزدیکام از روش‌های زیر استفاده کنید.
        </motion.p>

        {[
          { label: "ایمیل پشتیبانی", value: "support@nazdikam.ir", icon: "✉️" },
          { label: "واتساپ", value: "۰۹۱۲-XXX-XXXX", icon: "💬" },
          { label: "تلگرام", value: "@nazdikam", icon: "📱" },
          { label: "ساعت پاسخگویی", value: "شنبه تا پنجشنبه ۹–۱۷", icon: "🕐" },
        ].map((item, i) => (
          <motion.div key={item.label} className="card p-4 flex items-center gap-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-xs font-vazirmatn text-neutral-500">{item.label}</p>
              <p className="text-sm font-iran-yekan-x font-bold text-neutral-800 mt-0.5">{item.value}</p>
            </div>
          </motion.div>
        ))}

        <motion.div className="card p-5 space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-base font-iran-yekan-x font-bold text-neutral-900">ارسال پیام</h2>
          <input type="text" placeholder="نام و نام خانوادگی" className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <input type="tel" placeholder="شماره تماس" className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn focus:outline-none focus:ring-2 focus:ring-blue-300" dir="ltr" />
          <textarea placeholder="پیام خود را بنویسید..." rows={4} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-vazirmatn resize-none focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <button type="button" className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold">ارسال پیام</button>
        </motion.div>
      </div>
    </div>
  );
}
