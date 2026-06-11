/* ─── Types ───────────────────────────────────────────── */
export interface Review {
  id:            string;
  authorName:    string;
  avatarColor:   string;
  rating:        number;  /* 1–5 */
  text:          string;
  productName?:  string;
  serviceName?:  string;
  createdAt:     string;
  timeAgo:       string;
  reply?:        string;
  repliedAt?:    string;
  tags?:         string[];
  isVerified?:   boolean;
}

/* ─── Helpers ─────────────────────────────────────────── */
export function reviewSummary(reviews: Review[]) {
  const total = reviews.length;
  const avg   = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const replied = reviews.filter(r => r.reply).length;
  const dist  = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
    pct: total ? Math.round(reviews.filter(r => r.rating === n).length / total * 100) : 0,
  }));
  return { total, avg: Math.round(avg * 10) / 10, replied, responseRate: total ? Math.round(replied / total * 100) : 0, dist };
}

/* ─── Mock data ───────────────────────────────────────── */
const AC = ["#0A7EA4","#7C3AED","#B45309","#047857","#1860DB","#BE185D","#0369A1","#065F46","#9333EA","#92400E"];
const av = (i: number) => AC[i % AC.length];

export const mockReviews: Review[] = [
  {
    id: "r01", authorName: "فاطمه احمدی", avatarColor: av(0), rating: 5,
    text: "کافه‌ای فوق‌العاده! قهوه‌شون بی‌نظیره و فضا خیلی آروم و صمیمیه. کتاب‌های خوبی هم دارن. حتماً دوباره میام.",
    productName: "کلاس باریستا", createdAt: "۱۴۰۴/۰۶/۱۶", timeAgo: "دیروز", isVerified: true,
    tags: ["کیفیت عالی", "فضای خوب"],
    reply: "ممنون از لطف شما! خوشحالیم که تجربه خوبی داشتید. منتظر دیدارتون هستیم 😊", repliedAt: "۱۴۰۴/۰۶/۱۶",
  },
  {
    id: "r02", authorName: "علی رضایی", avatarColor: av(1), rating: 5,
    text: "عسل طبیعیشون واقعاً عالیه. مستقیم از زنبوردار محلیه و خالص. قیمتم مناسبه.",
    productName: "عسل طبیعی ۱ کیلو", createdAt: "۱۴۰۴/۰۶/۱۵", timeAgo: "۲ روز پیش", isVerified: true,
  },
  {
    id: "r03", authorName: "مریم کریمی", avatarColor: av(2), rating: 4,
    text: "چای لاهیجانشون خوشبوئه اما قیمت کمی بالاست. در کل کیفیت خوبیه.",
    productName: "چای لاهیجان ۵۰۰گرم", createdAt: "۱۴۰۴/۰۶/۱۴", timeAgo: "۳ روز پیش",
    reply: "ممنون از نظرتون. چای ما مستقیم از باغات لاهیجان تهیه می‌شه و بدون افزودنی‌ه.", repliedAt: "۱۴۰۴/۰۶/۱۵",
  },
  {
    id: "r04", authorName: "رضا موسوی", avatarColor: av(3), rating: 5,
    text: "بهترین کلاس باریستا که رفتم! استاد خیلی حرفه‌ای و صبوریه. بعد از ۴ جلسه تونستم اسپرسوی خوب درست کنم.",
    serviceName: "کلاس باریستا", createdAt: "۱۴۰۴/۰۶/۱۳", timeAgo: "۴ روز پیش", isVerified: true,
    tags: ["استاد حرفه‌ای", "آموزش عملی"],
  },
  {
    id: "r05", authorName: "زهرا حسینی", avatarColor: av(4), rating: 3,
    text: "کیک شکلاتیشون ازش توقع بیشتری داشتم. شیرینی زیاده و خامه خوب نیست. ولی قهوه‌اش خوب بود.",
    productName: "کیک شکلاتی خانگی", createdAt: "۱۴۰۴/۰۶/۱۲", timeAgo: "۵ روز پیش",
    reply: "از صداقت شما ممنونیم. دستور پخت کیک رو بررسی می‌کنیم.", repliedAt: "۱۴۰۴/۰۶/۱۳",
  },
  {
    id: "r06", authorName: "سعید نوروزی", avatarColor: av(5), rating: 5,
    text: "جو کافه‌ای که همزمان کتابخونه هم باشه خیلی منحصربه‌فرده. یه ساعت کتاب خوندم و یه لیوان قهوه خوردم. عالی بود!",
    createdAt: "۱۴۰۴/۰۶/۱۱", timeAgo: "۶ روز پیش", isVerified: true,
    tags: ["فضای منحصربه‌فرد", "آرامش"],
  },
  {
    id: "r07", authorName: "نیلوفر اسدی", avatarColor: av(6), rating: 4,
    text: "مربای توت‌فرنگیشون خانگیه و لطیفه. با نان تازه صبحانه عالیه. پیشنهاد می‌کنم.",
    productName: "مربا توت‌فرنگی", createdAt: "۱۴۰۴/۰۶/۱۰", timeAgo: "۱ هفته پیش",
  },
  {
    id: "r08", authorName: "امیر صالحی", avatarColor: av(7), rating: 2,
    text: "متأسفانه برام ناامیدکننده بود. سفارشم دیر رسید و قهوه سرد بود. امیدوارم بهتر بشن.",
    createdAt: "۱۴۰۴/۰۶/۰۹", timeAgo: "۸ روز پیش",
    reply: "از شما عذرخواهی می‌کنیم. تأخیر قابل قبول نیست. لطفاً با ما تماس بگیرید تا جبران کنیم.", repliedAt: "۱۴۰۴/۰۶/۱۰",
  },
  {
    id: "r09", authorName: "پریسا ملکی", avatarColor: av(8), rating: 5,
    text: "قهوه اسپرسو ایتالیاییشون واقعاً درجه یکه. میزان تلخی و اسیدیته کاملاً متعادله. هر هفته میام.",
    productName: "قهوه اسپرسو ایتالیایی", createdAt: "۱۴۰۴/۰۶/۰۸", timeAgo: "۹ روز پیش", isVerified: true,
    tags: ["کیفیت عالی"],
  },
  {
    id: "r10", authorName: "داوود کوهی", avatarColor: av(9), rating: 4,
    text: "کتاب‌هایی که انتخاب کردن عمدتاً ادبیات و روانشناسیه. انتخاب خوبیه. قیمت کتاب‌ها هم استاندارده.",
    createdAt: "۱۴۰۴/۰۶/۰۷", timeAgo: "۱۰ روز پیش",
  },
  {
    id: "r11", authorName: "شیوا رحیمی", avatarColor: av(0), rating: 5,
    text: "برای اولین بار رفتم و واقعاً خوشم اومد. کادر مودب و خدمات سریع. چای ماسالا خوشمزه‌ای داشتن.",
    createdAt: "۱۴۰۴/۰۶/۰۵", timeAgo: "۱۲ روز پیش",
  },
  {
    id: "r12", authorName: "بهرام تهرانی", avatarColor: av(1), rating: 3,
    text: "فضا خوبه ولی وای‌فای قطع و وصله. برای کار کردن مناسب نیست. امیدوارم درستش کنن.",
    createdAt: "۱۴۰۴/۰۶/۰۳", timeAgo: "۱۴ روز پیش",
    reply: "حق با شماست. مشکل وای‌فای رو برطرف کردیم. دوباره بیاید!", repliedAt: "۱۴۰۴/۰۶/۰۵",
  },
  {
    id: "r13", authorName: "ندا قاسمی", avatarColor: av(2), rating: 5,
    text: "بهترین کافه لاهیجانه. دوستم از تهران اومده بود و خیلی ازش تعریف کرد. حتماً دوباره می‌آییم.",
    createdAt: "۱۴۰۴/۰۵/۲۸", timeAgo: "۱۸ روز پیش", isVerified: true,
    tags: ["بهترین لاهیجان"],
  },
  {
    id: "r14", authorName: "سهیل یوسفی", avatarColor: av(3), rating: 4,
    text: "عسل گون خوبیه. خالص و طبیعیه. بسته‌بندیشم قشنگه برای هدیه دادن عالیه.",
    productName: "عسل طبیعی ۱ کیلو", createdAt: "۱۴۰۴/۰۵/۲۰", timeAgo: "۲۵ روز پیش",
  },
  {
    id: "r15", authorName: "رویا عباسی", avatarColor: av(4), rating: 5,
    text: "کلاس باریستا رو گرفتم و الان خودم خونه اسپرسو درست می‌کنم! استاد صبور و حرفه‌ایه.",
    serviceName: "کلاس باریستا", createdAt: "۱۴۰۴/۰۵/۱۵", timeAgo: "۱ ماه پیش", isVerified: true,
    tags: ["آموزش عالی", "پیشنهاد می‌کنم"],
  },
];
