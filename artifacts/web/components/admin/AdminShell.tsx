import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";
import { adminPath, sectionFromPath, type AdminSection } from "@/lib/admin-types";

const NAV: Array<{ id: AdminSection; label: string; icon: string }> = [
  { id: "overview", label: "داشبورد", icon: "📊" },
  { id: "users", label: "کاربران", icon: "👥" },
  { id: "categories", label: "دسته‌بندی‌ها", icon: "📁" },
  { id: "hero", label: "اسلایدر خانه", icon: "🖼️" },
  { id: "featured", label: "کسب‌وکارهای ویژه", icon: "⭐" },
  { id: "businesses", label: "بیزنس‌ها", icon: "🏪" },
  { id: "verification", label: "احراز هویت", icon: "✅" },
  { id: "plans", label: "پلن‌های اشتراک", icon: "💳" },
  { id: "audit", label: "لاگ عملیات", icon: "📋" },
];

function NavItem({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-vazirmatn transition-colors text-right",
        active
          ? "bg-blue-600 text-white font-medium"
          : "text-neutral-600 hover:bg-neutral-100",
      )}
    >
      <span className="text-base" aria-hidden="true">{item.icon}</span>
      {item.label}
    </button>
  );
}

export function AdminShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const active = sectionFromPath(location);

  return (
    <div className="min-h-screen bg-[#F7F8FA]" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-64 lg:flex-col lg:border-l lg:border-neutral-200 lg:bg-white">
        <div className="p-5 border-b border-neutral-100">
          <p className="font-iran-yekan-x font-bold text-neutral-900">پنل مدیریت</p>
          <p className="text-xs text-neutral-500 font-vazirmatn mt-1" dir="ltr">
            {user?.phone ?? ""}
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={active === item.id}
              onClick={() => navigate(adminPath(item.id))}
            />
          ))}
        </nav>
        <div className="p-3 border-t border-neutral-100 space-y-1">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-vazirmatn text-neutral-600 hover:bg-neutral-100 text-right"
          >
            بازگشت به سایت
          </button>
          <button
            type="button"
            onClick={() => void logout().then(() => navigate("/"))}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-vazirmatn text-rose-600 hover:bg-rose-50 text-right"
          >
            خروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:mr-64">
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div>
              <h1 className="font-iran-yekan-x font-bold text-lg text-neutral-900">{title}</h1>
              {subtitle ? (
                <p className="text-xs text-neutral-500 font-vazirmatn mt-0.5">{subtitle}</p>
              ) : null}
            </div>
            {actions}
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-5 pb-28 lg:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-neutral-200 px-1 py-1 flex justify-around">
        {NAV.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(adminPath(item.id))}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg min-w-0 flex-1",
              active === item.id ? "text-blue-600" : "text-neutral-500",
            )}
          >
            <span className="text-lg" aria-hidden="true">{item.icon}</span>
            <span className="text-[10px] font-vazirmatn truncate w-full text-center">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
