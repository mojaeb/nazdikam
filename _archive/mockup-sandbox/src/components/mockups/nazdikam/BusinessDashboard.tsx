import React from "react";
import { 
  Bell, 
  Store, 
  User, 
  CheckCircle2, 
  ExternalLink, 
  TrendingUp, 
  Package, 
  Wrench, 
  Video, 
  Megaphone, 
  BarChart3, 
  Gift, 
  Share2, 
  Home, 
  Search, 
  CreditCard,
  ChevronLeft
} from "lucide-react";

export function BusinessDashboard() {
  return (
    <div 
      dir="rtl" 
      lang="fa" 
      className="min-h-screen w-full max-w-[390px] mx-auto bg-[#F7F8FA] relative overflow-hidden flex flex-col shadow-xl"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* 1. DARK HEADER */}
      <header className="h-14 bg-[#0A7EA4] text-white flex items-center justify-between px-4 shrink-0 shadow-md relative z-10">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-white/90" />
          <span className="font-bold text-[15px]">کافه کتاب آرمان</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-1">
            <Bell className="w-5 h-5 text-white/90" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A7EA4]"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
            ع
          </div>
        </div>
      </header>

      {/* 2. SUBSCRIPTION BANNER */}
      <div className="bg-[#10B981] text-white px-4 py-2 flex items-center justify-center gap-2 h-9 shrink-0">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-[13px] font-medium">اشتراک فعال — اعتبار تا ۱۵ شهریور ۱۴۰۵</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* 3. BUSINESS IDENTITY CARD */}
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0A7EA4] text-white flex items-center justify-center font-bold text-xl shrink-0">
              ک
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-[16px] text-[#111827]">کافه کتاب آرمان</h2>
                <span className="inline-flex items-center gap-1 bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  تایید شده
                </span>
              </div>
              <p className="text-[#6B7280] text-xs">کافه و فروشگاه کتاب • لاهیجان</p>
            </div>
          </div>
          <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
            <a href="#" className="text-[#0A7EA4] text-[12px] font-medium flex items-center gap-1 hover:underline">
              مشاهده صفحه عمومی
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4. STATS GRID */}
        <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
          {/* Today Views */}
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] border-r-4 border-r-[#0A7EA4] shadow-sm flex flex-col">
            <span className="text-[#6B7280] text-[12px] mb-1">بازدید امروز</span>
            <div className="flex items-end justify-between mt-auto">
              <span className="font-bold text-[20px] text-[#0A7EA4] leading-none">۱۲۷</span>
              <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                ۱۸٪
              </span>
            </div>
          </div>
          {/* This Week Views */}
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] border-r-4 border-r-[#3B82F6] shadow-sm flex flex-col">
            <span className="text-[#6B7280] text-[12px] mb-1">این هفته</span>
            <div className="flex items-end justify-between mt-auto">
              <span className="font-bold text-[20px] text-[#111827] leading-none">۸۴۳</span>
              <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                ۵٪
              </span>
            </div>
          </div>
          {/* Products */}
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] border-r-4 border-r-[#F59E0B] shadow-sm flex flex-col">
            <span className="text-[#6B7280] text-[12px] mb-1">محصولات</span>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="font-bold text-[20px] text-[#111827] leading-none">۱۴</span>
              <span className="text-[#9CA3AF] text-[11px]">از ۵۰</span>
            </div>
          </div>
          {/* Services */}
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] border-r-4 border-r-[#8B5CF6] shadow-sm flex flex-col">
            <span className="text-[#6B7280] text-[12px] mb-1">خدمات</span>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="font-bold text-[20px] text-[#111827] leading-none">۶</span>
              <span className="text-[#9CA3AF] text-[11px]">از ۲۰</span>
            </div>
          </div>
        </div>

        {/* 5. SECTION TITLE */}
        <div className="px-4 mt-5 mb-2">
          <h3 className="font-bold text-[16px] text-[#111827]">مدیریت کسب‌وکار</h3>
        </div>

        {/* 6. QUICK ACCESS GRID */}
        <div className="mx-4 grid grid-cols-2 gap-3">
          {/* Products */}
          <button className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center gap-3 text-right hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#0A7EA4]/10 text-[#0A7EA4] flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-[13px] text-[#111827] truncate">محصولات</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">۱۴ محصول فعال</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </button>
          
          {/* Services */}
          <button className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center gap-3 text-right hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-[13px] text-[#111827] truncate">خدمات</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">۶ خدمت فعال</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </button>

          {/* Videos */}
          <button className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center gap-3 text-right hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-[13px] text-[#111827] truncate">ویدیوها</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">۳ ویدیو</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </button>

          {/* Announcements */}
          <button className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center gap-3 text-right hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-[13px] text-[#111827] truncate">اطلاعیه‌ها</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">۱ اطلاعیه</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </button>

          {/* Reports */}
          <button className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center gap-3 text-right hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-[13px] text-[#111827] truncate">گزارش‌ها</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">آمار کامل</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </button>

          {/* Referrals */}
          <button className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center gap-3 text-right hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#EC4899]/10 text-[#EC4899] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-[13px] text-[#111827] truncate">معرفی دوستان</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">۳ دعوت</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </button>
        </div>

        {/* 7. REFERRAL CARD */}
        <div className="mx-4 mt-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl p-4 shadow-md text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <h3 className="font-bold text-[14px]">سیستم معرفی دوستان</h3>
            </div>
            
            <div className="bg-white/20 rounded-lg p-2 flex items-center justify-between border border-white/10">
              <span className="text-[11px] opacity-90">کد دعوت شما:</span>
              <span className="font-mono text-[13px] font-bold tracking-wider" dir="ltr">ARMANCAFE140</span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className="text-[12px] opacity-90">۳ نفر دعوت شده | ۳ ماه رایگان</span>
              <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/30">
                اشتراک‌گذاری
                <Share2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 9. FIXED BOTTOM NAV */}
      <div className="absolute bottom-0 w-full h-[64px] bg-white border-t border-[#E5E7EB] flex items-center justify-around px-2 pb-safe z-20">
        <button className="flex flex-col items-center justify-center gap-1 w-16 h-full text-[#9CA3AF]">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">خانه</span>
        </button>
        
        <button className="flex flex-col items-center justify-center gap-1 w-16 h-full text-[#9CA3AF]">
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">جستجو</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 w-16 h-full text-[#0A7EA4]">
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-medium">داشبورد</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 w-16 h-full text-[#9CA3AF]">
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] font-medium">اشتراک</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-1 w-16 h-full text-[#9CA3AF]">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">پروفایل</span>
        </button>
      </div>
    </div>
  );
}
