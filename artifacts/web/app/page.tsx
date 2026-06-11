import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip, ChipSet } from "@/components/ui/chip";
import { Skeleton, SkeletonCard, SkeletonListItem, SkeletonHero } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import {
  SearchIcon,
  MapPinIcon,
  HeartIcon,
  StarFilledIcon,
  VerifiedIcon,
  StoreIcon,
  PhoneIcon,
  ClockIcon,
  FilterIcon,
  ChevronEndIcon,
  BellIcon,
  GridIcon,
  ListIcon,
  PlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  HeartFilledIcon,
} from "@/components/icons";
import { avatarGradientIndex, avatarInitial } from "@/lib/utils";

function ColorSwatch({ name, value, textDark = false }: { name: string; value: string; textDark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-12 h-12 rounded-xl shadow-elevation-1"
        style={{ background: value }}
      />
      <span className={`text-[10px] font-mono text-center leading-tight ${textDark ? "text-neutral-800" : "text-neutral-500"}`}>
        {name}
      </span>
    </div>
  );
}

function ElevationCard({ level, label }: { level: 0 | 1 | 2 | 3 | 4; label: string }) {
  const shadowMap = {
    0: "none",
    1: "var(--shadow-elevation-1)",
    2: "var(--shadow-elevation-2)",
    3: "var(--shadow-elevation-3)",
    4: "var(--shadow-elevation-4)",
  };
  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col gap-1 min-w-[120px] items-center"
      style={{ boxShadow: shadowMap[level] }}
    >
      <span className="text-title text-neutral-800 font-iran-yekan-x">E-{level}</span>
      <span className="text-caption text-neutral-400">{label}</span>
    </div>
  );
}

function LetterAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const idx = avatarGradientIndex(name);
  return (
    <div
      className="flex items-center justify-center rounded-xl font-bold text-white font-iran-yekan-x shrink-0"
      style={{
        width: size,
        height: size,
        background: `var(--avatar-gradient-${idx})`,
        fontSize: size * 0.38,
      }}
    >
      {avatarInitial(name)}
    </div>
  );
}

const SAMPLE_CATEGORIES = [
  { id: "1", label: "رستوران", count: 142 },
  { id: "2", label: "مبلمان" },
  { id: "3", label: "پوشاک", count: 89 },
  { id: "4", label: "الکترونیک", count: 56 },
  { id: "5", label: "خودرو" },
  { id: "6", label: "خدمات", count: 203 },
];

const SAMPLE_BUSINESSES = [
  { name: "رستوران دریا", category: "رستوران", location: "بابل", rating: 4.8, reviews: 124, verified: true, price: "۱۵۰٬۰۰۰ تومان" },
  { name: "کافه شمال", category: "کافه", location: "ساری", rating: 4.5, reviews: 67, verified: false, price: "۸۰٬۰۰۰ تومان" },
  { name: "پوشاک ساحل", category: "پوشاک", location: "رامسر", rating: 4.2, reviews: 31, verified: true, price: "۲۵۰٬۰۰۰ تومان" },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-page-bg" dir="rtl">
      {/* Header */}
      <div className="gradient-teal px-4 pt-14 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-display text-white font-iran-yekan-x">نزدیکام</h1>
              <p className="text-body-sm text-white/70 mt-0.5 font-vazirmatn">سیستم طراحی — Design System v1</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                <BellIcon size={20} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                <SearchIcon size={20} />
              </button>
            </div>
          </div>
          {/* Search bar preview */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center pe-4 ps-4 gap-3 bg-white rounded-xl shadow-elevation-2 z-10 pointer-events-none">
              <SearchIcon size={18} className="text-neutral-400 shrink-0" />
              <span className="text-body text-neutral-400 font-vazirmatn">جستجو در نزدیکام…</span>
              <div className="flex-1" />
              <div className="flex items-center gap-1 text-teal-600 text-body-sm">
                <MapPinIcon size={14} />
                <span className="font-vazirmatn text-xs">بابل</span>
              </div>
            </div>
            <div className="h-11 rounded-xl bg-transparent" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-10">

        {/* ─── Colors ────────────────────────────────── */}
        <section>
          <SectionHeader title="رنگ‌ها" subtitle="Color Tokens" size="lg" divider />

          <div className="mt-5 space-y-4">
            <p className="text-label text-neutral-500">Teal — Primary Brand</p>
            <div className="flex gap-3 flex-wrap">
              {[50,100,200,300,400,500,600,700,800,900].map(n => (
                <ColorSwatch
                  key={n}
                  name={String(n)}
                  value={`var(--color-teal-${n})`}
                  textDark={n < 300}
                />
              ))}
            </div>

            <p className="text-label text-neutral-500 mt-4">Amber — Prices & Premiums</p>
            <div className="flex gap-3 flex-wrap">
              {[100,300,500,600,700].map(n => (
                <ColorSwatch key={n} name={String(n)} value={`var(--color-amber-${n})`} textDark={n < 300} />
              ))}
            </div>

            <p className="text-label text-neutral-500 mt-4">Emerald — Verified & Success</p>
            <div className="flex gap-3 flex-wrap">
              {[100,300,500,600,700].map(n => (
                <ColorSwatch key={n} name={String(n)} value={`var(--color-emerald-${n})`} textDark={n < 300} />
              ))}
            </div>

            <p className="text-label text-neutral-500 mt-4">Neutrals</p>
            <div className="flex gap-3 flex-wrap">
              {[50,100,200,300,400,500,600,700,800,900].map(n => (
                <ColorSwatch key={n} name={String(n)} value={`var(--color-neutral-${n})`} textDark={n < 400} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Typography ────────────────────────────── */}
        <section>
          <SectionHeader title="تایپوگرافی" subtitle="IranYekanX + Vazirmatn" size="lg" divider />
          <div className="mt-5 space-y-4 bg-white rounded-2xl p-5 shadow-elevation-1">
            <div className="space-y-2">
              <p className="text-label text-neutral-400 mb-3">IranYekanX — Headings</p>
              <div className="text-display font-iran-yekan-x text-neutral-900">نزدیکام — بازار محلی</div>
              <div className="text-heading-lg font-iran-yekan-x text-neutral-900">عنوان صفحه بزرگ</div>
              <div className="text-heading font-iran-yekan-x text-neutral-900">عنوان بخش</div>
              <div className="text-title-lg font-iran-yekan-x text-neutral-900">عنوان کارت بزرگ</div>
              <div className="text-title font-iran-yekan-x text-neutral-900">عنوان کارت</div>
            </div>
            <div className="border-t border-neutral-100 pt-4 space-y-2">
              <p className="text-label text-neutral-400 mb-3">Vazirmatn — Body</p>
              <div className="text-body-lg font-vazirmatn text-neutral-800">متن بزرگ — ۱۶px</div>
              <div className="text-body font-vazirmatn text-neutral-700">متن معمولی — ۱۵px این یک نمونه متن است</div>
              <div className="text-body-sm font-vazirmatn text-neutral-600">متن کوچک — ۱۳px برای توضیحات</div>
              <div className="text-label-lg font-vazirmatn text-neutral-600 font-medium">برچسب بزرگ — ۱۵px Medium</div>
              <div className="text-label font-vazirmatn text-neutral-500 font-medium">برچسب — ۱۲px Medium</div>
              <div className="text-caption font-vazirmatn text-neutral-400">کپشن — ۱۱px</div>
            </div>
            <div className="border-t border-neutral-100 pt-4">
              <p className="text-label text-neutral-400 mb-3">IranYekanX — Prices</p>
              <div className="flex items-baseline gap-3">
                <span className="text-price-lg font-iran-yekan-x text-amber-500">۱٬۵۰۰٬۰۰۰</span>
                <span className="text-body text-neutral-400 font-vazirmatn">تومان</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-price font-iran-yekan-x text-amber-500">۳۵۰٬۰۰۰</span>
                <span className="text-body-sm text-neutral-400 font-vazirmatn">تومان</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Elevation ─────────────────────────────── */}
        <section>
          <SectionHeader title="سطح‌بندی" subtitle="Elevation System" size="lg" divider />
          <div className="mt-5 bg-neutral-100 rounded-2xl p-5">
            <div className="flex gap-4 flex-wrap justify-center">
              <ElevationCard level={0} label="Flat" />
              <ElevationCard level={1} label="Subtle" />
              <ElevationCard level={2} label="Card" />
              <ElevationCard level={3} label="Modal" />
              <ElevationCard level={4} label="Overlay" />
            </div>
            <p className="text-caption text-neutral-500 text-center mt-4 font-vazirmatn">
              تمام کارت‌ها از Elevation-2 استفاده می‌کنند — بدون کارت‌های border-only
            </p>
          </div>
        </section>

        {/* ─── Buttons ───────────────────────────────── */}
        <section>
          <SectionHeader title="دکمه‌ها" subtitle="Button Variants" size="lg" divider />
          <div className="mt-5 space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-elevation-1">
              <p className="text-label text-neutral-400 mb-4">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">اصلی</Button>
                <Button variant="secondary">ثانویه</Button>
                <Button variant="outline">خطی</Button>
                <Button variant="ghost">شفاف</Button>
                <Button variant="destructive">خطا</Button>
                <Button variant="amber">طلایی</Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-elevation-1">
              <p className="text-label text-neutral-400 mb-4">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">کوچک</Button>
                <Button size="md">معمولی</Button>
                <Button size="lg">بزرگ</Button>
                <Button size="xl">خیلی بزرگ</Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-elevation-1">
              <p className="text-label text-neutral-400 mb-4">States</p>
              <div className="flex flex-wrap gap-3">
                <Button loading>در حال بارگذاری</Button>
                <Button disabled>غیرفعال</Button>
                <Button size="icon" variant="outline"><HeartIcon size={18} /></Button>
                <Button size="icon" variant="ghost"><FilterIcon size={18} /></Button>
                <Button size="icon-sm" variant="secondary"><PlusIcon size={16} /></Button>
              </div>
            </div>

            <div className="gradient-teal rounded-2xl p-5">
              <p className="text-label text-white/60 mb-4">روی پس‌زمینه رنگی</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="bg-white/90 border-white">ورود</Button>
                <Button className="bg-white/20 hover:bg-white/30 border-white/30 text-white border">ثبت‌نام</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Badges ────────────────────────────────── */}
        <section>
          <SectionHeader title="نشان‌ها" subtitle="Badge & Status Indicators" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-elevation-1">
            <p className="text-label text-neutral-400 mb-4">Status Badges</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="verified" icon={<VerifiedIcon size={11} />}>تأیید شده</Badge>
              <Badge variant="premium" dot>پرمیوم</Badge>
              <Badge variant="new" dot>جدید</Badge>
              <Badge variant="teal-solid">فعال</Badge>
              <Badge variant="emerald-solid">تحویل شد</Badge>
              <Badge variant="amber-solid">در انتظار</Badge>
              <Badge variant="rose-solid">رد شده</Badge>
              <Badge variant="outline">خطی</Badge>
              <Badge variant="default">پیش‌فرض</Badge>
            </div>

            <p className="text-label text-neutral-400 mb-4 mt-5">Sizes</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="xs" variant="teal">xs</Badge>
              <Badge size="sm" variant="teal">sm</Badge>
              <Badge size="md" variant="teal">md</Badge>
              <Badge size="lg" variant="teal">lg</Badge>
            </div>
          </div>
        </section>

        {/* ─── Chips ─────────────────────────────────── */}
        <section>
          <SectionHeader title="چیپ‌های فیلتر" subtitle="Filter Chips" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-elevation-1">
            <ChipSet scrollable>
              {SAMPLE_CATEGORIES.map((cat, i) => (
                <Chip
                  key={cat.id}
                  label={cat.label}
                  count={cat.count}
                  selected={i === 0}
                />
              ))}
            </ChipSet>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Chip label="رامسر" icon={<MapPinIcon size={13} />} selected />
              <Chip label="در حال فعالیت" dot={true as unknown as undefined} />
              <Chip label="تأیید شده" icon={<VerifiedIcon size={13} />} removable />
            </div>
          </div>
        </section>

        {/* ─── Input ─────────────────────────────────── */}
        <section>
          <SectionHeader title="ورودی‌ها" subtitle="Input Fields" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-elevation-1 space-y-4">
            <Input
              label="جستجو"
              placeholder="نام کسب‌وکار یا محصول..."
              startIcon={<SearchIcon size={16} />}
            />
            <Input
              label="موقعیت مکانی"
              placeholder="شهر یا محله"
              startIcon={<MapPinIcon size={16} />}
              hint="موقعیت شما برای بهتر نمایش دادن نتایج استفاده می‌شود"
            />
            <Input
              label="شماره تلفن"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              startIcon={<PhoneIcon size={16} />}
              error="شماره تلفن نامعتبر است"
              defaultValue="abc"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <Input placeholder="کوچک" size="sm" />
              </div>
              <div className="flex-1">
                <Input placeholder="معمولی" size="md" />
              </div>
              <div className="flex-1">
                <Input placeholder="بزرگ" size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Skeletons ─────────────────────────────── */}
        <section>
          <SectionHeader title="حالت بارگذاری" subtitle="Skeleton Loaders" size="lg" divider />
          <div className="mt-5 space-y-4">
            <SkeletonHero />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonListItem />
            <SkeletonListItem />
          </div>
        </section>

        {/* ─── Section Headers ───────────────────────── */}
        <section>
          <SectionHeader title="سربرگ بخش‌ها" subtitle="Section Headers" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-elevation-1 space-y-6">
            <SectionHeader
              title="کسب‌وکارهای برتر"
              actionLabel="مشاهده همه"
              icon={<StoreIcon size={18} />}
              size="lg"
            />
            <SectionHeader
              title="رستوران‌های نزدیک"
              actionLabel="بیشتر"
              icon={<MapPinIcon size={16} />}
              size="md"
            />
            <SectionHeader
              title="جدیدترین‌ها"
              actionLabel="همه"
              size="sm"
            />
          </div>
        </section>

        {/* ─── Letter Avatars ────────────────────────── */}
        <section>
          <SectionHeader title="آواتار حروفی" subtitle="Letter Avatars — Deterministic Gradient" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-elevation-1">
            <p className="text-caption text-neutral-400 mb-4">هر کسب‌وکار بر اساس نامش یک گرادیان ثابت دریافت می‌کند</p>
            <div className="flex flex-wrap gap-4">
              {[
                "رستوران دریا", "کافه شمال", "پوشاک ساحل",
                "مبل ایران", "خدمات خودرو", "بازار گیلان",
                "آرایشگاه مدرن", "فروشگاه گل", "تعمیرات موبایل", "پیتزا فوری"
              ].map((name) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <LetterAvatar name={name} size={48} />
                  <span className="text-[10px] text-neutral-500 text-center max-w-[60px] leading-tight">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Sample Cards ──────────────────────────── */}
        <section>
          <SectionHeader title="کارت‌های نمونه" subtitle="Business Cards — Photo-First" size="lg" divider />
          <div className="mt-5 space-y-4">
            {/* Grid cards */}
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_BUSINESSES.slice(0, 2).map((b) => (
                <div key={b.name} className="card overflow-hidden">
                  <div className="relative">
                    <div className="h-36 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                      <LetterAvatar name={b.name} size={56} />
                    </div>
                    <button className="absolute top-2 end-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-rose-500 shadow-elevation-1">
                      <HeartIcon size={15} />
                    </button>
                    {b.verified && (
                      <Badge
                        variant="emerald-solid"
                        size="xs"
                        icon={<VerifiedIcon size={9} />}
                        className="absolute bottom-2 start-2"
                      >
                        تأیید شده
                      </Badge>
                    )}
                  </div>
                  <div className="p-3 space-y-1.5">
                    <h3 className="text-title font-iran-yekan-x text-neutral-900 truncate">{b.name}</h3>
                    <p className="text-caption text-neutral-500 font-vazirmatn">{b.category} · {b.location}</p>
                    <div className="flex items-center gap-1">
                      <StarFilledIcon size={12} className="text-amber-400" />
                      <span className="text-caption text-neutral-700 font-vazirmatn">{b.rating}</span>
                      <span className="text-caption text-neutral-400">({b.reviews})</span>
                    </div>
                    <p className="text-price font-iran-yekan-x text-amber-500">{b.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* List card */}
            {SAMPLE_BUSINESSES.map((b) => (
              <div key={b.name + "-list"} className="card p-3 flex items-center gap-3">
                <LetterAvatar name={b.name} size={56} />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-title font-iran-yekan-x text-neutral-900 truncate">{b.name}</h3>
                    {b.verified && (
                      <VerifiedIcon size={14} className="text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-caption text-neutral-500 font-vazirmatn">{b.category} · {b.location}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      <StarFilledIcon size={12} className="text-amber-400" />
                      <span className="text-caption text-neutral-600 font-vazirmatn">{b.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-neutral-400">
                      <ClockIcon size={12} />
                      <span className="text-caption font-vazirmatn">باز</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-price font-iran-yekan-x text-amber-500">{b.price}</span>
                  <button className="text-neutral-400 hover:text-rose-500 transition-colors">
                    <HeartIcon size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Icons ─────────────────────────────────── */}
        <section>
          <SectionHeader title="آیکون‌ها" subtitle="SVG Icon System — currentColor, stroke 1.5" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-elevation-1">
            <div className="grid grid-cols-8 gap-4">
              {[
                [SearchIcon, "Search"],
                [MapPinIcon, "MapPin"],
                [HeartIcon, "Heart"],
                [HeartFilledIcon, "HeartFilled"],
                [StarFilledIcon, "StarFilled"],
                [VerifiedIcon, "Verified"],
                [StoreIcon, "Store"],
                [PhoneIcon, "Phone"],
                [ClockIcon, "Clock"],
                [FilterIcon, "Filter"],
                [GridIcon, "Grid"],
                [ListIcon, "List"],
                [BellIcon, "Bell"],
                [ChevronEndIcon, "ChevronEnd"],
                [PlusIcon, "Plus"],
                [CheckCircleIcon, "CheckCircle"],
                [AlertCircleIcon, "AlertCircle"],
              ].map(([Icon, name]) => (
                <div key={String(name)} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                    <Icon size={20} />
                  </div>
                  <span className="text-[9px] text-neutral-400 text-center leading-tight">{String(name)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 mt-5 pt-4">
              <p className="text-label text-neutral-400 mb-3">Icon Colors & Sizes</p>
              <div className="flex items-center gap-4">
                <SearchIcon size={16} className="text-neutral-400" />
                <SearchIcon size={18} className="text-teal-600" />
                <SearchIcon size={20} className="text-amber-500" />
                <SearchIcon size={24} className="text-emerald-500" />
                <SearchIcon size={28} className="text-rose-500" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── RTL Demo ──────────────────────────────── */}
        <section>
          <SectionHeader title="پشتیبانی RTL" subtitle="CSS Logical Properties" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 shadow-elevation-1 space-y-4">
            <div className="border-s-4 border-teal-500 ps-4">
              <p className="text-body font-vazirmatn text-neutral-800">این متن از border-inline-start استفاده می‌کند</p>
              <p className="text-caption text-neutral-400 mt-0.5">border-s-4 ps-4 — CSS Logical Properties</p>
            </div>
            <div className="flex items-center gap-3 bg-teal-50 rounded-xl px-4 py-3">
              <VerifiedIcon size={18} className="text-teal-600 shrink-0" />
              <p className="text-body-sm font-vazirmatn text-teal-800">آیکون‌ها به‌درستی در RTL قرار می‌گیرند</p>
              <div className="flex-1" />
              <ChevronEndIcon size={16} className="text-teal-500" />
            </div>
            <div className="flex flex-row-reverse items-center gap-3">
              <Badge variant="teal">شروع منطقی</Badge>
              <span className="text-caption text-neutral-400 font-mono">flex-row-reverse</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pb-8 pt-4">
          <p className="text-caption text-neutral-400 font-vazirmatn">نزدیکام Design System v1.0</p>
          <p className="text-caption text-neutral-300 mt-1">IranYekanX + Vazirmatn + Tailwind CSS v4</p>
        </div>
      </div>
    </div>
  );
}
