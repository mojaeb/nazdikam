import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { avatarGradientIndex, formatPrice } from "@/lib/utils";
import { MapPinIcon, BookmarkIcon } from "@/components/icons";
import {
  fetchSavedItems,
  removeSavedItem,
  SavedAuthRequiredError,
  SAVED_ITEMS_CHANGED_EVENT,
  type SavedBusinessItem,
  type SavedItemsState,
  type SavedProductItem,
  type SavedServiceItem,
} from "@/lib/saved-items";
import { useAuth } from "@/src/contexts/AuthContext";
import { useLoginModal } from "@/lib/login-modal-context";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1860DB,#0A3FA0)",
  "linear-gradient(135deg,#0891B2,#164E63)",
  "linear-gradient(135deg,#059669,#064E3B)",
  "linear-gradient(135deg,#7C3AED,#3B0764)",
  "linear-gradient(135deg,#DC2626,#7F1D1D)",
  "linear-gradient(135deg,#D97706,#78350F)",
  "linear-gradient(135deg,#0284C7,#0C4A6E)",
  "linear-gradient(135deg,#16A34A,#14532D)",
  "linear-gradient(135deg,#9333EA,#4C1D95)",
  "linear-gradient(135deg,#E11D48,#881337)",
];

type TabKey = "businesses" | "products" | "services";

const TABS: { key: TabKey; label: string }[] = [
  { key: "businesses", label: "کسب‌وکارها" },
  { key: "products", label: "محصولات" },
  { key: "services", label: "خدمات" },
];

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <BookmarkIcon size={28} className="text-neutral-300" />
      </div>
      <p className="font-iran-yekan-x font-bold text-neutral-700 text-base">{label} ذخیره‌ای ندارید</p>
      <p className="font-vazirmatn text-sm text-neutral-400">هنگام مرور، روی نماد ذخیره ضربه بزنید.</p>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="shrink-0 h-8 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-vazirmatn font-medium"
    >
      حذف
    </button>
  );
}

function SavedBusinessCard({ biz, onRemove }: { biz: SavedBusinessItem; onRemove: () => void }) {
  const [, navigate] = useLocation();
  const idx = avatarGradientIndex(biz.name);
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/businesses/${biz.slug}`)}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-xl shrink-0"
        style={{ background: AVATAR_GRADIENTS[idx % 10] }}
      >
        {biz.name.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[14px] truncate">{biz.name}</p>
        {biz.category && <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{biz.category}</p>}
        <div className="flex items-center gap-1 mt-0.5">
          <MapPinIcon size={10} className="text-neutral-400" />
          <span className="font-vazirmatn text-xs text-neutral-400">{biz.city ?? "نامشخص"}</span>
        </div>
      </div>
      <RemoveButton onClick={onRemove} />
    </motion.div>
  );
}

function SavedProductCard({ item, onRemove }: { item: SavedProductItem; onRemove: () => void }) {
  const [, navigate] = useLocation();
  const priceLabel = item.price ? `${formatPrice(Number(item.price) || 0)} تومان` : null;
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/products/${item.slug || item.id}`)}
    >
      <div className="w-12 h-12 rounded-xl shrink-0 bg-amber-50 flex items-center justify-center text-amber-600 font-iran-yekan-x font-bold">
        {item.name.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{item.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">
          {item.seller ?? "فروشنده"} · {item.city ?? "نامشخص"}
        </p>
        {priceLabel && (
          <p className="font-iran-yekan-x font-bold text-amber-600 text-sm mt-1">{priceLabel}</p>
        )}
      </div>
      <RemoveButton onClick={onRemove} />
    </motion.div>
  );
}

function SavedServiceCard({ item, onRemove }: { item: SavedServiceItem; onRemove: () => void }) {
  const [, navigate] = useLocation();
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/services/${item.slug || item.id}`)}
    >
      <div className="w-12 h-12 rounded-xl shrink-0 bg-teal-50 flex items-center justify-center text-teal-600 font-iran-yekan-x font-bold">
        {item.name.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{item.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{item.provider ?? "ارائه‌دهنده"}</p>
        {item.priceRange && (
          <p className="font-vazirmatn text-amber-600 text-xs mt-1">
            {Number.isFinite(Number(item.priceRange))
              ? `${formatPrice(Number(item.priceRange))} تومان`
              : item.priceRange}
          </p>
        )}
      </div>
      <RemoveButton onClick={onRemove} />
    </motion.div>
  );
}

export default function SavedPage() {
  const [, navigate] = useLocation();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { show: showLoginModal } = useLoginModal();
  const [activeTab, setActiveTab] = useState<TabKey>("businesses");
  const [savedItems, setSavedItems] = useState<SavedItemsState>({
    businesses: [],
    products: [],
    services: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!isLoggedIn) {
      setSavedItems({ businesses: [], products: [], services: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSavedItems(true);
      setSavedItems(data);
    } catch (err) {
      if (err instanceof SavedAuthRequiredError) {
        showLoginModal();
      } else {
        setError("بارگذاری ذخیره‌شده‌ها ممکن نشد");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      showLoginModal();
      setSavedItems({ businesses: [], products: [], services: [] });
      setLoading(false);
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per auth/route entry
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    let inflight = false;

    const onChange = () => {
      if (cancelled || inflight) return;
      inflight = true;
      void fetchSavedItems(true)
        .then((data) => {
          if (!cancelled) setSavedItems(data);
        })
        .catch(() => {})
        .finally(() => {
          inflight = false;
        });
    };

    window.addEventListener(SAVED_ITEMS_CHANGED_EVENT, onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(SAVED_ITEMS_CHANGED_EVENT, onChange);
    };
  }, [isLoggedIn]);

  const handleRemove = (tab: TabKey, idOrSlug: string) => {
    setSavedItems((prev) => {
      if (tab === "businesses") {
        return {
          ...prev,
          businesses: prev.businesses.filter(
            (item) => item.id !== idOrSlug && item.slug !== idOrSlug,
          ),
        };
      }
      if (tab === "products") {
        return {
          ...prev,
          products: prev.products.filter(
            (item) => item.id !== idOrSlug && item.slug !== idOrSlug,
          ),
        };
      }
      return {
        ...prev,
        services: prev.services.filter(
          (item) => item.id !== idOrSlug && item.slug !== idOrSlug,
        ),
      };
    });

    void removeSavedItem(tab, idOrSlug).catch((err) => {
      if (err instanceof SavedAuthRequiredError) showLoginModal();
      else void load();
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8FA] pb-24">
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-neutral-100 flex items-center px-4 gap-3">
        <motion.button
          type="button"
          className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0"
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate("/account")}
          aria-label="بازگشت"
        >
          <BackIcon />
        </motion.button>
        <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-base">ذخیره‌شده‌ها</h1>
      </header>

      <div className="fixed top-14 inset-x-0 z-30 bg-white border-b border-neutral-100 px-4">
        <div className="flex gap-0 max-w-2xl mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={[
                "flex-1 h-11 text-sm font-vazirmatn font-medium transition-colors relative",
                activeTab === tab.key ? "text-teal-600" : "text-neutral-400 hover:text-neutral-600",
              ].join(" ")}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="saved-tab-indicator"
                  className="absolute bottom-0 inset-x-4 h-0.5 bg-teal-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-[104px] px-4 pb-4 max-w-2xl mx-auto">
        {!isLoggedIn && !authLoading ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="font-iran-yekan-x font-bold text-neutral-800">برای دیدن ذخیره‌شده‌ها وارد شوید</p>
            <button
              type="button"
              className="h-10 px-5 rounded-xl bg-blue-600 text-white font-vazirmatn text-sm"
              onClick={showLoginModal}
            >
              ورود
            </button>
          </div>
        ) : loading || authLoading ? (
          <div className="space-y-3 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3">
            <p className="font-vazirmatn text-sm text-neutral-500">{error}</p>
            <button
              type="button"
              className="h-9 px-4 rounded-xl bg-neutral-100 text-sm font-vazirmatn"
              onClick={() => void load()}
            >
              تلاش مجدد
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-3 mt-3"
            >
              {activeTab === "businesses" &&
                (savedItems.businesses.length === 0 ? (
                  <EmptyTab label="کسب‌وکار" />
                ) : (
                  savedItems.businesses.map((biz) => (
                    <SavedBusinessCard
                      key={biz.id}
                      biz={biz}
                      onRemove={() => handleRemove("businesses", biz.slug)}
                    />
                  ))
                ))}
              {activeTab === "products" &&
                (savedItems.products.length === 0 ? (
                  <EmptyTab label="محصول" />
                ) : (
                  savedItems.products.map((p) => (
                    <SavedProductCard
                      key={p.id}
                      item={p}
                      onRemove={() => handleRemove("products", p.id)}
                    />
                  ))
                ))}
              {activeTab === "services" &&
                (savedItems.services.length === 0 ? (
                  <EmptyTab label="خدمت" />
                ) : (
                  savedItems.services.map((s) => (
                    <SavedServiceCard
                      key={s.id}
                      item={s}
                      onRemove={() => handleRemove("services", s.id)}
                    />
                  ))
                ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
