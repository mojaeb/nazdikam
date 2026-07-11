import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { StoreIcon } from "@/components/icons";
import { BusinessCardStandard } from "@/components/business/BusinessCardStandard";
import { adaptDbBusiness, type ApiBusinessRaw } from "@/lib/api-business-adapter";
import type { Business } from "@/lib/business.types";

/** کسب‌وکارهای ویژه — فقط موارد انتخاب‌شده توسط ادمین */
export function FeaturedBusinesses() {
  const [, navigate] = useLocation();
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    let cancelled = false;
    const url = new URL("/api/businesses", window.location.origin);
    url.searchParams.set("featured", "true");
    url.searchParams.set("sort", "featured");
    url.searchParams.set("per_page", "50");

    fetch(url.toString())
      .then((r) => (r.ok ? (r.json() as Promise<{ data?: ApiBusinessRaw[] }>) : Promise.reject(r.status)))
      .then((body) => {
        if (cancelled) return;
        setBusinesses((body.data ?? []).map((b) => adaptDbBusiness(b)));
      })
      .catch(() => {
        if (!cancelled) setBusinesses([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (businesses.length === 0) return null;

  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-3">
        <SectionHeader
          title="کسب‌وکارهای ویژه"
          subtitle="برترین کسب‌وکارهای شمال ایران"
          icon={<StoreIcon size={16} />}
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0">
        {businesses.map((business, i) => (
          <motion.div
            key={business.id}
            className="snap-start shrink-0 lg:shrink"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <BusinessCardStandard
              business={business}
              onPress={() => navigate(`/businesses/${business.slug}`)}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
