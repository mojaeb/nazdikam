import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { StarFilledIcon, StarIcon, CheckIcon, EditIcon } from "@/components/icons";
import { mockReviews, reviewSummary, type Review } from "@/lib/dashboard-reviews-data";

/* ─── Star rating ─────────────────────────────────────── */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => n <= rating
        ? <StarFilledIcon key={n} size={size} className="text-amber-400" />
        : <StarIcon       key={n} size={size} className="text-neutral-200" />
      )}
    </div>
  );
}

/* ─── Summary strip ───────────────────────────────────── */
function ReviewSummaryBar({ reviews }: { reviews: Review[] }) {
  const s = reviewSummary(reviews);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      {[
        { label: "کل نظرات",       value: toPersianNumerals(s.total),       sub: "" },
        { label: "میانگین امتیاز", value: `${toPersianNumerals(s.avg)} ★`, sub: "از ۵" },
        { label: "نرخ پاسخ",       value: `%${toPersianNumerals(s.responseRate)}`, sub: `${toPersianNumerals(s.replied)} پاسخ داده شده` },
        { label: "این ماه",        value: toPersianNumerals(reviews.filter(r => r.timeAgo.includes("روز") || r.timeAgo.includes("دیروز")).length), sub: "نظر جدید" },
      ].map(c => (
        <div key={c.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 text-end">
          <p className="font-vazirmatn text-xs text-neutral-400 mb-1">{c.label}</p>
          <p className="font-iran-yekan-x font-bold text-2xl text-neutral-900">{c.value}</p>
          {c.sub && <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{c.sub}</p>}
        </div>
      ))}
    </div>
  );
}

/* ─── Star distribution bar ───────────────────────────── */
function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const s = reviewSummary(reviews);
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 mb-5">
      <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4">توزیع امتیازها</h3>
      <div className="space-y-2">
        {s.dist.map(d => (
          <div key={d.star} className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 w-20 justify-end shrink-0">
              {d.star} <StarFilledIcon size={12} className="text-amber-400 ms-0.5" />
            </div>
            <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${d.pct}%` }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </div>
            <span className="font-vazirmatn text-xs text-neutral-500 w-8 text-start shrink-0">{toPersianNumerals(d.count)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Review card ─────────────────────────────────────── */
function ReviewCard({ review, onReply }: { review: Review; onReply: (id: string, text: string) => void }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText]  = useState(review.reply ?? "");
  const [saved, setSaved]          = useState(false);

  const handleSave = () => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText);
    setSaved(true);
    setReplyOpen(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const ratingColor = review.rating >= 4 ? "text-green-700" : review.rating === 3 ? "text-amber-700" : "text-red-700";
  const ratingBg    = review.rating >= 4 ? "bg-green-50"   : review.rating === 3 ? "bg-amber-50"   : "bg-red-50";

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-iran-yekan-x font-bold text-sm shrink-0"
            style={{ backgroundColor: review.avatarColor }}>
            {review.authorName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-vazirmatn text-sm font-medium text-neutral-800">{review.authorName}</p>
              {review.isVerified && <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">تأیید شده</span>}
            </div>
            <Stars rating={review.rating} size={12} />
          </div>
        </div>
        <div className="text-end shrink-0">
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-lg", ratingBg, ratingColor)}>
            {toPersianNumerals(review.rating)}/۵
          </span>
          <p className="font-vazirmatn text-xs text-neutral-400 mt-1">{review.timeAgo}</p>
        </div>
      </div>

      {/* Product/service tag */}
      {(review.productName || review.serviceName) && (
        <p className="font-vazirmatn text-xs text-blue-600 bg-blue-50 inline-block px-2.5 py-1 rounded-lg mb-3">
          {review.productName ?? review.serviceName}
        </p>
      )}

      {/* Review text */}
      <p className="font-vazirmatn text-sm text-neutral-700 leading-relaxed mb-3">{review.text}</p>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {review.tags.map(t => (
            <span key={t} className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">{t}</span>
          ))}
        </div>
      )}

      {/* Reply */}
      {review.reply && !replyOpen && (
        <div className="bg-blue-50 border-s-4 border-blue-400 rounded-e-xl ps-3 pe-4 py-3 mb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-vazirmatn text-xs font-bold text-blue-700">پاسخ شما</p>
            <button type="button" onClick={() => setReplyOpen(true)}
              className="text-blue-600 hover:text-blue-800 transition-colors">
              <EditIcon size={13} />
            </button>
          </div>
          <p className="font-vazirmatn text-sm text-blue-800 leading-relaxed">{review.reply}</p>
          {review.repliedAt && <p className="font-vazirmatn text-xs text-blue-400 mt-1">{review.repliedAt}</p>}
        </div>
      )}

      {/* Reply actions */}
      <div className="flex items-center gap-2">
        {!review.reply && !replyOpen && (
          <button type="button" onClick={() => setReplyOpen(true)}
            className="h-8 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl font-vazirmatn text-xs font-medium text-blue-700 transition-colors">
            پاسخ دادن
          </button>
        )}
        {saved && (
          <motion.span
            className="flex items-center gap-1 text-xs font-bold text-green-600"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <CheckIcon size={12} className="text-green-600" /> ذخیره شد
          </motion.span>
        )}
      </div>

      {/* Reply form */}
      <AnimatePresence>
        {replyOpen && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
              placeholder="پاسخ خود را بنویسید..."
              className="w-full font-vazirmatn text-sm bg-white text-neutral-800 border border-blue-200 rounded-xl px-3 py-2.5 resize-none outline-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
            />
            <div className="flex gap-2 mt-2">
              <motion.button type="button" whileTap={{ scale: 0.97 }}
                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-vazirmatn text-xs font-bold transition-colors"
                onClick={handleSave}>
                ارسال پاسخ
              </motion.button>
              <button type="button" onClick={() => { setReplyOpen(false); setReplyText(review.reply ?? ""); }}
                className="h-8 px-3 border border-neutral-200 rounded-xl font-vazirmatn text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">
                لغو
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main page ───────────────────────────────────────── */
export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [starFilter, setStarFilter]       = useState<number | "all">("all");
  const [replyFilter, setReplyFilter]     = useState<"all" | "replied" | "pending">("all");

  const filtered = useMemo(() => reviews.filter(r => {
    if (starFilter   !== "all" && r.rating !== starFilter)    return false;
    if (replyFilter  === "replied" && !r.reply)               return false;
    if (replyFilter  === "pending" &&  r.reply)               return false;
    return true;
  }), [reviews, starFilter, replyFilter]);

  const handleReply = (id: string, text: string) => {
    setReviews(rs => rs.map(r => r.id === id ? { ...r, reply: text, repliedAt: "همین الان" } : r));
  };

  return (
    <div className="p-5 lg:p-8 max-w-[900px]">
      <DashboardPageHeader title="نظرات" subtitle="مدیریت و پاسخ به نظرات مشتریان" backPath="/business" />

      <ReviewSummaryBar reviews={reviews} />

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-64 shrink-0">
          <RatingDistribution reviews={reviews} />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-1">
            {([
              { key: "all",     label: `همه (${toPersianNumerals(reviews.length)})` },
              { key: "replied", label: `پاسخ داده (${toPersianNumerals(reviews.filter(r => r.reply).length)})` },
              { key: "pending", label: `بدون پاسخ (${toPersianNumerals(reviews.filter(r => !r.reply).length)})` },
            ] as const).map(f => (
              <button key={f.key} type="button"
                className={cn("h-8 px-3 rounded-xl font-vazirmatn text-xs font-medium transition-all",
                  replyFilter === f.key ? "bg-blue-600 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:border-blue-300")}
                onClick={() => setReplyFilter(f.key)}>
                {f.label}
              </button>
            ))}
            <div className="w-px h-8 bg-neutral-200 self-center hidden sm:block" />
            {([5, 4, 3, 2, 1] as const).map(n => (
              <button key={n} type="button"
                className={cn("h-8 px-3 rounded-xl font-vazirmatn text-xs font-medium flex items-center gap-1 transition-all",
                  starFilter === n ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-white border border-neutral-200 text-neutral-600 hover:border-amber-300")}
                onClick={() => setStarFilter(prev => prev === n ? "all" : n)}>
                {toPersianNumerals(n)} <StarFilledIcon size={11} className="text-amber-400" />
              </button>
            ))}
          </div>

          {/* Review list */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-neutral-100">
              <StarIcon size={36} className="text-neutral-200" />
              <p className="font-vazirmatn text-neutral-400 text-sm">نظری با این فیلتر یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(r => (
                <ReviewCard key={r.id} review={r} onReply={handleReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
