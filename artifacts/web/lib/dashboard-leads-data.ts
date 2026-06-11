/* ─── Types ───────────────────────────────────────────── */
export type LeadType =
  | "phone-click"
  | "whatsapp-click"
  | "consultation-request"
  | "price-inquiry"
  | "website-visit";

export type LeadSource =
  | "homepage"
  | "search"
  | "category"
  | "business"
  | "product"
  | "province"
  | "desktop-homepage";

export type LeadStatus = "new" | "contacted" | "archived";

export interface Lead {
  id:           string;
  type:         LeadType;
  source:       LeadSource;
  status:       LeadStatus;
  name?:        string;
  phone?:       string;
  productName?: string;
  message?:     string;
  notes?:       string;
  createdAt:    string;
  timeAgo:      string;
  avatarColor:  string;
}

/* ─── Labels ──────────────────────────────────────────── */
export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  "phone-click":           "تماس تلفنی",
  "whatsapp-click":        "واتساپ",
  "consultation-request":  "درخواست مشاوره",
  "price-inquiry":         "استعلام قیمت",
  "website-visit":         "بازدید سایت",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  "homepage":          "صفحه اصلی",
  "search":            "جستجو",
  "category":          "دسته‌بندی",
  "business":          "پروفایل کسب‌وکار",
  "product":           "صفحه محصول",
  "province":          "فیلتر استانی",
  "desktop-homepage":  "دسکتاپ — صفحه اصلی",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new:       "جدید",
  contacted: "تماس گرفته شد",
  archived:  "بایگانی",
};

/* ─── Colors ──────────────────────────────────────────── */
export const LEAD_TYPE_COLORS: Record<LeadType, { bg: string; text: string }> = {
  "phone-click":          { bg: "bg-green-100",  text: "text-green-700" },
  "whatsapp-click":       { bg: "bg-emerald-100", text: "text-emerald-700" },
  "consultation-request": { bg: "bg-blue-100",   text: "text-blue-700" },
  "price-inquiry":        { bg: "bg-amber-100",  text: "text-amber-700" },
  "website-visit":        { bg: "bg-purple-100", text: "text-purple-700" },
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  new:       { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  contacted: { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  archived:  { bg: "bg-neutral-100", text: "text-neutral-500", dot: "bg-neutral-400" },
};

export const LEAD_SOURCE_COLORS: Record<LeadSource, string> = {
  "homepage":         "#0A7EA4",
  "search":           "#7C3AED",
  "category":         "#B45309",
  "business":         "#047857",
  "product":          "#1860DB",
  "province":         "#BE185D",
  "desktop-homepage": "#0369A1",
};

/* ─── Mock data ───────────────────────────────────────── */
const AVATAR_COLORS = [
  "#0A7EA4","#7C3AED","#B45309","#047857","#1860DB",
  "#BE185D","#0369A1","#9333EA","#065F46","#92400E",
];
const av = (i: number) => AVATAR_COLORS[i % AVATAR_COLORS.length];

export const mockLeads: Lead[] = [
  { id:"l01", type:"phone-click",          source:"product",         status:"new",       name:"علی محمدی",      phone:"۰۹۱۱۱۲۳۴۵۶۷", productName:"عسل طبیعی ۱ کیلو",     message:undefined,                                                    timeAgo:"۲ ساعت پیش",    createdAt:"۱۴۰۴/۰۶/۱۶", avatarColor: av(0) },
  { id:"l02", type:"whatsapp-click",       source:"search",          status:"new",       name:"فاطمه رضایی",   phone:"۰۹۱۲۳۴۵۶۷۸۹", productName:"کلاس باریستا",          message:undefined,                                                    timeAgo:"۴ ساعت پیش",    createdAt:"۱۴۰۴/۰۶/۱۶", avatarColor: av(1) },
  { id:"l03", type:"consultation-request", source:"homepage",        status:"new",       name:"رضا کریمی",     phone:"۰۹۳۵۶۷۸۹۰۱۲", productName:undefined,               message:"آیا برای رویدادهای خصوصی هم فضا دارید؟",                    timeAgo:"۵ ساعت پیش",    createdAt:"۱۴۰۴/۰۶/۱۶", avatarColor: av(2) },
  { id:"l04", type:"price-inquiry",        source:"product",         status:"contacted", name:"مریم حسینی",    phone:"۰۹۱۸۷۶۵۴۳۲۱", productName:"چای لاهیجان ۵۰۰گرم",   message:"قیمت عمده چقدر است؟",                                       timeAgo:"دیروز",         createdAt:"۱۴۰۴/۰۶/۱۵", avatarColor: av(3), notes: "پیگیری شد — منتظر پاسخ خریدار" },
  { id:"l05", type:"phone-click",          source:"business",        status:"contacted", name:"احمد نوروزی",   phone:"۰۹۱۴۵۶۷۸۹۰۱", productName:undefined,               message:undefined,                                                    timeAgo:"دیروز",         createdAt:"۱۴۰۴/۰۶/۱۵", avatarColor: av(4) },
  { id:"l06", type:"whatsapp-click",       source:"category",        status:"new",       name:"زهرا امیری",    phone:"۰۹۳۷۱۲۳۴۵۶۷", productName:"کیک شکلاتی خانگی",     message:undefined,                                                    timeAgo:"دیروز",         createdAt:"۱۴۰۴/۰۶/۱۵", avatarColor: av(5) },
  { id:"l07", type:"website-visit",        source:"desktop-homepage",status:"new",       name:undefined,       phone:undefined,       productName:undefined,               message:undefined,                                                    timeAgo:"۲ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۴", avatarColor: av(6) },
  { id:"l08", type:"consultation-request", source:"search",          status:"new",       name:"سارا قاسمی",    phone:"۰۹۱۱۹۸۷۶۵۴۳", productName:"کلاس باریستا",          message:"آیا کلاس آنلاین هم دارید؟",                                 timeAgo:"۲ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۴", avatarColor: av(7) },
  { id:"l09", type:"price-inquiry",        source:"product",         status:"archived",  name:"حسن موسوی",     phone:"۰۹۱۳۲۱۰۹۸۷۶", productName:"عسل طبیعی ۱ کیلو",     message:"قیمت کمتر می‌شه؟",                                          timeAgo:"۳ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۳", avatarColor: av(8) },
  { id:"l10", type:"phone-click",          source:"province",        status:"contacted", name:"نرگس صادقی",    phone:"۰۹۳۳۴۵۶۷۸۹۰", productName:undefined,               message:undefined,                                                    timeAgo:"۳ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۳", avatarColor: av(9) },
  { id:"l11", type:"whatsapp-click",       source:"product",         status:"new",       name:"کیوان منصوری",  phone:"۰۹۱۷۸۹۰۱۲۳۴", productName:"مربا توت‌فرنگی",        message:undefined,                                                    timeAgo:"۴ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۲", avatarColor: av(0) },
  { id:"l12", type:"consultation-request", source:"business",        status:"contacted", name:"لیلا جعفری",    phone:"۰۹۱۶۵۴۳۲۱۰۹", productName:undefined,               message:"می‌خوام یه کلاس قهوه‌شناسی برای گروه ۱۰ نفره بگیرم",      timeAgo:"۴ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۲", avatarColor: av(1), notes: "گروه ۱۰ نفره، تاریخ هنوز مشخص نشده" },
  { id:"l13", type:"website-visit",        source:"search",          status:"archived",  name:undefined,       phone:undefined,       productName:undefined,               message:undefined,                                                    timeAgo:"۵ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۱", avatarColor: av(2) },
  { id:"l14", type:"price-inquiry",        source:"category",        status:"new",       name:"آرش کوهی",      phone:"۰۹۱۵۶۷۸۹۰۱۲", productName:"چای لاهیجان ۵۰۰گرم",   message:"قیمت جعبه ۱۰ عددی چقدر است؟",                              timeAgo:"۵ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۱", avatarColor: av(3) },
  { id:"l15", type:"phone-click",          source:"homepage",        status:"new",       name:"مهسا طاهری",    phone:"۰۹۱۰۱۲۳۴۵۶۷", productName:undefined,               message:undefined,                                                    timeAgo:"۶ روز پیش",     createdAt:"۱۴۰۴/۰۶/۱۰", avatarColor: av(4) },
  { id:"l16", type:"whatsapp-click",       source:"province",        status:"contacted", name:"داوود فتحی",    phone:"۰۹۳۸۱۲۳۴۵۶۷", productName:"کیک شکلاتی خانگی",     message:undefined,                                                    timeAgo:"۱ هفته پیش",    createdAt:"۱۴۰۴/۰۶/۰۹", avatarColor: av(5) },
  { id:"l17", type:"consultation-request", source:"desktop-homepage",status:"new",       name:"پریسا ملکی",    phone:"۰۹۱۱۰۹۸۷۶۵۴", productName:undefined,               message:"برای عقد کوچک ۵۰ نفره می‌خوایم فضا رزرو کنیم",             timeAgo:"۱ هفته پیش",    createdAt:"۱۴۰۴/۰۶/۰۹", avatarColor: av(6) },
  { id:"l18", type:"price-inquiry",        source:"search",          status:"archived",  name:"توحید رحیمی",   phone:"۰۹۱۴۳۲۱۰۹۸۷", productName:"عسل طبیعی ۱ کیلو",     message:undefined,                                                    timeAgo:"۱ هفته پیش",    createdAt:"۱۴۰۴/۰۶/۰۸", avatarColor: av(7) },
  { id:"l19", type:"phone-click",          source:"product",         status:"new",       name:"شیما ولی‌پور",  phone:"۰۹۳۵۹۸۷۶۵۴۳", productName:"قهوه اسپرسو ایتالیایی", message:undefined,                                                    timeAgo:"۸ روز پیش",     createdAt:"۱۴۰۴/۰۶/۰۸", avatarColor: av(8) },
  { id:"l20", type:"whatsapp-click",       source:"business",        status:"contacted", name:"بهنام غفاری",   phone:"۰۹۱۲۸۷۶۵۴۳۲", productName:undefined,               message:undefined,                                                    timeAgo:"۹ روز پیش",     createdAt:"۱۴۰۴/۰۶/۰۷", avatarColor: av(9) },
];
