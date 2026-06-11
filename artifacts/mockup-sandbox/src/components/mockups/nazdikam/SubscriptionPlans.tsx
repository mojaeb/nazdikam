import React from 'react';
import { ArrowRight, Check, X, Home, Search, PlusCircle, Star, User } from 'lucide-react';

export function SubscriptionPlans() {
  return (
    <div
      dir="rtl"
      lang="fa"
      style={{ fontFamily: "'Vazirmatn', sans-serif", backgroundColor: '#F7F8FA' }}
      className="w-full max-w-[390px] mx-auto min-h-screen relative overflow-hidden flex flex-col"
    >
      {/* HEADER */}
      <header className="h-[56px] bg-white shadow-sm flex items-center justify-between px-4 shrink-0 relative z-10">
        <div className="w-8"></div> {/* Spacer for centering */}
        <h1 className="font-bold text-[17px] text-[#111827]">انتخاب پلن اشتراک</h1>
        <button className="w-8 h-8 flex items-center justify-center text-[#6B7280]">
          <ArrowRight size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-[100px]">
        {/* CURRENT PLAN BADGE */}
        <div className="flex justify-center mt-3">
          <div className="bg-[#10B981] text-white rounded-full px-4 py-1 text-[12px] flex items-center gap-1.5 font-medium">
            <span>✅</span>
            <span>پلن فعلی: ماهانه · تا ۱۵ شهریور ۱۴۰۵</span>
          </div>
        </div>

        {/* PLAN CARD 1 — Basic */}
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-[18px] text-[#111827]">پلن پایه</h2>
            <span className="bg-gray-100 text-[#6B7280] text-[11px] px-2 py-0.5 rounded-full font-medium">۳۰ روز</span>
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[28px] text-[#0A7EA4]">۲۵۰،۰۰۰</span>
              <span className="text-[#6B7280] text-[14px]">تومان / ماه</span>
            </div>
          </div>
          <div className="h-px bg-gray-100 w-full mb-4"></div>
          <ul className="space-y-2 mb-6 text-[12px] text-[#111827]">
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>مدیریت تا ۵۰ محصول</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>مدیریت تا ۲۰ خدمت</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>آپلود تا ۱۰ ویدیو</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>گزارش آمار پایه</span></li>
            <li className="flex items-center gap-2 text-[#6B7280]"><X size={16} className="text-gray-300" /> <span>سیستم معرفی دوستان</span></li>
            <li className="flex items-center gap-2 text-[#6B7280]"><X size={16} className="text-gray-300" /> <span>نمایش بنر تبلیغاتی</span></li>
          </ul>
          <button className="w-full py-3 rounded-xl border-2 border-[#0A7EA4] text-[#0A7EA4] font-bold text-[14px] hover:bg-blue-50 transition-colors">
            انتخاب این پلن
          </button>
        </div>

        {/* PLAN CARD 2 — Popular */}
        <div 
          className="mx-4 mt-6 bg-white rounded-2xl p-5 relative"
          style={{ 
            boxShadow: '0 4px 20px -2px rgba(245, 158, 11, 0.15), 0 0 0 2px #F59E0B'
          }}
        >
          <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#F59E0B] text-white text-[11px] font-bold px-3 py-1 rounded-full">
            محبوب‌ترین
          </div>
          <div className="mb-3 mt-1">
            <h2 className="font-bold text-[18px] text-[#111827]">پلن پیشرفته</h2>
          </div>
          <div className="mb-2">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[32px] text-[#0A7EA4]">۶۵۰،۰۰۰</span>
              <span className="text-[#6B7280] text-[14px]">تومان / ۳ ماه</span>
            </div>
            <div className="text-[#10B981] text-[12px] font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded mt-1">
              معادل ۲۱۶،۰۰۰ تومان در ماه
            </div>
          </div>
          <div className="h-px bg-gray-100 w-full mb-4 mt-3"></div>
          <ul className="space-y-2 mb-6 text-[12px] text-[#111827]">
            <li className="flex items-center gap-2"><Check size={16} className="text-[#F59E0B]" /> <span className="font-medium">همه امکانات پلن پایه</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>تا ۱۵۰ محصول</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>تا ۳۰ ویدیو</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>سیستم معرفی دوستان</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>گزارش آمار کامل (۹۰ روزه)</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>نمایش بنر تبلیغاتی</span></li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-[#0A7EA4] text-white font-bold text-[14px] hover:bg-[#085F80] transition-colors shadow-md shadow-blue-900/10">
            انتخاب این پلن
          </button>
        </div>

        {/* PLAN CARD 3 — Annual */}
        <div className="mx-4 mt-6 bg-gradient-to-br from-[#F0FDF4] to-[#EFF6FF] rounded-2xl border border-[#93C5FD] p-5 relative">
          <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#8B5CF6] text-white text-[11px] font-bold px-3 py-1 rounded-full">
            سالانه — صرفه‌جویی ۳۰٪
          </div>
          <div className="mb-3 mt-1">
            <h2 className="font-bold text-[18px] text-[#111827]">پلن سالانه</h2>
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[28px] text-[#111827]">۲،۲۰۰،۰۰۰</span>
              <span className="text-[#6B7280] text-[14px]">تومان / سال</span>
            </div>
          </div>
          <div className="h-px bg-white/60 w-full mb-4"></div>
          <ul className="space-y-2 mb-6 text-[12px] text-[#111827]">
            <li className="flex items-center gap-2"><Check size={16} className="text-[#8B5CF6]" /> <span className="font-medium">همه امکانات پلن پیشرفته</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>محصولات و ویدیوهای نامحدود</span></li>
            <li className="flex items-center gap-2"><Check size={16} className="text-[#0A7EA4]" /> <span>پشتیبانی اولویت‌دار ۲۴/۷</span></li>
          </ul>
          <button className="w-full py-3 rounded-xl border border-[#93C5FD] bg-white text-[#0A7EA4] font-bold text-[14px] hover:bg-blue-50 transition-colors shadow-sm">
            انتخاب این پلن
          </button>
        </div>

        {/* NOTE */}
        <div className="px-4 mt-6 mb-6 text-center text-[#9CA3AF] text-[11px]">
          ⚠️ قیمت‌ها و امکانات از سرور بارگذاری می‌شوند و ممکن است تغییر کنند
        </div>

      </div>

      {/* FIXED BOTTOM NAV */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex items-center justify-around pb-safe pt-2 px-2 z-20 h-[64px] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
          <Home size={22} />
          <span className="text-[10px]">خانه</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
          <Search size={22} />
          <span className="text-[10px]">جستجو</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#0A7EA4]">
          <Star size={22} className="fill-[#0A7EA4]" />
          <span className="text-[10px] font-medium">اشتراک</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
          <User size={22} />
          <span className="text-[10px]">پروفایل</span>
        </button>
      </nav>
    </div>
  );
}
