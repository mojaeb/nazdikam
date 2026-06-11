import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronStartIcon } from "@/components/icons";

const SECTIONS = [
  {
    title: "۱. پذیرش شرایط",
    body: "با استفاده از پلتفرم نزدیکام، شما شرایط استفاده زیر را می‌پذیرید. لطفاً قبل از استفاده این شرایط را به دقت مطالعه کنید.",
  },
  {
    title: "۲. ثبت‌نام و حساب کاربری",
    body: "کاربران موظفند اطلاعات دقیق و صادقانه ارائه دهند. هر کاربر مسئول امنیت حساب کاربری خود است. نزدیکام حق دارد در صورت تخلف، حساب را تعلیق کند.",
  },
  {
    title: "۳. قوانین کسب‌وکارها",
    body: "کسب‌وکارهای ثبت‌شده موظفند اطلاعات صحیح و به‌روز ارائه دهند. تبلیغ محصولات غیرقانونی یا مضر ممنوع است. نزدیکام حق تأیید یا رد هر کسب‌وکار را دارد.",
  },
  {
    title: "۴. حریم خصوصی",
    body: "نزدیکام اطلاعات شخصی کاربران را بدون اجازه با اشخاص ثالث به اشتراک نمی‌گذارد. داده‌های موقعیت مکانی فقط برای بهبود تجربه کاربری استفاده می‌شود.",
  },
  {
    title: "۵. مسئولیت محدود",
    body: "نزدیکام یک بستر کشف و ارتباط است. مسئولیت کیفیت محصولات یا خدمات ارائه‌شده توسط کسب‌وکارهای عضو بر عهده آن کسب‌وکارها است.",
  },
  {
    title: "۶. تغییرات در شرایط",
    body: "نزدیکام حق دارد این شرایط را در هر زمان تغییر دهد. ادامه استفاده از پلتفرم پس از اطلاع‌رسانی به معنی پذیرش تغییرات جدید است.",
  },
];

export default function TermsPage() {
  const [, navigate] = useLocation();
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg pb-12">
      <div className="sticky top-0 z-20 bg-white shadow-sm flex items-center gap-3 px-4 h-14">
        <button type="button" onClick={() => navigate(-1 as unknown as string)} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <ChevronStartIcon size={18} className="text-neutral-700" />
        </button>
        <h1 className="text-base font-iran-yekan-x font-bold text-neutral-900">قوانین و مقررات</h1>
      </div>

      <div className="px-4 pt-6 space-y-5">
        <motion.p className="text-xs font-vazirmatn text-neutral-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          آخرین بروزرسانی: خرداد ۱۴۰۴
        </motion.p>

        {SECTIONS.map((sec, i) => (
          <motion.div key={sec.title} className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">{sec.title}</h2>
            <p className="text-sm font-vazirmatn text-neutral-600 leading-relaxed">{sec.body}</p>
          </motion.div>
        ))}

        <motion.div className="card p-4 bg-neutral-50 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <p className="text-xs font-vazirmatn text-neutral-500 text-center">
            برای سوالات حقوقی با ما تماس بگیرید:{" "}
            <span className="text-blue-500">legal@nazdikam.ir</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
