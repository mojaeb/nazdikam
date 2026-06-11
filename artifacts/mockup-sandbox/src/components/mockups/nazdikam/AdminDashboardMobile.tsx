import React from "react";
import { 
  Bell, 
  Menu, 
  Users, 
  Store, 
  CreditCard, 
  Wallet,
  Plus,
  Upload,
  AlertTriangle,
  Video,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MoreVertical,
  LayoutDashboard,
  Settings
} from "lucide-react";

export function AdminDashboardMobile() {
  return (
    <div 
      dir="rtl" 
      lang="fa" 
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      className="w-full min-h-screen bg-[#F7F8FA] text-[#111827] pb-24 overflow-x-hidden"
    >
      {/* SECTION 1 — DARK HEADER */}
      <header className="h-[56px] bg-[#1E293B] text-white flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Store className="w-4 h-4 text-white" />
            <span className="font-bold text-[16px]">نزدیکام</span>
          </div>
          <span className="text-[#0A7EA4] text-[11px] font-medium pr-5">پنل مدیریت</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">۳</div>
            <div className="relative">
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#1E293B]">۱۲</div>
            </div>
          </div>
          <button className="text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* SECTION 2 — ALERT BANNER */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 cursor-pointer">
        <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
        <span className="text-[#F59E0B] text-[12px] font-medium flex-1">۱۴ کسب‌وکار در انتظار تایید — بررسی کنید &larr;</span>
      </div>

      {/* SECTION 3 — KPI CARDS */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border-t-4 border-t-[#0A7EA4] flex flex-col">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-2">
            <Users className="w-4 h-4" />
            <span className="text-[12px]">کل کاربران</span>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <span className="font-bold text-[22px] text-[#0A7EA4]">۱۲،۴۸۳</span>
            <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] px-1.5 py-0.5 rounded-md font-medium">&uarr; ۵٪</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border-t-4 border-t-blue-500 flex flex-col">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-2">
            <Store className="w-4 h-4" />
            <span className="text-[12px]">کسب‌وکارها</span>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <span className="font-bold text-[22px] text-[#111827]">۲،۲۱۹</span>
            <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] px-1.5 py-0.5 rounded-md font-medium">&uarr; ۳٪</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border-t-4 border-t-[#F59E0B] flex flex-col">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-2">
            <CreditCard className="w-4 h-4" />
            <span className="text-[12px]">اشتراک فعال</span>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <span className="font-bold text-[22px] text-[#111827]">۸۹۴</span>
            <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] px-1.5 py-0.5 rounded-md font-medium">&uarr; ۸٪</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border-t-4 border-t-[#10B981] flex flex-col">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-[12px]">درآمد ماه</span>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <span className="font-bold text-[22px] text-[#111827]">۱۸۵م ت</span>
            <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] px-1.5 py-0.5 rounded-md font-medium">&uarr; ۱۲٪</span>
          </div>
        </div>
      </div>

      {/* SECTION 4 — QUICK ACTIONS */}
      <div className="px-4 mt-5">
        <h3 className="font-bold text-[14px] mb-2.5 text-[#111827]">عملیات سریع</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button className="bg-white rounded-full shadow-sm px-3 py-1.5 text-[12px] font-medium text-[#111827] flex items-center gap-1.5 shrink-0 border border-[#E5E7EB]">
            <Plus className="w-3.5 h-3.5 text-[#0A7EA4]" /> کاربر
          </button>
          <button className="bg-white rounded-full shadow-sm px-3 py-1.5 text-[12px] font-medium text-[#111827] flex items-center gap-1.5 shrink-0 border border-[#E5E7EB]">
            <Plus className="w-3.5 h-3.5 text-[#0A7EA4]" /> کسب‌وکار
          </button>
          <button className="bg-white rounded-full shadow-sm px-3 py-1.5 text-[12px] font-medium text-[#111827] flex items-center gap-1.5 shrink-0 border border-[#E5E7EB]">
            <Plus className="w-3.5 h-3.5 text-[#0A7EA4]" /> پلن
          </button>
          <button className="bg-white rounded-full shadow-sm px-3 py-1.5 text-[12px] font-medium text-[#111827] flex items-center gap-1.5 shrink-0 border border-[#E5E7EB]">
            <Plus className="w-3.5 h-3.5 text-[#0A7EA4]" /> بنر
          </button>
          <button className="bg-white rounded-full shadow-sm px-3 py-1.5 text-[12px] font-medium text-[#111827] flex items-center gap-1.5 shrink-0 border border-[#E5E7EB]">
            <Upload className="w-3.5 h-3.5 text-[#6B7280]" /> صادرات
          </button>
        </div>
      </div>

      {/* SECTION 5 — CONTENT REVIEW QUEUE */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px] text-[#111827]">صف بررسی محتوا</h3>
            <button className="text-[#0A7EA4] text-[12px] font-medium hover:underline">مشاهده همه</button>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[13px] text-[#111827] font-medium">کسب‌وکار در انتظار تایید</span>
                <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">۱۴</span>
              </div>
              <button className="text-[11px] text-[#0A7EA4] font-medium flex items-center gap-0.5 bg-[#0A7EA4]/5 px-2 py-1 rounded-md">
                بررسی <span className="text-[10px]">&larr;</span>
              </button>
            </div>
            
            <div className="h-px bg-[#E5E7EB]" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[13px] text-[#111827] font-medium">ویدیو در انتظار بررسی</span>
                <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">۸</span>
              </div>
              <button className="text-[11px] text-[#0A7EA4] font-medium flex items-center gap-0.5 bg-[#0A7EA4]/5 px-2 py-1 rounded-md">
                بررسی <span className="text-[10px]">&larr;</span>
              </button>
            </div>
            
            <div className="h-px bg-[#E5E7EB]" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-[13px] text-[#111827] font-medium">احراز هویت در انتظار</span>
                <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">۳</span>
              </div>
              <button className="text-[11px] text-[#0A7EA4] font-medium flex items-center gap-0.5 bg-[#0A7EA4]/5 px-2 py-1 rounded-md">
                بررسی <span className="text-[10px]">&larr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 — BUSINESSES TABLE */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[15px] text-[#111827]">آخرین کسب‌وکارها</h3>
          <button className="text-[#0A7EA4] text-[12px] font-medium hover:underline flex items-center gap-1">مشاهده همه &larr;</button>
        </div>
        
        <div className="flex flex-col gap-2">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-[#0A7EA4] text-white flex items-center justify-center font-bold text-lg shrink-0">ک</div>
              <div className="flex flex-col">
                <span className="font-bold text-[13px] text-[#111827]">کافه آرمان</span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                  <span>ساری</span>
                  <span>·</span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">کافه و رستوران</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-md text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>فعال</span>
              </div>
              <button className="text-[#6B7280]"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shrink-0">پ</div>
              <div className="flex flex-col">
                <span className="font-bold text-[13px] text-[#111827]">پوشاک فیروز</span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                  <span>رشت</span>
                  <span>·</span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">فروشگاه پوشاک</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-md text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>فعال</span>
              </div>
              <button className="text-[#6B7280]"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-lg shrink-0">د</div>
              <div className="flex flex-col">
                <span className="font-bold text-[13px] text-[#111827]">دارو نور</span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                  <span>گرگان</span>
                  <span>·</span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">خدمات درمانی</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded-md text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>انتظار</span>
              </div>
              <button className="text-[#6B7280]"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7 — RECENT REGISTRATIONS */}
      <div className="px-4 mt-6 mb-4">
        <h3 className="font-bold text-[15px] text-[#111827] mb-3">آخرین ثبت‌نام‌ها</h3>
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍔</span>
              <span className="text-[13px] font-medium text-[#111827]">رستوران نارنج</span>
              <span className="text-[11px] text-[#6B7280]">· آمل</span>
            </div>
            <span className="text-[10px] bg-gray-100 text-[#6B7280] px-1.5 py-0.5 rounded">۱۰ دقیقه پیش</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">👗</span>
              <span className="text-[13px] font-medium text-[#111827]">فروشگاه مهتاب</span>
              <span className="text-[11px] text-[#6B7280]">· ساری</span>
            </div>
            <span className="text-[10px] bg-gray-100 text-[#6B7280] px-1.5 py-0.5 rounded">۱ ساعت پیش</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔧</span>
              <span className="text-[13px] font-medium text-[#111827]">تعمیرات خودرو</span>
              <span className="text-[11px] text-[#6B7280]">· بابل</span>
            </div>
            <span className="text-[10px] bg-gray-100 text-[#6B7280] px-1.5 py-0.5 rounded">۳ ساعت پیش</span>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 h-[56px] bg-[#1E293B] flex items-center justify-around px-2 z-50 rounded-t-xl">
        <button className="flex flex-col items-center gap-1 p-2 text-[#0A7EA4]">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold">پیشخوان</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 p-2 text-[#6B7280] hover:text-white transition-colors relative">
          <Store className="w-5 h-5" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#F59E0B] rounded-full border border-[#1E293B]"></div>
          <span className="text-[10px] font-medium">کسب‌وکارها</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 p-2 text-[#6B7280] hover:text-white transition-colors">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">کاربران</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 p-2 text-[#6B7280] hover:text-white transition-colors">
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] font-medium">اشتراک</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 p-2 text-[#6B7280] hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">تنظیمات</span>
        </button>
      </nav>
    </div>
  );
}
