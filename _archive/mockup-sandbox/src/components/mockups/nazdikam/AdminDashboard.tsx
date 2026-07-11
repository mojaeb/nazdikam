import React from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Video,
  Megaphone,
  CreditCard,
  Ticket,
  MapPin,
  LayoutGrid,
  Image as ImageIcon,
  ShieldCheck,
  Settings,
  Bell,
  User,
  LogOut,
  ArrowUpRight,
  AlertTriangle,
  Plus,
  Download,
  ChevronLeft,
  Eye,
  Edit,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from "lucide-react";

export function AdminDashboard() {
  return (
    <div
      dir="rtl"
      lang="fa"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      className="w-full min-h-screen bg-[#F7F8FA] flex flex-col font-sans text-[#111827] overflow-hidden"
    >
      {/* TOP HEADER */}
      <header className="w-full h-[60px] bg-[#1E293B] flex items-center px-6 shrink-0 z-10 shadow-sm justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-xl flex items-center gap-2">
            <span>🏪</span> نزدیکام
          </span>
          <span className="text-[#0A7EA4] text-sm font-medium bg-[#1E293B] border border-[#0A7EA4]/30 px-2 py-0.5 rounded-md">
            پنل مدیریت
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-red-500/20 transition-colors">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            ۳ هشدار
          </div>
          
          <button className="relative text-gray-300 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              ۱۲
            </span>
          </button>

          <div className="w-px h-6 bg-gray-600 mx-1"></div>

          <button className="flex items-center gap-2 text-white hover:bg-white/5 px-2 py-1 rounded-md transition-colors text-sm">
            <div className="bg-gray-600 p-1 rounded-full">
              <User size={16} />
            </div>
            <span>ادمین: علی ▾</span>
          </button>

          <button className="flex items-center gap-1 text-red-400 border border-red-400/30 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-400/10 transition-colors">
            <LogOut size={14} />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* RIGHT SIDEBAR */}
        <aside className="w-64 bg-white border-l border-[#E5E7EB] flex flex-col h-full overflow-y-auto shrink-0 py-4 custom-scrollbar">
          
          <div className="mb-6 px-3">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-2 px-3 tracking-wider">عمومی</div>
            <button className="w-full flex items-center gap-3 bg-[#0A7EA4]/10 text-[#0A7EA4] font-semibold py-2.5 px-3 rounded-lg text-sm transition-colors">
              <LayoutDashboard size={18} />
              <span>پیشخوان</span>
            </button>
          </div>

          <div className="mb-6 px-3">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-2 px-3 tracking-wider">مدیریت</div>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <Users size={18} />
              <span>کاربران</span>
            </button>
            <button className="w-full flex items-center justify-between text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors">
              <div className="flex items-center gap-3">
                <Store size={18} />
                <span>کسب‌وکارها</span>
              </div>
              <span className="bg-[#F59E0B] text-white text-xs px-2 py-0.5 rounded-full font-medium">۱۴</span>
            </button>
          </div>

          <div className="mb-6 px-3">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-2 px-3 tracking-wider">محتوا</div>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <Package size={18} />
              <span>محصولات</span>
            </button>
            <button className="w-full flex items-center justify-between text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <div className="flex items-center gap-3">
                <Video size={18} />
                <span>ویدیوها</span>
              </div>
              <span className="bg-[#F59E0B] text-white text-xs px-2 py-0.5 rounded-full font-medium">۸</span>
            </button>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors">
              <Megaphone size={18} />
              <span>اطلاعیه‌ها</span>
            </button>
          </div>

          <div className="mb-6 px-3">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-2 px-3 tracking-wider">اشتراک</div>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <CreditCard size={18} />
              <span>پلن‌های اشتراک</span>
            </button>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors">
              <Ticket size={18} />
              <span>کدهای تخفیف</span>
            </button>
          </div>

          <div className="mb-6 px-3">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-2 px-3 tracking-wider">تنظیمات</div>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <MapPin size={18} />
              <span>مکان‌ها</span>
            </button>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <LayoutGrid size={18} />
              <span>دسته‌بندی‌ها</span>
            </button>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <ImageIcon size={18} />
              <span>بنرها</span>
            </button>
            <button className="w-full flex items-center justify-between text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors mb-1">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} />
                <span>احراز هویت</span>
              </div>
              <span className="bg-[#EF4444] text-white text-xs px-2 py-0.5 rounded-full font-medium">۳</span>
            </button>
            <button className="w-full flex items-center gap-3 text-[#6B7280] hover:bg-gray-50 py-2 px-3 rounded-lg text-sm transition-colors">
              <Settings size={18} />
              <span>تنظیمات سیستم</span>
            </button>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            
            {/* PAGE TITLE ROW */}
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-2xl font-bold text-[#111827]">پیشخوان</h1>
              <div className="text-[#9CA3AF] text-sm">۱۱ خرداد ۱۴۰۵</div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB] border-r-4 border-r-[#0A7EA4] flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users size={64} />
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] font-medium text-sm mb-3">
                  <Users size={16} className="text-[#0A7EA4]" />
                  کل کاربران
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-[#111827]">۱۲،۴۸۳</div>
                  <div className="bg-[#10B981]/10 text-[#10B981] flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium">
                    <ArrowUpRight size={14} />
                    ۵٪
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB] border-r-4 border-r-[#3B82F6] flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Store size={64} />
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] font-medium text-sm mb-3">
                  <Store size={16} className="text-[#3B82F6]" />
                  کسب‌وکارها
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-[#111827]">۲،۲۱۹</div>
                  <div className="bg-[#10B981]/10 text-[#10B981] flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium">
                    <ArrowUpRight size={14} />
                    ۳٪
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB] border-r-4 border-r-[#F59E0B] flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CreditCard size={64} />
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] font-medium text-sm mb-3">
                  <CreditCard size={16} className="text-[#F59E0B]" />
                  اشتراک فعال
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-[#111827]">۸۹۴</div>
                  <div className="bg-[#10B981]/10 text-[#10B981] flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium">
                    <ArrowUpRight size={14} />
                    ۸٪
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB] border-r-4 border-r-[#10B981] flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="text-6xl font-bold -mt-2 opacity-50">ت</div>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] font-medium text-sm mb-3">
                  <span className="text-[#10B981] text-lg font-bold leading-none">ت</span>
                  درآمد این ماه
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-[#111827]">۱۸۵م <span className="text-sm font-normal text-[#6B7280]">ت</span></div>
                  <div className="bg-[#10B981]/10 text-[#10B981] flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium">
                    <ArrowUpRight size={14} />
                    ۱۲٪
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="flex gap-3 mb-8">
              <button className="bg-white border border-[#E5E7EB] hover:border-[#0A7EA4] hover:text-[#0A7EA4] text-[#4B5563] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                <Plus size={16} /> کاربر جدید
              </button>
              <button className="bg-white border border-[#E5E7EB] hover:border-[#0A7EA4] hover:text-[#0A7EA4] text-[#4B5563] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                <Plus size={16} /> کسب‌وکار
              </button>
              <button className="bg-white border border-[#E5E7EB] hover:border-[#0A7EA4] hover:text-[#0A7EA4] text-[#4B5563] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                <Plus size={16} /> پلن
              </button>
              <button className="bg-white border border-[#E5E7EB] hover:border-[#0A7EA4] hover:text-[#0A7EA4] text-[#4B5563] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                <Plus size={16} /> بنر
              </button>
              
              <div className="flex-1"></div>
              
              <button className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#4B5563] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                <Download size={16} /> صادرات CSV
              </button>
            </div>

            {/* TWO-COLUMN ROW */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              
              {/* LEFT COLUMN: Pending Review */}
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-5">
                <h2 className="font-bold text-[#111827] text-[15px] mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#F59E0B] rounded-full"></div>
                  صف بررسی محتوا
                </h2>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100">
                    <div className="flex items-center gap-3 text-orange-800 text-sm font-medium">
                      <AlertTriangle size={18} className="text-orange-500" />
                      ۱۴ کسب‌وکار در انتظار تایید
                    </div>
                    <div className="bg-[#F59E0B] text-white text-xs px-2.5 py-1 rounded-full font-bold">۱۴</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100">
                    <div className="flex items-center gap-3 text-orange-800 text-sm font-medium">
                      <Video size={18} className="text-orange-500" />
                      ۸ ویدیو در انتظار بررسی
                    </div>
                    <div className="bg-[#F59E0B] text-white text-xs px-2.5 py-1 rounded-full font-bold">۸</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="flex items-center gap-3 text-red-800 text-sm font-medium">
                      <ShieldCheck size={18} className="text-red-500" />
                      ۳ احراز هویت در انتظار
                    </div>
                    <div className="bg-[#EF4444] text-white text-xs px-2.5 py-1 rounded-full font-bold">۳</div>
                  </div>
                </div>
                
                <button className="text-[#0A7EA4] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  <ChevronLeft size={16} /> مشاهده صف بررسی
                </button>
              </div>

              {/* RIGHT COLUMN: Latest Registrations */}
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-5">
                <h2 className="font-bold text-[#111827] text-[15px] mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#0A7EA4] rounded-full"></div>
                  آخرین ثبت‌نام‌ها
                </h2>
                
                <div className="space-y-4">
                  {[
                    { name: 'رستوران نارنج', city: 'آمل', cat: 'غذا', time: '۱۰ دقیقه پیش', color: 'bg-orange-100 text-orange-600', icon: '🍔' },
                    { name: 'فروشگاه پوشاک مهتاب', city: 'ساری', cat: 'پوشاک', time: '۱ ساعت پیش', color: 'bg-purple-100 text-purple-600', icon: '👗' },
                    { name: 'تعمیرات تخصصی خودرو', city: 'بابل', cat: 'خدمات', time: '۳ ساعت پیش', color: 'bg-blue-100 text-blue-600', icon: '🔧' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.color}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[#111827] mb-0.5">{item.name}</div>
                        <div className="text-xs text-[#6B7280]">{item.city} • {item.cat}</div>
                      </div>
                      <div className="bg-gray-100 text-[#6B7280] text-xs px-2 py-1 rounded-md">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* BUSINESSES TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden mb-8">
              <div className="px-5 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-gray-50/50">
                <h2 className="font-bold text-[#111827]">کسب‌وکارها</h2>
                <button className="text-[#0A7EA4] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  <ChevronLeft size={16} /> مشاهده همه
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] w-12">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      </th>
                      <th className="py-3 px-5 text-xs font-bold text-[#6B7280] uppercase">نام</th>
                      <th className="py-3 px-5 text-xs font-bold text-[#6B7280] uppercase">دسته</th>
                      <th className="py-3 px-5 text-xs font-bold text-[#6B7280] uppercase">شهر</th>
                      <th className="py-3 px-5 text-xs font-bold text-[#6B7280] uppercase">اشتراک</th>
                      <th className="py-3 px-5 text-xs font-bold text-[#6B7280] uppercase">وضعیت</th>
                      <th className="py-3 px-5 text-xs font-bold text-[#6B7280] uppercase text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-5 font-medium text-sm text-[#111827]">کافه آرمان</td>
                      <td className="py-3 px-5 text-sm text-[#6B7280]">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">غذا</span>
                      </td>
                      <td className="py-3 px-5 text-sm text-[#6B7280]">ساری</td>
                      <td className="py-3 px-5">
                        <span className="bg-[#F59E0B]/10 text-[#D97706] px-2.5 py-1 rounded-md text-xs font-medium border border-[#F59E0B]/20">
                          تا ۱۵ شهریور
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-1.5 text-[#10B981] text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                          فعال
                        </div>
                      </td>
                      <td className="py-3 px-5 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-gray-400 hover:text-[#0A7EA4] p-1.5 rounded bg-gray-50 hover:bg-teal-50 transition-colors" title="مشاهده">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-700 p-1.5 rounded bg-gray-50 hover:bg-gray-200 transition-colors" title="ویرایش">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="bg-gray-50/30 hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-5">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-5 font-medium text-sm text-[#111827]">پوشاک فیروز</td>
                      <td className="py-3 px-5 text-sm text-[#6B7280]">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">پوشاک</span>
                      </td>
                      <td className="py-3 px-5 text-sm text-[#6B7280]">رشت</td>
                      <td className="py-3 px-5">
                        <span className="bg-[#10B981]/10 text-[#059669] px-2.5 py-1 rounded-md text-xs font-medium border border-[#10B981]/20">
                          تا ۱۸ مرداد
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-1.5 text-[#10B981] text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                          فعال
                        </div>
                      </td>
                      <td className="py-3 px-5 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-gray-400 hover:text-[#0A7EA4] p-1.5 rounded bg-gray-50 hover:bg-teal-50 transition-colors" title="مشاهده">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-700 p-1.5 rounded bg-gray-50 hover:bg-gray-200 transition-colors" title="ویرایش">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-5 font-medium text-sm text-[#111827]">دارو نور</td>
                      <td className="py-3 px-5 text-sm text-[#6B7280]">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">داروخانه</span>
                      </td>
                      <td className="py-3 px-5 text-sm text-[#6B7280]">گرگان</td>
                      <td className="py-3 px-5">
                        <span className="text-[#9CA3AF] text-xs">
                          بدون اشتراک
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-1.5 text-[#F59E0B] text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                          انتظار
                        </div>
                      </td>
                      <td className="py-3 px-5 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-[#10B981] hover:bg-green-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold" title="تایید">
                            <CheckCircle2 size={16} /> تایید
                          </button>
                          <button className="text-[#EF4444] hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold" title="رد">
                            <XCircle size={16} /> رد
                          </button>
                        </div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
