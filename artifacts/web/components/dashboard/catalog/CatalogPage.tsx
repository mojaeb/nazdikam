import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@/components/icons";
import { ProductList } from "@/components/dashboard/products/ProductList";
import { ServiceList } from "@/components/dashboard/services/ServiceList";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";

type Tab = "all" | "products" | "services";

const TABS: { id: Tab; label: string }[] = [
  { id: "all",      label: "همه" },
  { id: "products", label: "محصولات" },
  { id: "services", label: "خدمات" },
];

export function CatalogPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [, navigate] = useLocation();
  const { business } = useActiveBusiness();
  const businessId = business ? String(business.id) : undefined;

  return (
    <div className="p-5 max-w-[1200px]">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-2xl">محصولات و خدمات</h1>
          <p className="text-sm font-vazirmatn text-neutral-400 mt-0.5">
            مدیریت تمام محصولات و خدمات کسب‌وکار شما
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            className="h-10 px-4 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-vazirmatn font-medium flex items-center gap-2 hover:bg-neutral-200 transition-colors"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/business/services/new")}
          >
            <PlusIcon size={14} />
            افزودن خدمت
          </motion.button>
          <motion.button
            type="button"
            className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-vazirmatn font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/business/products/new")}
          >
            <PlusIcon size={14} />
            افزودن محصول
          </motion.button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-neutral-100 p-1 rounded-2xl w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "h-9 px-5 rounded-xl text-sm font-vazirmatn font-medium transition-all",
              tab === t.id
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "products" && (
        <ProductList businessId={businessId} />
      )}

      {tab === "services" && (
        <ServiceList />
      )}

      {tab === "all" && (
        <div className="space-y-8">
          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-lg">محصولات</h2>
              <button
                type="button"
                onClick={() => setTab("products")}
                className="text-sm font-vazirmatn text-blue-600 hover:text-blue-700 transition-colors"
              >
                مشاهده همه
              </button>
            </div>
            <ProductList businessId={businessId} />
          </div>

          <div className="border-t border-neutral-100" />

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-lg">خدمات</h2>
              <button
                type="button"
                onClick={() => setTab("services")}
                className="text-sm font-vazirmatn text-blue-600 hover:text-blue-700 transition-colors"
              >
                مشاهده همه
              </button>
            </div>
            <ServiceList />
          </div>
        </div>
      )}
    </div>
  );
}
