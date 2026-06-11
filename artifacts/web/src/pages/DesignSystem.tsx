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
  BellIcon,
  GridIcon,
  PlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ChevronEndIcon,
  HeartFilledIcon,
} from "@/components/icons";
import { avatarGradientIndex, avatarInitial } from "@/lib/utils";

function ColorSwatch({ name, value, textDark = false }: { name: string; value: string; textDark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-12 h-12 rounded-xl elevation-1" style={{ background: value }} />
      <span className={`text-[10px] font-mono text-center leading-tight ${textDark ? "text-neutral-800" : "text-neutral-500"}`}>
        {name}
      </span>
    </div>
  );
}

function ElevationCard({ level, label }: { level: 0 | 1 | 2 | 3 | 4; label: string }) {
  const shadows: Record<number, string> = {
    0: "none",
    1: "var(--shadow-elevation-1)",
    2: "var(--shadow-elevation-2)",
    3: "var(--shadow-elevation-3)",
    4: "var(--shadow-elevation-4)",
  };
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-1 min-w-[110px] items-center"
      style={{ boxShadow: shadows[level] }}>
      <span className="text-title font-iran-yekan-x text-neutral-800">E-{level}</span>
      <span className="text-caption text-neutral-400 font-vazirmatn">{label}</span>
    </div>
  );
}

function LetterAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const idx = avatarGradientIndex(name);
  return (
    <div
      className="flex items-center justify-center rounded-xl font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: `var(--avatar-gradient-${idx})`,
        fontSize: size * 0.38,
        fontFamily: "var(--font-iran-yekan-x)",
      }}
    >
      {avatarInitial(name)}
    </div>
  );
}

const CATEGORIES = [
  { id: "1", label: "رستوران", count: 142 },
  { id: "2", label: "مبلمان" },
  { id: "3", label: "پوشاک", count: 89 },
  { id: "4", label: "الکترونیک", count: 56 },
  { id: "5", label: "خودرو" },
  { id: "6", label: "خدمات", count: 203 },
];

const BUSINESSES = [
  { name: "رستوران دریا", category: "رستوران", location: "بابل", rating: 4.8, reviews: 124, verified: true, price: "۱۵۰٬۰۰۰ تومان" },
  { name: "کافه شمال", category: "کافه", location: "ساری", rating: 4.5, reviews: 67, verified: false, price: "۸۰٬۰۰۰ تومان" },
  { name: "پوشاک ساحل", category: "پوشاک", location: "رامسر", rating: 4.2, reviews: 31, verified: true, price: "۲۵۰٬۰۰۰ تومان" },
];

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-page-bg" dir="rtl">

      {/* ─── Hero Header ───────────────────────────────── */}
      <div className="gradient-teal px-4 pt-14 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-display font-iran-yekan-x text-white">نزدیکام</h1>
              <p className="text-body-sm text-white/70 mt-0.5 font-vazirmatn">Design System Foundation v1.0</p>
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
          {/* Search preview */}
          <div className="h-11 relative">
            <div className="absolute inset-0 flex items-center pe-4 ps-4 gap-3 bg-white rounded-xl elevation-2 pointer-events-none">
              <SearchIcon size={18} className="text-neutral-400 shrink-0" />
              <span className="text-body text-neutral-400 font-vazirmatn">جستجو در نزدیکام…</span>
              <div className="flex-1" />
              <div className="flex items-center gap-1 text-teal-600">
                <MapPinIcon size={14} />
                <span className="text-xs font-vazirmatn">بابل</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-10">

        {/* ─── Color Palette ──────────────────────────── */}
        <section>
          <SectionHeader title="رنگ‌ها" subtitle="Color Design Tokens" size="lg" divider />
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-label text-neutral-500 mb-3">Teal — Primary Brand</p>
              <div className="flex gap-3 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(n => (
                  <ColorSwatch key={n} name={String(n)} value={`var(--color-teal-${n})`} textDark={n < 300} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-label text-neutral-500 mb-3">Amber — Prices & Premiums</p>
              <div className="flex gap-3 flex-wrap">
                {[100, 300, 500, 600, 700].map(n => (
                  <ColorSwatch key={n} name={String(n)} value={`var(--color-amber-${n})`} textDark={n < 300} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-label text-neutral-500 mb-3">Emerald — Verified & Success</p>
              <div className="flex gap-3 flex-wrap">
                {[100, 300, 500, 600, 700].map(n => (
                  <ColorSwatch key={n} name={String(n)} value={`var(--color-emerald-${n})`} textDark={n < 300} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-label text-neutral-500 mb-3">Neutrals</p>
              <div className="flex gap-3 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(n => (
                  <ColorSwatch key={n} name={String(n)} value={`var(--color-neutral-${n})`} textDark={n < 400} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Typography ─────────────────────────────── */}
        <section>
          <SectionHeader title="تایپوگرافی" subtitle="IranYekanX + Vazirmatn Variable Fonts" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-5 elevation-1 space-y-5">
            <div>
              <p className="text-label text-neutral-400 mb-3">IranYekanX — Headings & Prices</p>
              <div className="space-y-1.5">
                <div className="text-display font-iran-yekan-x text-neutral-900">نزدیکام — بازار محلی / Display 32px</div>
                <div className="text-heading-lg font-iran-yekan-x text-neutral-800">عنوان صفحه — Heading LG 26px</div>
                <div className="text-heading font-iran-yekan-x text-neutral-800">عنوان بخش — Heading 22px</div>
                <div className="text-title-lg font-iran-yekan-x text-neutral-800">عنوان کارت بزرگ — Title LG 19px</div>
                <div className="text-title font-iran-yekan-x text-neutral-800">عنوان کارت — Title 17px</div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-price-lg font-iran-yekan-x text-amber-500">۱٬۵۰۰٬۰۰۰</span>
                  <span className="text-body text-neutral-400 font-vazirmatn">تومان — Price LG</span>
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-100 pt-4">
              <p className="text-label text-neutral-400 mb-3">Vazirmatn — Body & UI Text</p>
              <div className="space-y-1.5">
                <div className="text-body-lg font-vazirmatn text-neutral-800">متن بزرگ — Body LG 16px</div>
                <div className="text-body font-vazirmatn text-neutral-700">متن معمولی — Body 15px — این یک پاراگراف نمونه است برای نمایش خوانایی متن</div>
                <div className="text-body-sm font-vazirmatn text-neutral-600">متن کوچک — Body SM 13px</div>
                <div className="text-label-lg font-vazirmatn text-neutral-600 font-medium">برچسب بزرگ — Label LG 15px Medium</div>
                <div className="text-label font-vazirmatn text-neutral-500 font-medium uppercase tracking-wide">LABEL 12PX MEDIUM</div>
                <div className="text-caption font-vazirmatn text-neutral-400">کپشن — Caption 11px</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Elevation ──────────────────────────────── */}
        <section>
          <SectionHeader title="سطح‌بندی" subtitle="Elevation System — No border-only cards" size="lg" divider />
          <div className="mt-5 bg-neutral-100 rounded-2xl p-5">
            <div className="flex gap-4 flex-wrap justify-center">
              <ElevationCard level={0} label="Flat" />
              <ElevationCard level={1} label="Subtle" />
              <ElevationCard level={2} label="Card" />
              <ElevationCard level={3} label="Modal" />
              <ElevationCard level={4} label="Overlay" />
            </div>
            <p className="text-caption text-neutral-500 text-center mt-4 font-vazirmatn">
              تمام کارت‌ها Elevation-2 — هیچ کارت border-only نداریم
            </p>
          </div>
        </section>

        {/* ─── Buttons ────────────────────────────────── */}
        <section>
          <SectionHeader title="دکمه‌ها" subtitle="Button Component — All Variants" size="lg" divider />
          <div className="mt-5 space-y-4">
            <div className="bg-white rounded-2xl p-4 elevation-1">
              <p className="text-label text-neutral-400 mb-3">Variants</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">اصلی</Button>
                <Button variant="secondary">ثانویه</Button>
                <Button variant="outline">خطی</Button>
                <Button variant="ghost">شفاف</Button>
                <Button variant="destructive">حذف</Button>
                <Button variant="amber">طلایی</Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 elevation-1">
              <p className="text-label text-neutral-400 mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">کوچک</Button>
                <Button size="md">معمولی</Button>
                <Button size="lg">بزرگ</Button>
                <Button size="xl">خیلی بزرگ</Button>
                <Button size="icon" variant="outline"><HeartIcon size={18} /></Button>
                <Button size="icon-sm" variant="secondary"><PlusIcon size={16} /></Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 elevation-1">
              <p className="text-label text-neutral-400 mb-3">States</p>
              <div className="flex flex-wrap gap-2">
                <Button loading>در حال بارگذاری</Button>
                <Button disabled>غیرفعال</Button>
              </div>
            </div>
            <div className="gradient-teal rounded-2xl p-4">
              <p className="text-label text-white/60 mb-3">روی پس‌زمینه رنگی</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="bg-white/90 border-white text-teal-700">ورود</Button>
                <Button className="bg-white/15 hover:bg-white/25 border border-white/30 text-white">ثبت‌نام رایگان</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Badges ─────────────────────────────────── */}
        <section>
          <SectionHeader title="نشان‌ها" subtitle="Badge Component — Status Indicators" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-4 elevation-1 space-y-4">
            <div>
              <p className="text-label text-neutral-400 mb-3">Semantic</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="verified" icon={<VerifiedIcon size={11} />}>تأیید شده</Badge>
                <Badge variant="premium" dot>پرمیوم</Badge>
                <Badge variant="new" dot>جدید</Badge>
                <Badge variant="teal-solid">فعال</Badge>
                <Badge variant="emerald-solid">موفق</Badge>
                <Badge variant="amber-solid">در انتظار</Badge>
                <Badge variant="rose-solid">رد شده</Badge>
                <Badge variant="outline">خطی</Badge>
              </div>
            </div>
            <div>
              <p className="text-label text-neutral-400 mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="xs" variant="teal">xs</Badge>
                <Badge size="sm" variant="teal">sm</Badge>
                <Badge size="md" variant="teal">md</Badge>
                <Badge size="lg" variant="teal">lg</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Chips ──────────────────────────────────── */}
        <section>
          <SectionHeader title="فیلترها" subtitle="Chip & ChipSet — Interactive Filters" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-4 elevation-1 space-y-4">
            <ChipSet scrollable>
              {CATEGORIES.map((cat, i) => (
                <Chip key={cat.id} label={cat.label} count={cat.count} selected={i === 0} />
              ))}
            </ChipSet>
            <div className="flex flex-wrap gap-2">
              <Chip label="رامسر" icon={<MapPinIcon size={13} />} selected />
              <Chip label="باز است" size="sm" />
              <Chip label="تأیید شده" icon={<VerifiedIcon size={13} />} removable />
              <Chip label="با عکس" size="lg" />
            </div>
          </div>
        </section>

        {/* ─── Input ──────────────────────────────────── */}
        <section>
          <SectionHeader title="ورودی‌ها" subtitle="Input Component — RTL-first" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-4 elevation-1 space-y-4">
            <Input
              label="جستجو"
              placeholder="نام کسب‌وکار یا محصول..."
              startIcon={<SearchIcon size={16} />}
            />
            <Input
              label="موقعیت مکانی"
              placeholder="شهر یا محله"
              startIcon={<MapPinIcon size={16} />}
              hint="موقعیت شما برای نتایج بهتر استفاده می‌شود"
            />
            <Input
              label="شماره تلفن"
              placeholder="۰۹۱۲..."
              startIcon={<PhoneIcon size={16} />}
              error="شماره تلفن نامعتبر است"
            />
            <div className="flex gap-3">
              <Input placeholder="کوچک" size="sm" />
              <Input placeholder="معمولی" size="md" />
              <Input placeholder="بزرگ" size="lg" />
            </div>
          </div>
        </section>

        {/* ─── Skeletons ──────────────────────────────── */}
        <section>
          <SectionHeader title="حالت بارگذاری" subtitle="Skeleton Loaders — Shimmer Animation" size="lg" divider />
          <div className="mt-5 space-y-4">
            <SkeletonHero />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonListItem />
          </div>
        </section>

        {/* ─── Section Headers ────────────────────────── */}
        <section>
          <SectionHeader title="سربرگ‌ها" subtitle="Section Header Component" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-4 elevation-1 space-y-5">
            <SectionHeader title="کسب‌وکارهای برتر" actionLabel="مشاهده همه" icon={<StoreIcon size={18} />} size="lg" />
            <SectionHeader title="رستوران‌های نزدیک" actionLabel="بیشتر" icon={<MapPinIcon size={16} />} size="md" />
            <SectionHeader title="جدیدترین‌ها" actionLabel="همه" size="sm" />
          </div>
        </section>

        {/* ─── Letter Avatars ─────────────────────────── */}
        <section>
          <SectionHeader title="آواتار حروفی" subtitle="Deterministic Gradient from Name Hash" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-4 elevation-1">
            <p className="text-caption text-neutral-400 mb-4 font-vazirmatn">
              هر کسب‌وکار بر اساس نامش یک گرادیان ثابت دریافت می‌کند — fallback زمانی که عکس ندارد
            </p>
            <div className="flex flex-wrap gap-4">
              {["رستوران دریا", "کافه شمال", "پوشاک ساحل", "مبل ایران", "خدمات خودرو",
                "بازار گیلان", "آرایشگاه مدرن", "فروشگاه گل", "تعمیرات موبایل", "پیتزا فوری"].map((name) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <LetterAvatar name={name} size={48} />
                  <span className="text-[10px] text-neutral-500 text-center max-w-[60px] leading-tight font-vazirmatn">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Sample Cards ───────────────────────────── */}
        <section>
          <SectionHeader title="کارت‌های نمونه" subtitle="Photo-First Cards — Elevation-2" size="lg" divider />
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {BUSINESSES.slice(0, 2).map((b) => (
                <div key={b.name} className="card overflow-hidden">
                  <div className="relative">
                    <div className="h-36 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                      <LetterAvatar name={b.name} size={56} />
                    </div>
                    <button className="absolute top-2 end-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-rose-400 elevation-1">
                      <HeartIcon size={15} />
                    </button>
                    {b.verified && (
                      <Badge variant="emerald-solid" size="xs" icon={<VerifiedIcon size={9} />} className="absolute bottom-2 start-2">
                        تأیید شده
                      </Badge>
                    )}
                  </div>
                  <div className="p-3 space-y-1.5">
                    <h3 className="text-title font-iran-yekan-x text-neutral-900 truncate">{b.name}</h3>
                    <p className="text-caption text-neutral-500 font-vazirmatn">{b.category} · {b.location}</p>
                    <div className="flex items-center gap-1">
                      <StarFilledIcon size={12} className="text-amber-400" />
                      <span className="text-caption font-vazirmatn text-neutral-700">{b.rating}</span>
                      <span className="text-caption text-neutral-400">({b.reviews})</span>
                    </div>
                    <p className="text-price font-iran-yekan-x text-amber-500">{b.price}</p>
                  </div>
                </div>
              ))}
            </div>
            {BUSINESSES.map((b) => (
              <div key={b.name + "L"} className="card p-3 flex items-center gap-3">
                <LetterAvatar name={b.name} size={56} />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-title font-iran-yekan-x text-neutral-900 truncate">{b.name}</h3>
                    {b.verified && <VerifiedIcon size={14} className="text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-caption text-neutral-500 font-vazirmatn">{b.category} · {b.location}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-0.5">
                      <StarFilledIcon size={12} className="text-amber-400" />
                      <span className="text-caption font-vazirmatn text-neutral-600">{b.rating}</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-neutral-400">
                      <ClockIcon size={12} />
                      <span className="text-caption font-vazirmatn">باز</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-price font-iran-yekan-x text-amber-500">{b.price}</span>
                  <button className="text-neutral-300 hover:text-rose-500 transition-colors">
                    <HeartIcon size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Icon System ────────────────────────────── */}
        <section>
          <SectionHeader title="آیکون‌ها" subtitle="SVG Icon System — currentColor · stroke 1.5" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-4 elevation-1">
            <div className="grid grid-cols-8 gap-3">
              {([
                [SearchIcon, "Search"], [MapPinIcon, "MapPin"], [HeartIcon, "Heart"],
                [HeartFilledIcon, "HeartFill"], [StarFilledIcon, "Star"], [VerifiedIcon, "Verified"],
                [StoreIcon, "Store"], [PhoneIcon, "Phone"], [ClockIcon, "Clock"],
                [FilterIcon, "Filter"], [GridIcon, "Grid"], [BellIcon, "Bell"],
                [ChevronEndIcon, "Chevron"], [PlusIcon, "Plus"],
                [CheckCircleIcon, "Check"], [AlertCircleIcon, "Alert"],
              ] as [React.ComponentType<{ size?: number; className?: string }>, string][]).map(([Icon, name]) => (
                <div key={name} className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer">
                    <Icon size={20} />
                  </div>
                  <span className="text-[9px] text-neutral-400 text-center leading-tight">{name}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 mt-4 pt-4">
              <p className="text-label text-neutral-400 mb-3">Colors & Sizes</p>
              <div className="flex items-center gap-4">
                <SearchIcon size={16} className="text-neutral-300" />
                <SearchIcon size={18} className="text-neutral-500" />
                <SearchIcon size={20} className="text-teal-600" />
                <SearchIcon size={22} className="text-amber-500" />
                <SearchIcon size={24} className="text-emerald-500" />
                <SearchIcon size={28} className="text-rose-500" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── RTL Demo ───────────────────────────────── */}
        <section>
          <SectionHeader title="پشتیبانی RTL" subtitle="CSS Logical Properties Throughout" size="lg" divider />
          <div className="mt-5 bg-white rounded-2xl p-4 elevation-1 space-y-4">
            <div className="border-s-4 border-teal-500 ps-4">
              <p className="text-body font-vazirmatn text-neutral-800">
                این متن از <code className="text-teal-700 bg-teal-50 px-1 rounded text-xs">border-inline-start</code> استفاده می‌کند
              </p>
              <p className="text-caption text-neutral-400 mt-1">border-s-4 + ps-4 — CSS Logical Properties</p>
            </div>
            <div className="flex items-center gap-3 bg-teal-50 rounded-xl px-4 py-3">
              <VerifiedIcon size={18} className="text-teal-600 shrink-0" />
              <p className="text-body-sm font-vazirmatn text-teal-800">آیکون‌ها در RTL به‌درستی قرار می‌گیرند</p>
              <div className="flex-1" />
              <ChevronEndIcon size={16} className="text-teal-500" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-caption text-neutral-500 font-mono">
              <div className="bg-neutral-50 rounded-lg p-2">
                <div className="text-teal-600 font-bold mb-1">Logical</div>
                ps / pe / ms / me / border-s / border-e
              </div>
              <div className="bg-neutral-50 rounded-lg p-2">
                <div className="text-rose-500 font-bold mb-1">Physical ✗</div>
                pl / pr / ml / mr / border-l / border-r
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 elevation-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-caption text-neutral-500 font-vazirmatn">نزدیکام Design System v1.0 — Ready</span>
          </div>
          <p className="text-caption text-neutral-300 mt-3 font-mono">IranYekanX + Vazirmatn + Tailwind CSS v4 + RTL</p>
        </div>

      </div>
    </div>
  );
}
