import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronStartIcon, MapPinIcon, StoreIcon, UserIcon } from "@/components/icons";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl font-iran-yekan-x font-bold text-blue-600">{value}</p>
      <p className="text-xs font-vazirmatn text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

export default function AboutPage() {
  const [, navigate] = useLocation();
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg pb-12">
      <div className="sticky top-0 z-20 bg-white shadow-sm flex items-center gap-3 px-4 h-14">
        <button type="button" onClick={() => navigate(-1 as unknown as string)} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <ChevronStartIcon size={18} className="text-neutral-700" />
        </button>
        <h1 className="text-base font-iran-yekan-x font-bold text-neutral-900">درباره نزدیکام</h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center mb-4">
            <p className="text-4xl font-iran-yekan-x font-bold text-white">نزدیکام</p>
          </div>
          <p className="text-body font-vazirmatn text-neutral-700 leading-relaxed">
            نزدیکام یک بازار محلی دیجیتال برای شمال ایران است که کسب‌وکارهای محلی را به مشتریان نزدیک می‌کند.
            ما اعتقاد داریم که بهترین محصولات و خدمات همیشه در نزدیکی شما هستند.
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-3 gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard value="+۷۰۰" label="کسب‌وکار" />
          <StatCard value="+۳" label="استان" />
          <StatCard value="+۵۰۰۰" label="کاربر" />
        </motion.div>

        <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-base font-iran-yekan-x font-bold text-neutral-900">ما در کجاییم؟</h2>
          <div className="space-y-3">
            {[
              { icon: <MapPinIcon size={16} />, title: "مازندران", desc: "بابل، ساری، آمل، نوشهر" },
              { icon: <MapPinIcon size={16} />, title: "گیلان", desc: "رشت، لاهیجان، بندر انزلی" },
              { icon: <MapPinIcon size={16} />, title: "گلستان", desc: "گرگان، گنبد کاووس" },
            ].map(item => (
              <div key={item.title} className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">{item.icon}</div>
                <div>
                  <p className="text-sm font-iran-yekan-x font-bold text-neutral-800">{item.title}</p>
                  <p className="text-xs font-vazirmatn text-neutral-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-base font-iran-yekan-x font-bold text-neutral-900">چرا نزدیکام؟</h2>
          <div className="space-y-3">
            {[
              { icon: <StoreIcon size={16} />, title: "محصولات اصیل محلی", desc: "مستقیم از تولیدکنندگان شمال ایران" },
              { icon: <UserIcon size={16} />, title: "کسب‌وکارهای تأیید شده", desc: "هر کسب‌وکار بررسی و تأیید می‌شود" },
              { icon: <MapPinIcon size={16} />, title: "بر اساس موقعیت", desc: "نزدیک‌ترین گزینه‌ها را ببینید" },
            ].map(item => (
              <div key={item.title} className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">{item.icon}</div>
                <div>
                  <p className="text-sm font-iran-yekan-x font-bold text-neutral-800">{item.title}</p>
                  <p className="text-xs font-vazirmatn text-neutral-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card p-5 bg-blue-600 text-white rounded-2xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <p className="text-sm font-iran-yekan-x font-bold">کسب‌وکار دارید؟</p>
          <p className="text-xs font-vazirmatn text-white/80 mt-1 mb-4">رایگان ثبت کنید و مشتریان محلی پیدا کنید.</p>
          <button type="button" onClick={() => navigate("/dashboard")} className="w-full h-10 rounded-xl bg-white text-blue-700 text-sm font-iran-yekan-x font-bold">
            ثبت کسب‌وکار
          </button>
        </motion.div>
      </div>
    </div>
  );
}
