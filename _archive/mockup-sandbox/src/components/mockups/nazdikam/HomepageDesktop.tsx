import React from "react";
import { Search, MapPin, ChevronDown, Check, Star, Phone, ShieldCheck, Store, Map, X, Sparkles, Navigation, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export function HomepageDesktop() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="min-h-screen bg-[#F7F8FA] text-[#111827]"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* SECTION 1 - TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between h-16 px-8 max-w-[1600px] mx-auto">
          {/* Right: Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              <span className="text-[#0A7EA4] font-bold text-2xl tracking-tight">نزدیکام</span>
            </div>
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            <span className="text-[#6B7280] text-xs font-medium hidden md:block">بازار محلی شمال ایران</span>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl mx-8 relative">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="دنبال چه می‌گردید؟ (رستوران، تعمیرکار، پزشک...)"
                className="w-full bg-gray-100 border-transparent rounded-full h-10 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7EA4] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Left: Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium">
              <MapPin className="w-4 h-4 ml-1.5" />
              مازندران
              <ChevronDown className="w-4 h-4 mr-1" />
            </Button>
            <Button variant="outline" className="border-[#0A7EA4] text-[#0A7EA4] hover:bg-[#0A7EA4]/5 font-medium">
              ورود / ثبت‌نام
            </Button>
            <Button className="bg-[#0A7EA4] hover:bg-[#085F80] text-white font-medium">
              ثبت کسب‌وکار
            </Button>
          </div>
        </div>
      </header>

      {/* SECTION 2 - CATEGORY BAR */}
      <div className="w-full bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center justify-center gap-2 h-14 overflow-x-auto no-scrollbar">
            {[
              { icon: "🍽️", label: "غذا و رستوران" },
              { icon: "🏥", label: "سلامت و پزشکی" },
              { icon: "👗", label: "پوشاک و مد" },
              { icon: "🔧", label: "خدمات و تعمیرات" },
              { icon: "🏠", label: "خانه و دکور" },
              { icon: "🚗", label: "خودرو و وسایل نقلیه" },
              { icon: "💇", label: "زیبایی و آرایش" },
              { icon: "➕", label: "همه دسته‌ها" },
            ].map((cat, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-[#0A7EA4]/5 text-gray-700 hover:text-[#0A7EA4] transition-colors whitespace-nowrap text-sm font-medium"
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3 - HERO BANNER */}
      <div className="w-full bg-gradient-to-l from-[#0A7EA4] to-[#085F80] relative overflow-hidden h-[320px]">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute top-10 right-1/3 w-40 h-40 rounded-full bg-[#10B981]/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-8 h-full flex items-center relative z-10">
          {/* Hero Content */}
          <div className="flex-1 pt-8 text-white">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-4 px-3 py-1 text-xs backdrop-blur-sm">
              <Sparkles className="w-3 h-3 ml-1" />
              ویژه استان‌های شمالی
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              بزرگترین بازار محلی شمال
            </h1>
            <p className="text-[#E0F2FE] text-lg mb-8 max-w-xl font-light">
              هزاران کسب‌وکار محلی، محصولات و خدمات در استان‌های مازندران، گیلان و گلستان را اینجا پیدا کنید.
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg" className="bg-white text-[#0A7EA4] hover:bg-gray-50 shadow-lg text-base h-12 px-6">
                مشاهده کسب‌وکارها
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white text-base h-12 px-6 bg-transparent">
                ثبت کسب‌وکار رایگان
              </Button>
            </div>
          </div>

          {/* Hero Image / Mockup Cards */}
          <div className="hidden lg:block w-[400px] relative h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[250px] perspective-1000">
              {/* Card 1 - Back */}
              <div className="absolute top-4 -right-4 w-[280px] bg-white rounded-xl shadow-xl p-4 rotate-[5deg] opacity-60 transform scale-90">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-100"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
              {/* Card 2 - Middle */}
              <div className="absolute top-10 right-4 w-[280px] bg-white rounded-xl shadow-xl p-4 -rotate-[2deg] opacity-80 transform scale-95">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-orange-100"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
              {/* Card 3 - Front Active */}
              <div className="absolute top-16 left-8 w-[280px] bg-white rounded-xl shadow-2xl p-4 border border-gray-100 z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl">
                      🏪
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                        سوپرمارکت شمال
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">مازندران، ساری</p>
                    </div>
                  </div>
                  <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border-none px-1.5 py-0">
                    باز است
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <span className="text-xs text-gray-500">(۱۴۲ نظر)</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">تخفیف ویژه امروز: ۲۰٪</span>
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">تخفیف</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 - MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-8 py-8 flex gap-8">
        
        {/* LEFT SIDEBAR - Filters */}
        <aside className="w-[280px] shrink-0 space-y-6 hidden lg:block">
          {/* Filters Card */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden sticky top-[88px]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FilterIcon className="w-4 h-4 text-gray-500" />
                فیلترها
              </h3>
              <button className="text-xs text-[#0A7EA4] font-medium hover:underline">پاک کردن</button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Location */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">مکان</h4>
                <div className="space-y-3">
                  <div className="relative">
                    <select className="w-full text-sm border border-gray-300 rounded-lg h-9 px-3 appearance-none bg-white focus:ring-1 focus:ring-[#0A7EA4] focus:border-[#0A7EA4] outline-none">
                      <option>مازندران</option>
                      <option>گیلان</option>
                      <option>گلستان</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-50">
                    {["ساری", "آمل", "بابل", "نوشهر", "چالوس"].map((city, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${i === 0 ? 'bg-[#0A7EA4] border-[#0A7EA4]' : 'border-gray-300 group-hover:border-[#0A7EA4]'}`}>
                          {i === 0 && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">دسته‌بندی</h4>
                <div className="space-y-2">
                  {[
                    { label: "غذا و رستوران", count: "۱۲۳" },
                    { label: "سلامت و پزشکی", count: "۸۹" },
                    { label: "پوشاک و مد", count: "۶۴" },
                    { label: "خدمات و تعمیرات", count: "۴۲" },
                  ].map((cat, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-gray-300 group-hover:border-[#0A7EA4]"></div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{cat.label}</span>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{cat.count}</span>
                    </label>
                  ))}
                  <button className="text-xs text-[#0A7EA4] mt-2 font-medium">مشاهده همه دسته‌ها</button>
                </div>
              </div>

              <Button className="w-full bg-[#0A7EA4] hover:bg-[#085F80] text-white">
                اعمال فیلتر
              </Button>
            </div>
          </div>

          {/* Ad Card */}
          <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden relative group cursor-pointer hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-amber-600 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  آگهی ویژه
                </h3>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop" alt="Restaurant Ad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 right-2 text-white text-xs font-bold">رستوران اکبر جوجه اصلی</div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">با ارائه این آگهی از ۲۰٪ تخفیف ویژه در شعبه مرکزی ساری بهره‌مند شوید.</p>
              <Button variant="outline" size="sm" className="w-full text-xs h-8 border-amber-200 text-amber-700 hover:bg-amber-50">
                مشاهده آگهی
              </Button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN AREA */}
        <div className="flex-1 min-w-0 space-y-10">
          
          {/* Featured Businesses Section */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">کسب‌وکارهای ویژه</h2>
                <p className="text-sm text-gray-500">پیشنهادات برتر در منطقه شما</p>
              </div>
              <a href="#" className="text-sm text-[#0A7EA4] font-medium hover:underline flex items-center gap-1">
                مشاهده همه
                <NavigationIcon className="w-3.5 h-3.5 rotate-180" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                { name: "رستوران سنتی مازندران", cat: "غذا و رستوران", catIcon: "🍽️", city: "ساری", rating: "۴.۸", reviews: "۳۲۰", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop", open: true },
                { name: "کافه کتاب آرمان", cat: "کافه", catIcon: "☕", city: "بابل", rating: "۴.۹", reviews: "۱۵۶", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop", open: true },
                { name: "کلینیک دکتر فرهادی", cat: "پزشکی", catIcon: "🏥", city: "آمل", rating: "۴.۵", reviews: "۸۹", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=200&fit=crop", open: false },
              ].map((biz, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow overflow-hidden border-[#E5E7EB] group cursor-pointer">
                  <div className="h-32 bg-gray-100 relative overflow-hidden">
                    <img src={biz.img} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm flex items-center gap-1">
                      <span>{biz.catIcon}</span>
                      {biz.cat}
                    </div>
                    {biz.open ? (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">باز است</div>
                    ) : (
                      <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">بسته است</div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#0A7EA4] transition-colors">{biz.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {biz.city}
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {biz.rating} <span className="text-gray-400 font-normal">({biz.reviews})</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex gap-2">
                      <Button className="flex-1 bg-[#0A7EA4] hover:bg-[#085F80] text-white text-xs h-8">
                        <Store className="w-3.5 h-3.5 ml-1.5" />
                        مشاهده
                      </Button>
                      <Button variant="outline" className="flex-none w-8 h-8 p-0 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-green-600">
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Products Section */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">محصولات تازه و محلی</h2>
                <p className="text-sm text-gray-500">مستقیم از تولیدکنندگان منطقه</p>
              </div>
              <a href="#" className="text-sm text-[#0A7EA4] font-medium hover:underline flex items-center gap-1">
                مشاهده همه
                <NavigationIcon className="w-3.5 h-3.5 rotate-180" />
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "برنج طارم هاشمی درجه یک (۱۰ کیلو)", biz: "برنج‌کوبی احمدی", price: "۱،۲۵۰،۰۰۰", img: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=200&h=200&fit=crop" },
                { name: "عسل طبیعی بهارنارنج", biz: "زنبورداری کوهستان", price: "۴۵۰،۰۰۰", img: "https://images.unsplash.com/photo-1587049352847-4d4b1ed748d8?w=200&h=200&fit=crop" },
                { name: "رب انار محلی ملس", biz: "فروشگاه بی‌بی‌جان", price: "۱۸۰،۰۰۰", img: "https://images.unsplash.com/photo-1615486171448-4fdcb4dc2bd5?w=200&h=200&fit=crop" },
                { name: "صنایع دستی حصیری", biz: "گالری هنر شمال", price: "۳۲۰،۰۰۰", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=200&h=200&fit=crop" },
              ].map((prod, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] hover:shadow-md transition-all group overflow-hidden cursor-pointer flex flex-col">
                  <div className="aspect-square bg-gray-100 p-4 relative">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
                    <button className="absolute top-2 left-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-[#0A7EA4]">{prod.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1 mt-auto">
                      <Store className="w-3 h-3" />
                      {prod.biz}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="font-bold text-gray-900 text-sm">
                        {prod.price} <span className="text-xs font-normal text-gray-500">تومان</span>
                      </div>
                      <button className="w-6 h-6 rounded bg-[#0A7EA4]/10 text-[#0A7EA4] flex items-center justify-center hover:bg-[#0A7EA4] hover:text-white transition-colors">
                        <span className="text-lg leading-none mb-0.5">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Special Discounts Section */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">تخفیف‌های ویژه</h2>
                <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-none font-bold animate-pulse px-2 py-0.5">
                  🔴 زمان محدود
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "سرویس کامل روغن موتور", biz: "اتوسرویس برادران", price: "۶۵۰،۰۰۰", oldPrice: "۸۵۰،۰۰۰", discount: "۲۴٪", img: "https://images.unsplash.com/photo-1635773054091-72f170e5b7fb?w=200&h=200&fit=crop" },
                { name: "پاکسازی تخصصی پوست", biz: "سالن زیبایی گلها", price: "۳۵۰،۰۰۰", oldPrice: "۵۰۰،۰۰۰", discount: "۳۰٪", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop" },
                { name: "پیتزا مخصوص خانواده", biz: "فست‌فود شب‌های شمال", price: "۱۹۸،۰۰۰", oldPrice: "۲۸۰،۰۰۰", discount: "۲۹٪", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" },
                { name: "اشتراک ۱ ماهه باشگاه", biz: "باشگاه ورزشی المپیک", price: "۴۰۰،۰۰۰", oldPrice: "۶۰۰،۰۰۰", discount: "۳۳٪", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop" },
              ].map((prod, i) => (
                <div key={i} className="bg-white rounded-xl border border-red-100 hover:border-red-200 hover:shadow-md transition-all group overflow-hidden cursor-pointer flex flex-col relative">
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10 shadow-sm">
                    {prod.discount}
                  </div>
                  <div className="aspect-square bg-gray-50 relative">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">{prod.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1 mt-auto">
                      <Store className="w-3 h-3" />
                      {prod.biz}
                    </p>
                    <div className="mt-auto flex flex-col items-end">
                      <span className="text-xs text-gray-400 line-through mb-0.5">{prod.oldPrice}</span>
                      <div className="font-bold text-red-600 text-sm">
                        {prod.price} <span className="text-xs font-normal text-red-500">تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* SECTION 5 - FOOTER */}
      <footer className="bg-[#1E293B] text-white mt-12 w-full">
        <div className="max-w-[1600px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🏪</span>
                <span className="text-white font-bold text-3xl tracking-tight">نزدیکام</span>
              </div>
              <p className="text-gray-400 text-sm leading-loose">
                پلتفرم جامع معرفی و ارتباط با کسب‌وکارهای محلی در استان‌های شمالی کشور. هدف ما رونق اقتصاد بومی و دسترسی آسان شهروندان به خدمات با کیفیت است.
              </p>
            </div>

            {/* Col 2: Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">لینک‌های مفید</h4>
              <ul className="space-y-3">
                {["درباره ما", "قوانین و مقررات", "حریم خصوصی", "راهنمای استفاده", "وبلاگ نزدیکام"].map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                      <ChevronDown className="w-3 h-3 rotate-90" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">ارتباط با ما</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <span>مازندران، ساری، خیابان فرهنگ، ساختمان نزدیکام، طبقه سوم</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                  <span dir="ltr">۰۱۱ - ۳۳۳۳۴۴۴۴</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="w-5 h-5 flex items-center justify-center text-gray-500 shrink-0 text-xl">@</span>
                  <span>info@nazdikam.ir</span>
                </li>
              </ul>
            </div>

            {/* Col 4: App */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">اپلیکیشن موبایل</h4>
              <p className="text-sm text-gray-400 mb-4">
                برای تجربه بهتر، اپلیکیشن نزدیکام را دانلود کنید.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-4 py-2.5 flex items-center justify-center gap-3 transition-colors">
                  <span className="text-2xl">📱</span>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-300">دانلود از</div>
                    <div className="font-bold text-sm">کافه بازار</div>
                  </div>
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-4 py-2.5 flex items-center justify-center gap-3 transition-colors">
                  <span className="text-2xl">🌐</span>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-300">نسخه وب</div>
                    <div className="font-bold text-sm">وب‌اپلیکیشن (PWA)</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>تمام حقوق محفوظ است © نزدیکام ۱۴۰۵</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">اینستاگرام</a>
              <a href="#" className="hover:text-white transition-colors">تلگرام</a>
              <a href="#" className="hover:text-white transition-colors">توییتر</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Simple icons not in Lucide
function FilterIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function NavigationIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
