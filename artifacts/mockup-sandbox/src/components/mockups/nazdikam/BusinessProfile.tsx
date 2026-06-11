import React from 'react';
import { 
  ArrowRight, 
  Share2, 
  Heart, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Send, 
  Globe, 
  Play, 
  Navigation,
  Home,
  Search,
  User,
  ShoppingBag
} from 'lucide-react';

export function BusinessProfile() {
  return (
    <div 
      dir="rtl" 
      lang="fa" 
      className="relative w-[390px] min-h-screen bg-[#F7F8FA] pb-[140px] overflow-x-hidden font-sans mx-auto shadow-xl"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* 1. TOP TRANSPARENT BAR */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-20">
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 2. BANNER */}
      <div className="relative w-full h-[195px] bg-gradient-to-br from-[#0A7EA4] to-[#10B981] overflow-hidden">
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', 
            backgroundSize: '12px 12px' 
          }}
        />
        
        {/* Gradient overlay for bottom text */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Business Name on Banner */}
        <div className="absolute bottom-4 left-4 text-white font-bold text-lg z-10">
          کافه کتاب آرمان
        </div>

        {/* LOGO circle */}
        <div className="absolute -bottom-8 right-4 w-16 h-16 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-md z-10">
          <span className="text-[#0A7EA4] text-2xl font-bold">ک</span>
        </div>
      </div>

      {/* 3. BUSINESS INFO */}
      <div className="pt-10 px-4">
        <h1 className="font-bold text-xl text-[#111827]">کافه کتاب آرمان</h1>
        
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تایید شده
          </div>
          <div className="text-[#0A7EA4] border border-[#0A7EA4] px-2.5 py-1 rounded-full text-xs">
            کافه
          </div>
          <div className="text-[#6B7280] border border-[#E5E7EB] bg-white px-2.5 py-1 rounded-full text-xs">
            ساری، مازندران
          </div>
        </div>

        {/* Stats */}
        <div className="text-[#9CA3AF] text-xs mt-3 flex items-center gap-1.5">
          <span className="text-[#F59E0B]">★</span>
          <span className="font-medium text-[#6B7280]">۴.۵</span>
          <span>·</span>
          <span>۱۲۸ دنبال‌کننده</span>
          <span>·</span>
          <span>عضو از ۱۴۰۳</span>
        </div>
      </div>

      {/* 4. ACTION BUTTONS */}
      <div className="mt-5 px-4 flex gap-3">
        <button className="flex-1 bg-[#0A7EA4] text-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm shadow-sm">
          <Phone className="w-4 h-4" />
          تماس بگیرید
        </button>
        <button className="flex-1 border border-[#0A7EA4] text-[#0A7EA4] bg-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm shadow-sm">
          <Navigation className="w-4 h-4" />
          مسیریابی
        </button>
      </div>

      <div className="mt-3 px-4 flex gap-2">
        <button className="flex-1 border border-[#E5E7EB] bg-white text-[#6B7280] flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium">
          <MessageCircle className="w-3.5 h-3.5" />
          واتساپ
        </button>
        <button className="flex-1 border border-[#E5E7EB] bg-white text-[#6B7280] flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium">
          <Send className="w-3.5 h-3.5" />
          تلگرام
        </button>
        <button className="flex-1 border border-[#E5E7EB] bg-white text-[#6B7280] flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium">
          <Globe className="w-3.5 h-3.5" />
          وب‌سایت
        </button>
      </div>

      {/* 5. DESCRIPTION */}
      <div className="mt-5 bg-white px-4 py-4 border-y border-[#E5E7EB]">
        <h2 className="font-bold text-[13px] text-[#111827] mb-2">توضیحات</h2>
        <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2">
          کافه کتاب آرمان یک فضای دنج و آرام برای عاشقان کتاب و قهوه در قلب ساری است. ما با ارائه بهترین قهوه‌های اسپشیالتی و مجموعه‌ای بی‌نظیر از کتاب‌های...
        </p>
        <button className="text-[#0A7EA4] text-sm font-medium mt-1">بیشتر بخوانید</button>
      </div>

      {/* 6. PRODUCTS */}
      <div className="mt-2 bg-white py-4 border-y border-[#E5E7EB]">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="font-bold text-[14px] text-[#111827]">محصولات <span className="text-[#9CA3AF] font-normal">(۱۲)</span></h2>
          <button className="text-[#0A7EA4] text-xs font-medium">مشاهده همه</button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-36 flex-shrink-0 snap-start bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
              <div className="h-[100px] bg-gradient-to-br from-[#0A7EA4]/20 to-[#F59E0B]/20 relative flex items-center justify-center">
                <span className="text-[#0A7EA4]/40 text-xs font-medium">تصویر محصول</span>
                <div className="absolute top-2 right-2 bg-[#F59E0B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  ۲۰٪ تخفیف
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="font-bold text-xs text-[#111827] mb-1 truncate">لته آرت اسپشیال</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#0A7EA4] font-bold text-sm">۸۰،۰۰۰</span>
                  <span className="text-[#9CA3AF] text-[10px]">تومان</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. VIDEOS */}
      <div className="mt-2 bg-white py-4 border-y border-[#E5E7EB]">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="font-bold text-[14px] text-[#111827]">ویدیوها <span className="text-[#9CA3AF] font-normal">(۳)</span></h2>
          <button className="text-[#0A7EA4] text-xs font-medium">مشاهده همه</button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-32 h-20 bg-[#111827] rounded-xl relative flex-shrink-0 snap-start overflow-hidden flex items-center justify-center shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10">
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
              <div className="absolute bottom-1.5 left-1.5 text-white text-[9px] font-medium bg-black/50 px-1 rounded z-10">
                ۱:۴۵
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. LOCATION */}
      <div className="mt-2 bg-white px-4 py-4 border-t border-[#E5E7EB] mb-4">
        <h2 className="font-bold text-[14px] text-[#111827] mb-3">موقعیت مکانی</h2>
        
        <div className="w-full h-[140px] bg-[#E5E7EB] rounded-xl flex flex-col items-center justify-center text-[#9CA3AF] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTIwIDBMNDAgMjAgMjAgNDAgMCAyMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L3N2Zz4=')] opacity-50 bg-repeat" />
          <MapPin className="w-8 h-8 text-[#0A7EA4] mb-1 z-10" />
          <span className="text-sm font-medium z-10">نقشه</span>
        </div>
        
        <div className="mt-3 flex items-start gap-1.5 text-[#6B7280]">
          <MapPin className="w-4 h-4 text-[#9CA3AF] mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">
            خیابان آزادی، پلاک ۴۵، کافه کتاب آرمان، ساری، مازندران
          </p>
        </div>
        
        <button className="w-full mt-4 border border-[#0A7EA4] text-[#0A7EA4] flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm">
          <Navigation className="w-4 h-4" />
          مسیریابی با نقشه
        </button>
      </div>

      {/* 10. STICKY CONTACT BAR */}
      <div className="fixed bottom-[60px] w-[390px] bg-white border-t border-[#E5E7EB] p-3 flex gap-2 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button className="flex-1 bg-[#0A7EA4] text-white flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium text-[13px]">
          <Phone className="w-4 h-4" />
          تماس
        </button>
        <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium text-[13px]">
          <MessageCircle className="w-4 h-4" />
          واتساپ
        </button>
        <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium text-[13px]">
          <Navigation className="w-4 h-4" />
          مسیریابی
        </button>
      </div>

      {/* 11. FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-[390px] h-[60px] bg-white border-t border-[#E5E7EB] flex justify-around items-center text-[#9CA3AF] z-50">
        <button className="flex flex-col items-center gap-1 text-[#0A7EA4]">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">خانه</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">جستجو</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">سبد خرید</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">پروفایل</span>
        </button>
      </div>
    </div>
  );
}
