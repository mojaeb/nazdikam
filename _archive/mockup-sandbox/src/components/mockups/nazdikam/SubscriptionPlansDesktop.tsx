import React, { useState } from 'react';
import { Check, X, ChevronDown, Search, MapPin, User, Star, CreditCard, ChevronLeft } from 'lucide-react';

export function SubscriptionPlansDesktop() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly');

  return (
    <div dir="rtl" lang="fa" style={{ fontFamily: "'Vazirmatn', sans-serif" }} className="min-h-screen bg-[#F7F8FA] w-full text-[#111827]">
      {/* SECTION 1: NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 h-16 w-full flex items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-black text-[#0A7EA4]">نزدیکام</div>
          <div className="flex items-center gap-6 text-[15px] font-medium text-gray-600">
            <a href="#" className="hover:text-[#0A7EA4] transition-colors">کسب‌وکارها</a>
            <a href="#" className="hover:text-[#0A7EA4] transition-colors">محصولات</a>
            <a href="#" className="hover:text-[#0A7EA4] transition-colors">خدمات</a>
            <a href="#" className="text-[#0A7EA4] flex items-center gap-1"><CreditCard size={18} /> پلن‌ها</a>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="جستجو در کسب‌وکارها، محصولات و..." 
              className="w-full bg-gray-100 text-gray-500 rounded-full py-2.5 pr-11 pl-4 outline-none border border-transparent focus:border-[#0A7EA4] focus:bg-white transition-all text-sm"
              readOnly
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm">
            <MapPin size={18} />
            <span>رشت</span>
          </button>
          <div className="w-px h-6 bg-gray-200"></div>
          <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium text-sm transition-colors">
            <User size={18} />
            <span>ورود / ثبت‌نام</span>
          </button>
        </div>
      </nav>

      {/* SECTION 2: PAGE HERO */}
      <section className="w-full py-16 bg-gradient-to-b from-[#0A7EA4] to-[#085F80] flex flex-col items-center text-center px-4">
        <h1 className="text-white font-bold text-4xl mb-4">انتخاب پلن مناسب برای کسب‌وکار شما</h1>
        <p className="text-white/80 text-lg max-w-2xl mb-8">با نزدیکام کسب‌وکار خود را در سراسر شمال ایران دیده شوید. امکانات مورد نیاز خود را انتخاب کنید و فروش خود را افزایش دهید.</p>
        
        <div className="bg-[#10B981]/20 border border-[#10B981]/40 text-emerald-100 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium mb-10 backdrop-blur-sm">
          <Check size={16} className="text-[#10B981]" />
          <span>پلن فعلی: ماهانه — اعتبار تا ۱۵ شهریور ۱۴۰۵</span>
        </div>

        <div className="bg-white/10 p-1 rounded-2xl flex items-center backdrop-blur-md">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#0A7EA4] text-white shadow-md' : 'text-white/70 hover:text-white'}`}
          >
            ماهانه
          </button>
          <button 
            onClick={() => setBillingCycle('quarterly')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'quarterly' ? 'bg-[#0A7EA4] text-white shadow-md' : 'text-white/70 hover:text-white'}`}
          >
            سه‌ماهه
          </button>
          <button 
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-[#0A7EA4] text-white shadow-md' : 'text-white/70 hover:text-white'}`}
          >
            سالانه
            <span className="bg-amber-400 text-amber-900 text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">۳۰٪ تخفیف</span>
          </button>
        </div>
      </section>

      {/* SECTION 3: PRICING CARDS */}
      <section className="max-w-6xl mx-auto py-16 px-8 relative -mt-10 z-10">
        <div className="grid grid-cols-3 gap-6 items-end">
          {/* CARD 1 — پلن پایه */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="bg-gray-50 p-6 text-center border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-900">پلن پایه</h3>
              <p className="text-gray-500 text-sm mt-1">برای شروع و کسب‌وکارهای کوچک</p>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-black text-[#0A7EA4]">۲۵۰،۰۰۰</span>
                  <span className="text-gray-500">تومان</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">/ ۳۰ روز</div>
              </div>
              
              <div className="h-px w-full bg-gray-100 mb-6"></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  { text: 'صفحه کسب‌وکار عمومی', included: true },
                  { text: 'مدیریت تا ۵۰ محصول', included: true },
                  { text: 'مدیریت تا ۲۰ خدمت', included: true },
                  { text: 'آپلود تا ۱۰ ویدیو', included: true },
                  { text: 'اطلاعات تماس کامل', included: true },
                  { text: 'گزارش آمار پایه', included: true },
                  { text: 'سیستم معرفی دوستان', included: false },
                  { text: 'نمایش بنر تبلیغاتی', included: false },
                  { text: 'محصولات نامحدود', included: false },
                  { text: 'پشتیبانی اولویت‌دار', included: false },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check size={18} className="text-[#0A7EA4] shrink-0" />
                    ) : (
                      <X size={18} className="text-gray-300 shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-700 font-medium' : 'text-gray-400'}>{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3.5 rounded-xl border-2 border-[#0A7EA4] text-[#0A7EA4] font-bold text-center hover:bg-[#0A7EA4]/5 transition-colors">
                انتخاب پلن پایه
              </button>
            </div>
          </div>

          {/* CARD 2 — پلن پیشرفته */}
          <div className="bg-white rounded-2xl shadow-2xl ring-2 ring-[#F59E0B] overflow-hidden flex flex-col relative transform scale-105 z-10">
            <div className="absolute top-0 inset-x-0 flex justify-center">
              <div className="bg-[#F59E0B] text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-sm">
                محبوب‌ترین
              </div>
            </div>
            <div className="bg-[#0A7EA4] p-8 text-center pt-10">
              <h3 className="font-bold text-2xl text-white">پلن پیشرفته</h3>
              <p className="text-white/80 text-sm mt-1">پرفروش‌ترین پلن برای رشد سریع</p>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-5xl font-black text-gray-900">۶۵۰،۰۰۰</span>
                  <span className="text-gray-500 font-medium">تومان</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">/ ۹۰ روز</div>
                <div className="mt-3 inline-block bg-[#10B981]/10 text-[#10B981] text-xs font-bold px-2.5 py-1 rounded-full">
                  معادل ۲۱۶،۰۰۰ تومان در ماه — ۱۴٪ صرفه‌جویی
                </div>
              </div>
              
              <div className="h-px w-full bg-gray-100 mb-6"></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  { text: 'همه امکانات پلن پایه' },
                  { text: 'تا ۱۵۰ محصول' },
                  { text: 'تا ۳۰ ویدیو' },
                  { text: 'سیستم معرفی دوستان' },
                  { text: 'گزارش آمار کامل (۹۰ روزه)' },
                  { text: 'نمایش بنر تبلیغاتی' },
                  { text: 'آمار بازدید دقیق' },
                  { text: 'نشان ویژه روی صفحه' },
                  { text: 'پشتیبانی چت آنلاین' },
                  { text: 'اولویت در نتایج جستجو' },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-[#F59E0B] shrink-0" />
                    <span className="text-gray-800 font-bold">{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-4 rounded-xl bg-[#0A7EA4] text-white font-bold text-center hover:bg-[#085F80] transition-colors shadow-lg shadow-[#0A7EA4]/30">
                انتخاب پلن پیشرفته
              </button>
            </div>
          </div>

          {/* CARD 3 — پلن سالانه */}
          <div className="bg-gradient-to-b from-[#f0fdfa] to-blue-50/50 rounded-2xl shadow-md border border-teal-200 overflow-hidden flex flex-col h-full relative">
            <div className="absolute top-4 left-4">
              <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-1 rounded border border-violet-200">
                ۳۰٪ صرفه‌جویی
              </span>
            </div>
            <div className="p-6 text-center border-b border-teal-100 mt-4">
              <h3 className="font-bold text-xl text-gray-900">پلن سالانه</h3>
              <p className="text-violet-600 text-sm mt-1 font-medium">بهترین ارزش برای حرفه‌ای‌ها</p>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-black text-violet-700">۲،۲۰۰،۰۰۰</span>
                  <span className="text-gray-500">تومان</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">/ ۳۶۵ روز</div>
                <div className="mt-3 inline-block bg-[#10B981]/10 text-[#10B981] text-xs font-bold px-2.5 py-1 rounded-full">
                  معادل ۱۸۳،۰۰۰ تومان در ماه — ۳۰٪ ارزان‌تر
                </div>
              </div>
              
              <div className="h-px w-full bg-teal-100 mb-6"></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm border-b border-teal-100 pb-2 mb-2">
                  <Check size={18} className="text-violet-600 shrink-0" />
                  <span className="text-gray-800 font-bold">همه امکانات پلن پیشرفته +</span>
                </li>
                {[
                  { text: 'محصولات و ویدیوهای نامحدود' },
                  { text: 'پشتیبانی اولویت‌دار ۲۴/۷' },
                  { text: 'گزارش آمار پیشرفته سالانه' },
                  { text: 'مشاوره رایگان راه‌اندازی' },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-violet-600 shrink-0" />
                    <span className="text-gray-800 font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3.5 rounded-xl border-2 border-violet-600 text-violet-700 font-bold text-center hover:bg-violet-50 transition-colors">
                انتخاب پلن سالانه
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">مقایسه کامل پلن‌ها</h2>
          <p className="text-gray-500">جزئیات دقیق امکانات هر پلن را بررسی کنید تا بهترین انتخاب را داشته باشید.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-right">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-gray-50 text-gray-700 font-bold w-1/4 border-b border-gray-200">ویژگی</th>
                <th className="py-4 px-6 bg-white text-gray-900 font-bold w-1/4 border-b border-gray-200 text-center">پلن پایه</th>
                <th className="py-4 px-6 bg-[#0A7EA4] text-white font-bold w-1/4 border-b border-[#085F80] text-center relative">
                  پلن پیشرفته <Star className="inline text-amber-300 ml-1 mb-1" size={16} fill="currentColor" />
                </th>
                <th className="py-4 px-6 bg-violet-50 text-violet-900 font-bold w-1/4 border-b border-violet-100 text-center">پلن سالانه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'تعداد محصولات', basic: '۵۰', pro: '۱۵۰', annual: 'نامحدود' },
                { name: 'آپلود ویدیو', basic: '۱۰ ویدیو', pro: '۳۰ ویدیو', annual: 'نامحدود' },
                { name: 'گزارشات آمار', basic: 'پایه (۳۰ روزه)', pro: 'کامل (۹۰ روزه)', annual: 'پیشرفته (سالانه)' },
                { name: 'نمایش بنر تبلیغاتی', basic: false, pro: true, annual: true },
                { name: 'سیستم معرفی دوستان', basic: false, pro: true, annual: true },
                { name: 'اولویت در جستجو', basic: false, pro: true, annual: true },
                { name: 'نشان ویژه فروشگاه', basic: false, pro: true, annual: true },
                { name: 'پشتیبانی', basic: 'ایمیل', pro: 'چت آنلاین', annual: 'اولویت‌دار ۲۴/۷' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-700">{row.name}</td>
                  <td className="py-4 px-6 text-center text-gray-600">
                    {typeof row.basic === 'boolean' ? (
                      row.basic ? <Check size={20} className="text-[#0A7EA4] mx-auto" /> : <X size={20} className="text-gray-300 mx-auto" />
                    ) : row.basic}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-[#0A7EA4] bg-[#0A7EA4]/5 border-x border-[#0A7EA4]/10">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <Check size={20} className="text-[#0A7EA4] mx-auto" /> : <X size={20} className="text-gray-300 mx-auto" />
                    ) : row.pro}
                  </td>
                  <td className="py-4 px-6 text-center text-violet-700 font-medium">
                    {typeof row.annual === 'boolean' ? (
                      row.annual ? <Check size={20} className="text-violet-600 mx-auto" /> : <X size={20} className="text-gray-300 mx-auto" />
                    ) : row.annual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section className="max-w-3xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">سوالات متداول</h2>
        
        <div className="space-y-4">
          {[
            'آیا می‌توانم پلن خود را تغییر دهم؟',
            'روش پرداخت چیست؟',
            'آیا امکان استرداد وجه وجود دارد؟'
          ].map((question, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-gray-300 transition-colors flex justify-between items-center shadow-sm">
              <span className="font-medium text-gray-800">{question}</span>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="text-2xl font-black text-white mb-4">نزدیکام</div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              بزرگترین پلتفرم معرفی و جستجوی کسب‌وکارها، محصولات و خدمات در سراسر استان‌های شمالی ایران.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">صفحه اصلی</a></li>
              <li><a href="#" className="hover:text-white transition-colors">جستجوی کسب‌وکارها</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ثبت کسب‌وکار جدید</a></li>
              <li><a href="#" className="hover:text-white transition-colors">دانلود اپلیکیشن</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">پشتیبانی</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">سوالات متداول</a></li>
              <li><a href="#" className="hover:text-white transition-colors">تماس با ما</a></li>
              <li><a href="#" className="hover:text-white transition-colors">قوانین و مقررات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">حریم خصوصی</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">ارتباط با ما</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16} /> رشت، گلسار، بلوار سمیه</li>
              <li className="flex items-center gap-2"><span dir="ltr">۰۱۳ - ۳۳۳۳ ۳۳۳۳</span></li>
              <li className="flex items-center gap-2">info@nazdikam.ir</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          تمامی حقوق برای پلتفرم نزدیکام محفوظ است. © ۱۴۰۳
        </div>
      </footer>
    </div>
  );
}
