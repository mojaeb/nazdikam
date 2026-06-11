import React from "react";
import { 
  Search, X, MapPin, SlidersHorizontal, ChevronDown, 
  Star, Heart, UserPlus, CheckCircle2, Home, Compass, MessageCircle, User 
} from "lucide-react";

export function SearchResults() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="flex flex-col h-full min-h-[100dvh] bg-[#F7F8FA] w-[390px] max-w-full mx-auto relative overflow-hidden pb-20 shadow-xl border-x border-[#E5E7EB]"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <span className="text-[#0A7EA4] font-bold text-lg">🏪 نزدیکام</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F7F8FA] px-3 py-1 rounded-full text-sm text-[#111827] border border-[#E5E7EB]">
            <MapPin className="w-4 h-4 text-[#0A7EA4]" />
            مازندران
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E5E7EB] overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=33" alt="کاربر" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* SEARCH BAR */}
        <div className="px-4 pt-4 pb-2 bg-[#FFFFFF]">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#0A7EA4]" />
            </div>
            <input
              type="text"
              value="رستوران ساری"
              readOnly
              className="block w-full pl-10 pr-10 py-2.5 bg-[#F7F8FA] border-2 border-[#0A7EA4] rounded-xl text-sm focus:outline-none focus:ring-0 text-[#111827]"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <button className="p-1 rounded-full bg-[#E5E7EB] text-[#6B7280]">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[#9CA3AF] text-xs mt-2 px-1">۲۳ نتیجه برای «رستوران ساری»</p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] pb-3">
          <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-2 pt-1">
            <button className="flex items-center gap-1 bg-[#0A7EA4] text-white px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
              مازندران <X className="w-3 h-3 ml-1" />
            </button>
            <button className="flex items-center gap-1 bg-[#0A7EA4] text-white px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
              غذا <X className="w-3 h-3 ml-1" />
            </button>
            <button className="flex items-center gap-1 bg-[#F7F8FA] text-[#6B7280] border border-[#E5E7EB] px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
              <SlidersHorizontal className="w-3.5 h-3.5 ml-1" />
              فیلترها
            </button>
          </div>
          <div className="flex items-center justify-between px-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7280]">مرتب‌سازی:</span>
              <button className="flex items-center gap-1 text-xs font-medium text-[#111827]">
                جدیدترین
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="flex w-full bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <button className="flex-1 py-3 text-sm font-bold text-[#0A7EA4] border-b-2 border-[#0A7EA4] text-center">
            کسب‌وکارها (۸)
          </button>
          <button className="flex-1 py-3 text-sm font-medium text-[#6B7280] text-center">
            محصولات (۷)
          </button>
          <button className="flex-1 py-3 text-sm font-medium text-[#6B7280] text-center">
            خدمات (۸)
          </button>
        </div>

        {/* RESULTS LIST */}
        <div className="px-4 py-4 flex flex-col gap-3 pb-24">
          
          {/* Card 1 */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-3 border border-[#E5E7EB] border-r-4 border-r-[#0A7EA4]">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A7EA4] to-[#085F80] flex items-center justify-center text-white font-bold text-xl shrink-0">
                ر
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#111827] text-sm leading-tight">رستوران سنتی مازندران</h3>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">ساری، مازندران</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="bg-[#0A7EA4]/10 text-[#0A7EA4] px-2 py-0.5 rounded-full text-[10px] font-medium">غذا و رستوران</span>
                  <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    تایید شده
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB]/50">
              <div className="flex items-center gap-1 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold pt-0.5">۴.۵</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-medium hover:bg-[#F7F8FA]">
                  <Heart className="w-3.5 h-3.5" />
                  ذخیره
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#0A7EA4] text-[#0A7EA4] text-xs font-medium hover:bg-[#0A7EA4]/5">
                  <UserPlus className="w-3.5 h-3.5" />
                  دنبال کردن
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-3 border border-[#E5E7EB] border-r-4 border-r-[#0A7EA4]">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                ک
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#111827] text-sm leading-tight">کافه رستوران آرمان</h3>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">رشت، گیلان</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="bg-[#0A7EA4]/10 text-[#0A7EA4] px-2 py-0.5 rounded-full text-[10px] font-medium">کافه</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-3 border border-[#E5E7EB] border-r-4 border-r-[#0A7EA4]">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                ف
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#111827] text-sm leading-tight">فست‌فود پایتخت</h3>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">گرگان، گلستان</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="bg-[#0A7EA4]/10 text-[#0A7EA4] px-2 py-0.5 rounded-full text-[10px] font-medium">فست‌فود</span>
                  <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    تایید شده
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* BOTTOM SHEET HINT */}
      <div className="absolute bottom-16 left-0 right-0 h-16 bg-[#FFFFFF] rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex flex-col items-center pt-2 px-4 transition-transform z-20">
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mb-2"></div>
        <div className="flex w-full justify-between items-center">
          <span className="font-bold text-sm text-[#111827]">فیلترها</span>
          <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
        </div>
      </div>

      {/* FIXED BOTTOM NAV */}
      <nav className="absolute bottom-0 w-full bg-[#FFFFFF] border-t border-[#E5E7EB] flex items-center justify-around pb-safe z-30 h-16 px-2">
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-[#6B7280]">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">خانه</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-[#0A7EA4]">
          <Search className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-bold">جستجو</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-[#6B7280]">
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-medium">اکتشاف</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-[#6B7280]">
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">پیام‌ها</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-[#6B7280]">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">پروفایل</span>
        </button>
      </nav>

    </div>
  );
}
