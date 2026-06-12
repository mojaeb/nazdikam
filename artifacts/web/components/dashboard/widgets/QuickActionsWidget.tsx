import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  path: string;
  color: string;
  bg: string;
  iconBg: string;
  icon: React.ReactNode;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "add-product",
    label: "افزودن محصول",
    description: "محصول جدید اضافه کنید",
    path: "/business/listings/new",
    color: "text-blue-700",
    bg: "hover:bg-blue-50",
    iconBg: "bg-blue-100 text-blue-600",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    id: "add-service",
    label: "افزودن خدمت",
    description: "خدمت جدید تعریف کنید",
    path: "/business/listings/new",
    color: "text-purple-700",
    bg: "hover:bg-purple-50",
    iconBg: "bg-purple-100 text-purple-600",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "edit-profile",
    label: "ویرایش پروفایل",
    description: "اطلاعات کسب‌وکار را ویرایش کنید",
    path: "/business/profile",
    color: "text-green-700",
    bg: "hover:bg-green-50",
    iconBg: "bg-green-100 text-green-600",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    id: "create-promotion",
    label: "ایجاد تبلیغ",
    description: "کمپین تبلیغاتی بسازید",
    path: "/dashboard/promotions",
    color: "text-amber-700",
    bg: "hover:bg-amber-50",
    iconBg: "bg-amber-100 text-amber-600",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
];

export function QuickActionsWidget() {
  const [, navigate] = useLocation();

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
    >
      <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base mb-4">دسترسی سریع</h2>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            type="button"
            className={cn(
              "flex flex-col items-start gap-2 p-3 rounded-2xl border border-neutral-100 transition-colors text-start",
              action.bg
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
            onClick={() => navigate(action.path)}
            aria-label={action.label}
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", action.iconBg)}>
              {action.icon}
            </div>
            <div>
              <p className={cn("font-vazirmatn font-bold text-sm", action.color)}>{action.label}</p>
              <p className="font-vazirmatn text-[11px] text-neutral-400 mt-0.5 leading-tight">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
