import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BusinessCardFeatured } from "@/components/business/BusinessCardFeatured";
import { SectionHeader } from "@/components/ui/section-header";
import { StoreIcon } from "@/components/icons";
import { adaptDbBusiness, type ApiBusinessRaw } from "@/lib/api-business-adapter";
import type { Business } from "@/lib/business.types";

export function DesktopFeaturedBusinesses() {
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
        if (!cancelled) setBusinesses((body.data ?? []).map((b) => adaptDbBusiness(b)));
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
    <section className="py-16 bg-neutral-50" aria-label="کسب‌وکارهای برگزیده">
      <div className="max-w-[1440px] mx-auto px-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeader
            title="کسب‌وکارهای برگزیده شمال ایران"
            subtitle="تأیید شده · محبوب · محلی"
            icon={<StoreIcon size={18} />}
            size="lg"
          />
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {businesses.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <BusinessCardFeatured business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
