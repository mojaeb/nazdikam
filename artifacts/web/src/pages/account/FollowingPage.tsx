import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { mockBusinesses } from "@/lib/mock-businesses";
import { avatarGradientIndex } from "@/lib/utils";
import { toPersianNumerals } from "@/lib/utils";
import { MapPinIcon } from "@/components/icons";
import { getFollowedBusinesses, setBusinessFollowed } from "@/lib/followed-businesses";

interface FollowedBusinessItem {
  id: string;
  slug: string;
  name: string;
  city: string;
  followersCount: number;
}

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

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BusinessFollowCard({
  biz,
  onUnfollow,
}: {
  biz: FollowedBusinessItem;
  onUnfollow: () => void;
}) {
  const [, navigate] = useLocation();
  const idx = avatarGradientIndex(biz.name);
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
    >
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-xl shrink-0 cursor-pointer"
        style={{ background: AVATAR_GRADIENTS[idx % 10] }}
        onClick={() => navigate(`/businesses/${biz.slug}`)}
        whileTap={{ scale: 0.96 }}
      >
        {biz.name.slice(0, 1)}
      </motion.div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/businesses/${biz.slug}`)}>
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[14px] truncate">{biz.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPinIcon size={11} className="text-neutral-400" />
          <span className="font-vazirmatn text-xs text-neutral-400">{biz.city}</span>
        </div>
        <p className="font-vazirmatn text-xs text-neutral-500 mt-0.5">
          {toPersianNumerals(biz.followersCount)} دنبال‌کننده
        </p>
      </div>

      <motion.button
        type="button"
        className="shrink-0 h-8 px-3 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 text-xs font-vazirmatn font-medium"
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setBusinessFollowed(biz.slug, false);
          onUnfollow();
        }}
      >
        دنبال شده
      </motion.button>
    </motion.div>
  );
}

function EmptyFollowing() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center px-6">
      <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div>
        <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg">هنوز کسی را دنبال نکرده‌اید</p>
        <p className="font-vazirmatn text-sm text-neutral-500 mt-1 leading-relaxed">
          کسب‌وکارهایی را که دوست دارید دنبال کنید تا اخبار آن‌ها را ببینید.
        </p>
      </div>
    </div>
  );
}

export default function FollowingPage() {
  const [, navigate] = useLocation();
  const [followed, setFollowed] = useState<FollowedBusinessItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const followedSlugs = getFollowedBusinesses();

    async function loadFollowed() {
      if (followedSlugs.length === 0) {
        if (!cancelled) {
          setFollowed([]);
          setLoading(false);
        }
        return;
      }

      const fromMock = new Map(
        mockBusinesses.map((b) => [
          b.slug,
          {
            id: b.id,
            slug: b.slug,
            name: b.name,
            city: b.city,
            followersCount: b.followersCount,
          } satisfies FollowedBusinessItem,
        ]),
      );

      const rows = await Promise.all(
        followedSlugs.map(async (slug) => {
          const mock = fromMock.get(slug);
          if (mock) return mock;
          try {
            const res = await fetch(`/api/businesses/${encodeURIComponent(slug)}`, {
              credentials: "include",
            });
            if (!res.ok) return null;
            const json = (await res.json()) as {
              data?: { id: number; slug: string; name: string; city: string; followerCount?: number };
            };
            if (!json.data) return null;
            return {
              id: String(json.data.id),
              slug: json.data.slug,
              name: json.data.name,
              city: json.data.city,
              followersCount: json.data.followerCount ?? 0,
            } satisfies FollowedBusinessItem;
          } catch {
            return null;
          }
        }),
      );

      if (!cancelled) {
        setFollowed(rows.filter((r): r is FollowedBusinessItem => r !== null));
        setLoading(false);
      }
    }

    void loadFollowed();
    return () => {
      cancelled = true;
    };
  }, []);

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
        <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-base">دنبال‌شده‌ها</h1>
        {followed.length > 0 && (
          <span className="ms-auto font-vazirmatn text-xs text-neutral-400">
            {toPersianNumerals(followed.length.toString())} کسب‌وکار
          </span>
        )}
      </header>

      <div className="pt-16 px-4 pb-4 max-w-2xl mx-auto space-y-3">
        {loading ? null : followed.length === 0
          ? <EmptyFollowing />
          : followed.map((biz, i) => (
            <motion.div
              key={biz.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <BusinessFollowCard
                biz={biz}
                onUnfollow={() => {
                  setTimeout(() => setFollowed(prev => prev.filter(b => b.id !== biz.id)), 600);
                }}
              />
            </motion.div>
          ))
        }
      </div>

      <BottomNav />
    </div>
  );
}
