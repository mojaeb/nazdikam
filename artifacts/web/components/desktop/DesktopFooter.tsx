import { useLocation } from "wouter";
import { getAllCategories } from "@/lib/mock-categories";
import { MapPinIcon } from "@/components/icons";

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-iran-yekan-x font-bold text-white text-sm mb-5">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        className="text-neutral-400 font-vazirmatn text-sm hover:text-white transition-colors text-start"
        onClick={onClick}
      >
        {label}
      </button>
    </li>
  );
}

export function DesktopFooter() {
  const [, navigate] = useLocation();
  const topCategories = getAllCategories().slice(0, 6);

  return (
    <footer className="bg-neutral-900" dir="rtl">
      <div className="max-w-[1440px] mx-auto px-10 py-16">
        {/* Main columns */}
        <div className="grid grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Column 1: Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                <MapPinIcon size={18} className="text-white" />
              </div>
              <p className="font-iran-yekan-x font-bold text-white text-xl">نزدیکام</p>
            </div>
            <p className="text-neutral-400 font-vazirmatn text-sm leading-relaxed mb-6">
              بازار محلی آنلاین شمال ایران — کسب‌وکارها و محصولات محلی را در نزدیکی خود کشف کنید.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {["اینستاگرام", "تلگرام", "توییتر"].map(s => (
                <button
                  key={s}
                  type="button"
                  className="w-9 h-9 rounded-xl border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                  aria-label={s}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 006 0V12a10 10 0 10-3.92 7.94" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Provinces */}
          <FooterCol title="استان‌ها">
            <FooterLink label="مازندران" onClick={() => navigate("/search")} />
            <FooterLink label="گیلان" onClick={() => navigate("/search")} />
            <FooterLink label="گلستان" onClick={() => navigate("/search")} />
            <FooterLink label="بابل" onClick={() => navigate("/search")} />
            <FooterLink label="رشت" onClick={() => navigate("/search")} />
            <FooterLink label="گرگان" onClick={() => navigate("/search")} />
          </FooterCol>

          {/* Column 3: Categories */}
          <FooterCol title="دسته‌بندی‌ها">
            {topCategories.map(cat => (
              <FooterLink
                key={cat.id}
                label={cat.name}
                onClick={() => navigate(`/categories/${cat.slug}`)}
              />
            ))}
          </FooterCol>

          {/* Column 4: Links */}
          <FooterCol title="نزدیکام">
            <FooterLink label="درباره ما" onClick={() => {}} />
            <FooterLink label="تماس با ما" onClick={() => {}} />
            <FooterLink label="ثبت کسب‌وکار" onClick={() => {}} />
            <FooterLink label="شرایط استفاده" onClick={() => {}} />
            <FooterLink label="حریم خصوصی" onClick={() => {}} />
            <FooterLink label="راهنمای استفاده" onClick={() => {}} />
          </FooterCol>

          {/* Column 5: App download */}
          <div>
            <h3 className="font-iran-yekan-x font-bold text-white text-sm mb-5">دانلود اپ</h3>
            <p className="text-neutral-400 font-vazirmatn text-xs leading-relaxed mb-5">
              نزدیکام را روی گوشی خود نصب کنید و از همه امکانات لذت ببرید.
            </p>
            <div className="space-y-3">
              {["دانلود از بازار", "دانلود از Google Play"].map(label => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-3 w-full h-11 px-4 rounded-xl border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
                  aria-label={label}
                >
                  <div className="w-6 h-6 rounded-lg bg-neutral-700 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3" />
                    </svg>
                  </div>
                  <span className="text-neutral-300 font-vazirmatn text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-between pt-8">
          <p className="text-neutral-500 font-vazirmatn text-xs">
            © ۱۴۰۴ نزدیکام · تمامی حقوق محفوظ است
          </p>
          <div className="flex items-center gap-6">
            {["حریم خصوصی", "شرایط استفاده", "تماس"].map(link => (
              <button key={link} type="button" className="text-neutral-500 font-vazirmatn text-xs hover:text-neutral-300 transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
