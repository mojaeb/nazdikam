/* ─── Types ───────────────────────────────────────────── */
export type NotifCategory = "lead" | "review" | "system" | "subscription" | "promotion";

export interface DashboardNotification {
  id:         string;
  category:   NotifCategory;
  isRead:     boolean;
  title:      string;
  message:    string;
  timeAgo:    string;
  createdAt:  string;
  actionLabel?: string;
  actionHref?:  string;
  icon?:       string; /* emoji */
}

/* ─── Labels & colors ─────────────────────────────────── */
export const NOTIF_CATEGORY_LABELS: Record<NotifCategory, string> = {
  lead:         "لیدها",
  review:       "نظرات",
  system:       "سیستم",
  subscription: "اشتراک",
  promotion:    "تبلیغات",
};

export const NOTIF_CATEGORY_COLORS: Record<NotifCategory, { bg: string; text: string; dot: string }> = {
  lead:         { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  review:       { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  system:       { bg: "bg-neutral-100",text: "text-neutral-600", dot: "bg-neutral-500" },
  subscription: { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-500" },
  promotion:    { bg: "bg-teal-50",    text: "text-teal-700",    dot: "bg-teal-500" },
};

/* ─── Mock data ───────────────────────────────────────── */
export const mockNotifications: DashboardNotification[] = [
  { id:"n01", category:"lead",         isRead:false, icon:"📞", title:"لید جدید — تماس تلفنی",          message:"علی محمدی روی شماره تماس شما کلیک کرد (محصول: عسل طبیعی ۱ کیلو)",           timeAgo:"۲ ساعت پیش",  createdAt:"۱۴۰۴/۰۶/۱۶", actionLabel:"مشاهده لید",   actionHref:"/dashboard/leads/l01" },
  { id:"n02", category:"lead",         isRead:false, icon:"💬", title:"لید جدید — واتساپ",               message:"فاطمه رضایی از واتساپ تماس گرفت (کلاس باریستا)",                              timeAgo:"۴ ساعت پیش",  createdAt:"۱۴۰۴/۰۶/۱۶", actionLabel:"مشاهده لید",   actionHref:"/dashboard/leads/l02" },
  { id:"n03", category:"review",       isRead:false, icon:"⭐", title:"نظر جدید — ۵ ستاره",              message:"فاطمه احمدی نظر ۵ ستاره‌ای برای کلاس باریستا گذاشت",                         timeAgo:"دیروز",        createdAt:"۱۴۰۴/۰۶/۱۵", actionLabel:"پاسخ دادن",    actionHref:"/dashboard/reviews" },
  { id:"n04", category:"lead",         isRead:false, icon:"📋", title:"درخواست مشاوره جدید",             message:"رضا کریمی درخواست مشاوره برای رزرو فضای خصوصی ارسال کرد",                     timeAgo:"دیروز",        createdAt:"۱۴۰۴/۰۶/۱۵", actionLabel:"مشاهده لید",   actionHref:"/dashboard/leads/l03" },
  { id:"n05", category:"subscription", isRead:true,  icon:"🔔", title:"اشتراک شما ۴۷ روز دیگر منقضی می‌شود", message:"برای جلوگیری از قطع خدمات، اشتراک خود را تمدید کنید",                 timeAgo:"۲ روز پیش",   createdAt:"۱۴۰۴/۰۶/۱۴", actionLabel:"تمدید اشتراک", actionHref:"/dashboard/subscription" },
  { id:"n06", category:"review",       isRead:true,  icon:"⚠️", title:"نظر منفی — نیاز به پاسخ",         message:"امیر صالحی نظر ۲ ستاره‌ای گذاشته و منتظر پاسخ شما است",                      timeAgo:"۳ روز پیش",   createdAt:"۱۴۰۴/۰۶/۱۳", actionLabel:"پاسخ دادن",    actionHref:"/dashboard/reviews" },
  { id:"n07", category:"system",       isRead:true,  icon:"✅", title:"پروفایل تأیید شد",                 message:"پروفایل کافه کتاب آرمان توسط تیم نزدیکام بررسی و تأیید شد",                  timeAgo:"۴ روز پیش",   createdAt:"۱۴۰۴/۰۶/۱۲" },
  { id:"n08", category:"lead",         isRead:true,  icon:"💰", title:"استعلام قیمت — چای لاهیجان",       message:"مریم حسینی درباره قیمت عمده چای لاهیجان سؤال کرد",                            timeAgo:"۴ روز پیش",   createdAt:"۱۴۰۴/۰۶/۱۲", actionLabel:"مشاهده لید",   actionHref:"/dashboard/leads/l04" },
  { id:"n09", category:"promotion",    isRead:true,  icon:"📣", title:"فرصت تبلیغات ویژه",               message:"تا پایان شهریور با ۳۰٪ تخفیف در صفحه اصلی نزدیکام تبلیغ کنید",               timeAgo:"۵ روز پیش",   createdAt:"۱۴۰۴/۰۶/۱۱", actionLabel:"مشاهده طرح",   actionHref:"/dashboard/promotions" },
  { id:"n10", category:"system",       isRead:true,  icon:"📊", title:"گزارش هفتگی آماده است",            message:"خلاصه عملکرد هفته گذشته: ۱۶ لید جدید، ۸۴۳ بازدید، ۴.۷ امتیاز",             timeAgo:"۶ روز پیش",   createdAt:"۱۴۰۴/۰۶/۱۰", actionLabel:"مشاهده آمار",  actionHref:"/dashboard/analytics" },
  { id:"n11", category:"review",       isRead:true,  icon:"⭐", title:"نظر جدید — ۵ ستاره",              message:"سعید نوروزی درباره فضای کافه نظر ۵ ستاره‌ای گذاشت",                          timeAgo:"۱ هفته پیش",  createdAt:"۱۴۰۴/۰۶/۰۹" },
  { id:"n12", category:"lead",         isRead:true,  icon:"📋", title:"درخواست مشاوره — رزرو ۵۰ نفره",   message:"پریسا ملکی برای رزرو فضای ۵۰ نفره عقد کوچک تماس گرفت",                       timeAgo:"۱ هفته پیش",  createdAt:"۱۴۰۴/۰۶/۰۹", actionLabel:"مشاهده لید",   actionHref:"/dashboard/leads/l17" },
  { id:"n13", category:"system",       isRead:true,  icon:"🚀", title:"قابلیت جدید: گالری تصاویر",        message:"اکنون می‌توانید تا ۵ تصویر برای گالری کسب‌وکار خود آپلود کنید",               timeAgo:"۱۰ روز پیش",  createdAt:"۱۴۰۴/۰۶/۰۶" },
  { id:"n14", category:"subscription", isRead:true,  icon:"💳", title:"پلان پایه فعال است",               message:"اشتراک پایه شما تا ۱۵ شهریور ۱۴۰۵ فعال است",                                  timeAgo:"۱۴ روز پیش",  createdAt:"۱۴۰۴/۰۶/۰۲" },
  { id:"n15", category:"promotion",    isRead:true,  icon:"🎯", title:"نزدیکام روز: ترافیک ۲ برابر",      message:"هفته آینده نزدیکام روز برگزار می‌شود. صفحه خود را آماده کنید",                  timeAgo:"۱۵ روز پیش",  createdAt:"۱۴۰۴/۰۶/۰۱", actionLabel:"جزئیات بیشتر", actionHref:"/dashboard/promotions" },
];
