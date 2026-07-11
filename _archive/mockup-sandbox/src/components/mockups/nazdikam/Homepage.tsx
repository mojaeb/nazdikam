import React from 'react';
import { MapPin, Search, ChevronLeft, CheckCircle, Home, Grid, User } from 'lucide-react';

export function Homepage() {
  return (
    <div 
      dir="rtl" 
      lang="fa" 
      className="w-full max-w-[390px] mx-auto bg-[#F7F8FA] min-h-[100dvh] relative overflow-x-hidden text-[#111827] flex flex-col"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 h-14 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-[20px] font-bold text-[#0A7EA4] tracking-tight">🏪 نزدیکام</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-full shadow-sm text-xs text-[#6B7280]">
            <MapPin size={12} className="text-[#9CA3AF]" />
            <span className="font-medium pt-0.5">مازندران</span>
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold text-[#0A7EA4] border border-[#0A7EA4] rounded-lg hover:bg-[#0A7EA4]/5 transition-colors">
            ورود
          </button>
        </div>
      </header>

      <div className="flex-1 pb-20">
        {/* HERO SEARCH BAR */}
        <div className="px-4 py-3">
          <div className="relative shadow-sm rounded-full">
            <input 
              type="text" 
              placeholder="دنبال چه می‌گردید؟" 
              className="w-full h-11 pl-4 pr-11 bg-white border border-[#E5E7EB] rounded-full text-sm focus:outline-none focus:border-[#0A7EA4] focus:ring-1 focus:ring-[#0A7EA4] transition-all placeholder:text-[#9CA3AF]"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </div>

        {/* PROMO BANNER */}
        <div className="px-4 mb-6">
          <div className="w-full aspect-[16/5] rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-center p-4 bg-gradient-to-l from-[#085F80] to-[#0A7EA4] shadow-md shadow-[#0A7EA4]/20">
            {/* Amber overlay */}
            <div className="absolute inset-0 bg-[#F59E0B] mix-blend-overlay opacity-30 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center pt-1">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-0.5 drop-shadow-md">تابستان ۱۴۰۵</h2>
              <p className="text-xs text-white/90 font-medium">بهترین تخفیف‌های شمال</p>
            </div>
            
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <div className="w-1 h-1 rounded-full bg-white/50 mt-0.5"></div>
              <div className="w-1 h-1 rounded-full bg-white/50 mt-0.5"></div>
            </div>
          </div>
        </div>

        {/* CATEGORY ICONS ROW */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3.5">
            <h3 className="font-bold text-[14px] text-[#111827]">دسته‌بندی‌ها</h3>
            <button className="flex items-center text-[13px] text-[#0A7EA4] font-medium hover:underline">
              مشاهده همه <ChevronLeft size={14} className="mr-0.5" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { id: 1, icon: '🍽️', label: 'غذا' },
              { id: 2, icon: '🏥', label: 'سلامت' },
              { id: 3, icon: '👗', label: 'پوشاک' },
              { id: 4, icon: '🔧', label: 'تعمیر' },
              { id: 5, icon: '🏠', label: 'خانه' },
              { id: 6, icon: '🚗', label: 'خودرو' },
              { id: 7, icon: '💇', label: 'زیبایی' },
            ].map((cat) => (
              <div key={cat.id} className="flex flex-col items-center gap-2 snap-start shrink-0 cursor-pointer group">
                <div className="w-14 h-14 rounded-[18px] bg-[#0A7EA4]/[0.08] flex items-center justify-center text-2xl shadow-sm border border-[#0A7EA4]/10 group-hover:bg-[#0A7EA4]/[0.15] transition-colors">
                  {cat.icon}
                </div>
                <span className="text-[11px] text-[#6B7280] font-medium">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED BUSINESSES */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3.5">
            <h3 className="font-bold text-[14px] text-[#111827]">کسب‌وکارهای ویژه</h3>
            <button className="flex items-center text-[13px] text-[#0A7EA4] font-medium hover:underline">
              مشاهده همه <ChevronLeft size={14} className="mr-0.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { id: 1, name: 'رستوران حاج حسن', city: 'ساری', cat: 'غذای ایرانی', verified: true, initial: 'ر' },
              { id: 2, name: 'کلینیک زیبایی رز', city: 'بابل', cat: 'پزشکی', verified: false, initial: 'ک' },
              { id: 3, name: 'تعمیرگاه مرکزی', city: 'آمل', cat: 'خودرو', verified: true, initial: 'ت' },
            ].map((biz) => (
              <div key={biz.id} className="w-36 shrink-0 snap-start bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/60 p-3.5 flex flex-col items-center text-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A7EA4] to-[#085F80] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                  {biz.initial}
                </div>
                <div className="w-full">
                  <h4 className="font-bold text-[13px] leading-tight mb-1.5 truncate text-[#111827]">{biz.name}</h4>
                  <p className="text-[11px] text-[#9CA3AF] truncate">{biz.city} • {biz.cat}</p>
                </div>
                {biz.verified ? (
                  <div className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-[10px] font-bold mt-auto border border-[#10B981]/20">
                    <CheckCircle size={10} strokeWidth={2.5} />
                    <span className="pt-0.5">تایید شده</span>
                  </div>
                ) : (
                  <div className="h-[22px] mt-auto"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED PRODUCTS */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3.5">
            <h3 className="font-bold text-[14px] text-[#111827]">محصولات ویژه</h3>
            <button className="flex items-center text-[13px] text-[#0A7EA4] font-medium hover:underline">
              مشاهده همه <ChevronLeft size={14} className="mr-0.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { id: 1, name: 'برنج طارم محلی ۱۰ کیلو', store: 'فروشگاه شمال', price: '۱،۴۵۰،۰۰۰' },
              { id: 2, name: 'عسل طبیعی کوهستان', store: 'عسل‌فروشی کندو', price: '۳۲۰،۰۰۰' },
              { id: 3, name: 'کلوچه سنتی فومن گردویی', store: 'شیرینی‌پزی نادی', price: '۸۵،۰۰۰' },
            ].map((prod) => (
              <div key={prod.id} className="w-40 shrink-0 snap-start bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/60 overflow-hidden flex flex-col group cursor-pointer">
                <div className="w-full h-[100px] bg-gradient-to-br from-[#0A7EA4]/10 to-[#0A7EA4]/5 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300">
                  📦
                </div>
                <div className="p-2.5 flex flex-col flex-1 bg-white relative z-10">
                  <h4 className="font-bold text-[12px] mb-1 line-clamp-2 leading-snug text-[#111827] h-8">{prod.name}</h4>
                  <p className="text-[11px] text-[#9CA3AF] mb-3 truncate">{prod.store}</p>
                  <div className="mt-auto flex justify-end">
                    <span className="font-bold text-[#0A7EA4] text-[13px] tracking-tight">{prod.price} <span className="text-[10px] font-medium text-[#6B7280] mr-0.5">تومان</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DISCOUNT ROW */}
        <div className="mb-2">
          <div className="flex items-center justify-between px-4 mb-3.5">
            <h3 className="font-bold text-[14px] text-[#111827] flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
              </span>
              تخفیف‌های ویژه
            </h3>
            <button className="flex items-center text-[13px] text-[#0A7EA4] font-medium hover:underline">
              مشاهده همه <ChevronLeft size={14} className="mr-0.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { id: 1, name: 'سرویس کامل روغن موتور', store: 'تعمیرگاه اتو شمال', oldPrice: '۸۵۰،۰۰۰', price: '۶۸۰،۰۰۰', discount: '۲۰٪' },
              { id: 2, name: 'پیتزا مخصوص خانواده دونفره', store: 'فست‌فود شادی', oldPrice: '۳۲۰،۰۰۰', price: '۲۴۰،۰۰۰', discount: '۲۵٪' },
              { id: 3, name: 'کفش ورزشی اورجینال', store: 'اسپرت پلاس', oldPrice: '۱،۲۰۰،۰۰۰', price: '۸۵۰،۰۰۰', discount: '۳۰٪' },
            ].map((prod) => (
              <div key={prod.id} className="w-40 shrink-0 snap-start bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/60 overflow-hidden flex flex-col relative group cursor-pointer">
                <div className="absolute top-2 left-2 bg-[#F59E0B] text-white text-[11px] font-bold px-1.5 py-0.5 rounded z-20 shadow-sm">
                  {prod.discount}
                </div>
                <div className="w-full h-[100px] bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300">
                  🎁
                </div>
                <div className="p-2.5 flex flex-col flex-1 bg-white relative z-10">
                  <h4 className="font-bold text-[12px] mb-1 line-clamp-2 leading-snug text-[#111827] h-8">{prod.name}</h4>
                  <p className="text-[11px] text-[#9CA3AF] mb-3 truncate">{prod.store}</p>
                  <div className="mt-auto flex flex-col items-end gap-0.5">
                    <span className="text-[11px] text-[#9CA3AF] line-through font-medium">{prod.oldPrice}</span>
                    <span className="font-bold text-[#EF4444] text-[13px] tracking-tight">{prod.price} <span className="text-[10px] font-medium text-[#6B7280] mr-0.5">تومان</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM NAV */}
      <nav className="fixed bottom-0 w-full max-w-[390px] h-[64px] bg-white border-t border-[#E5E7EB] flex items-center justify-around z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        {[
          { id: 'home', icon: Home, label: 'خانه', active: true },
          { id: 'search', icon: Search, label: 'جستجو', active: false },
          { id: 'category', icon: Grid, label: 'دسته‌بندی', active: false },
          { id: 'profile', icon: User, label: 'پروفایل', active: false },
        ].map((tab) => (
          <button key={tab.id} className="flex flex-col items-center justify-center w-full h-full gap-1 pt-1 hover:bg-gray-50/50 transition-colors">
            <tab.icon size={22} className={tab.active ? "text-[#0A7EA4]" : "text-[#9CA3AF]"} strokeWidth={tab.active ? 2.5 : 2} />
            <span className={`text-[10px] font-bold ${tab.active ? "text-[#0A7EA4]" : "text-[#9CA3AF]"}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
