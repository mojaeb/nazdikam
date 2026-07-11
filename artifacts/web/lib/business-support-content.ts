export type TutorialVideo = {
  id: string;
  title: string;
  description: string;
  duration: string;
  gradient: string;
};

export type SupportFaq = {
  question: string;
  answer: string;
};

export type ContactChannel = {
  id: string;
  label: string;
  value: string;
  href?: string;
  icon: "mail" | "phone" | "telegram" | "clock";
};

export const SELLER_TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: "t1",
    title: "شروع کار با داشبورد",
    description: "آشنایی با منوی داشبورد، کارت‌های میانبر و بخش‌های اصلی پنل کسب‌وکار.",
    duration: "۴ دقیقه",
    gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)",
  },
  {
    id: "t2",
    title: "ثبت محصول و خدمت",
    description: "نحوه افزودن محصول، آپلود تصویر، قیمت‌گذاری و انتشار در صفحه عمومی.",
    duration: "۵ دقیقه",
    gradient: "linear-gradient(135deg, #0D9488, #065F46)",
  },
  {
    id: "t3",
    title: "ویرایش پروفایل و تماس",
    description: "تکمیل اطلاعات کسب‌وکار، لوگو، آدرس و راه‌های ارتباطی با مشتری.",
    duration: "۳ دقیقه",
    gradient: "linear-gradient(135deg, #7C3AED, #4C1D95)",
  },
  {
    id: "t4",
    title: "ویدیو و اطلاعیه",
    description: "آپلود ویدیوی معرفی و ثبت اطلاعیه‌های کوتاه مثل استخدام یا رویداد.",
    duration: "۴ دقیقه",
    gradient: "linear-gradient(135deg, #EA580C, #9A3412)",
  },
  {
    id: "t5",
    title: "احراز هویت و تیک آبی",
    description: "ارسال مدارک حقیقی یا حقوقی برای دریافت نشان تأیید در صفحه عمومی.",
    duration: "۳ دقیقه",
    gradient: "linear-gradient(135deg, #0891B2, #155E75)",
  },
];

export const SELLER_FAQS: SupportFaq[] = [
  {
    question: "چطور اولین محصول را اضافه کنم؟",
    answer: "از داشبورد کسب‌وکار وارد بخش «محصولات» شوید و با دکمه + فرم را پر کنید. پس از ذخیره، محصول در صفحه عمومی شما نمایش داده می‌شود.",
  },
  {
    question: "تفاوت پلان‌های اشتراک چیست؟",
    answer: "پلان پایه رایگان است و محدودیت تعداد محصول/خدمت دارد. پلان‌های پیشرفته و حرفه‌ای امکاناتی مثل ویدیو، اطلاعیه، آمار و پشتیبانی اختصاصی را فعال می‌کنند.",
  },
  {
    question: "چطور تیک تأیید (آبی) بگیرم؟",
    answer: "از بخش «احراز هویت» مدارک حقیقی یا حقوقی را ارسال کنید. پس از بررسی تیم پشتیبانی، تیک تأیید در صفحه عمومی کسب‌وکار نمایش داده می‌شود.",
  },
  {
    question: "آیا می‌توانم چند کسب‌وکار داشته باشم؟",
    answer: "بله. از حساب کاربری می‌توانید کسب‌وکار جدید ثبت کنید و بین کسب‌وکارها جابه‌جا شوید.",
  },
  {
    question: "تیکت پشتیبانی چقدر طول می‌کشد تا پاسخ بگیرد؟",
    answer: "معمولاً ظرف ۱ تا ۲ روز کاری پاسخ داده می‌شود. مشترکین پلان حرفه‌ای اولویت بالاتری در صف پشتیبانی دارند.",
  },
  {
    question: "چطور ویدیو معرفی آپلود کنم؟",
    answer: "در پلان‌های دارای امکان ویدیو، از بخش «ویدیوها» در داشبورد با دکمه + ویدیو و کاور را آپلود کنید.",
  },
];

export const NAZDIKAM_CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "mail",
    label: "ایمیل پشتیبانی",
    value: "support@nazdikam.ir",
    href: "mailto:support@nazdikam.ir",
    icon: "mail",
  },
  {
    id: "telegram",
    label: "تلگرام",
    value: "@nazdikam",
    href: "https://t.me/nazdikam",
    icon: "telegram",
  },
  {
    id: "hours",
    label: "ساعت پاسخگویی",
    value: "شنبه تا پنجشنبه، ۹ تا ۱۷",
    icon: "clock",
  },
];

export const NAZDIKAM_ABOUT = {
  title: "درباره نزدیکام",
  summary:
    "نزدیکام بازار محلی دیجیتال شمال ایران است که کسب‌وکارهای محلی را به مشتریان نزدیک وصل می‌کند. هدف ما کمک به رشد کسب‌وکارهای بومی از طریق حضور آنلاین ساده و مؤثر است.",
  highlights: [
    { title: "حضور محلی", desc: "تمرکز بر مازندران، گیلان و گلستان" },
    { title: "کسب‌وکار واقعی", desc: "صفحه اختصاصی، محصول، خدمت و ویدیو" },
    { title: "ارتباط مستقیم", desc: "تماس و مشاوره بدون واسطه با مشتری" },
  ],
  stats: [
    { value: "+۷۰۰", label: "کسب‌وکار" },
    { value: "+۳", label: "استان" },
    { value: "+۵۰۰۰", label: "کاربر" },
  ],
};
