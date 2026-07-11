import { useCallback, useEffect, useState } from "react";

export type PendingVerification = {
  id: number;
  business_id: number;
  business_name: string;
  business_slug: string;
  type: "individual" | "legal";
  status: string;
  payload: Record<string, string | undefined>;
  submitted_at: string;
};

function DocImage({ url, label }: { url?: string; label: string }) {
  if (!url) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-vazirmatn text-neutral-500">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-neutral-200">
        <img src={url} alt={label} className="w-full max-h-48 object-cover bg-neutral-100" />
      </a>
    </div>
  );
}

export function AdminVerificationSection({
  onReviewed,
}: {
  onReviewed?: () => void;
}) {
  const [items, setItems] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingVerification | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/verification/pending", { credentials: "include" });
      const body = (await res.json()) as { data?: PendingVerification[]; error?: { message?: string } };
      if (!res.ok) throw new Error(body.error?.message ?? "بارگذاری ناموفق بود");
      setItems(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const review = async (businessId: number, decision: "approve" | "reject", reason?: string) => {
    setBusyId(businessId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/verification/${businessId}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reason: reason || undefined }),
      });
      const body = (await res.json()) as { error?: { message?: string } };
      if (!res.ok) throw new Error(body.error?.message ?? "عملیات ناموفق بود");
      setRejectTarget(null);
      setRejectReason("");
      await load();
      onReviewed?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بررسی");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="h-40 rounded-2xl bg-neutral-100 animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-vazirmatn">{error}</p>
      )}

      {items.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center">
          <p className="font-iran-yekan-x font-bold text-neutral-800">درخواست در انتظاری نیست</p>
          <p className="font-vazirmatn text-sm text-neutral-500 mt-1">درخواست‌های احراز هویت اینجا نمایش داده می‌شوند.</p>
        </div>
      ) : (
        items.map((item) => {
          const p = item.payload;
          const isIndividual = item.type === "individual";

          return (
            <section key={item.id} className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-iran-yekan-x font-bold text-neutral-900">{item.business_name}</p>
                  <p className="font-vazirmatn text-xs text-neutral-500 mt-1" dir="ltr">
                    #{item.business_id} · {item.business_slug}
                  </p>
                  <p className="font-vazirmatn text-xs text-amber-700 mt-1">
                    {isIndividual ? "حقیقی" : "حقوقی"} · {new Date(item.submitted_at).toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === item.business_id}
                    onClick={() => void review(item.business_id, "approve")}
                    className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-xs font-vazirmatn font-bold disabled:opacity-50"
                  >
                    تأیید
                  </button>
                  <button
                    type="button"
                    disabled={busyId === item.business_id}
                    onClick={() => setRejectTarget(item)}
                    className="h-9 px-4 rounded-xl bg-red-50 text-red-700 text-xs font-vazirmatn font-bold disabled:opacity-50"
                  >
                    رد
                  </button>
                </div>
              </div>

              {isIndividual ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-vazirmatn">
                  <p>نام: {p.first_name} {p.last_name}</p>
                  <p>نام پدر: {p.father_name}</p>
                  <p dir="ltr">کد ملی: {p.national_id}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-vazirmatn">
                  <p>صاحب: {p.owner_first_name} {p.owner_last_name}</p>
                  <p>نام پدر: {p.owner_father_name}</p>
                  <p dir="ltr">کد ملی: {p.owner_national_id}</p>
                  <p dir="ltr">کد اصناف: {p.guild_code}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {isIndividual ? (
                  <>
                    <DocImage url={p.portrait_url} label="عکس پرسنلی" />
                    <DocImage url={p.id_card_front_url} label="روی کارت ملی" />
                    <DocImage url={p.id_card_back_url} label="پشت کارت ملی" />
                  </>
                ) : (
                  <>
                    <DocImage url={p.owner_portrait_url} label="عکس صاحب" />
                    <DocImage url={p.owner_id_card_front_url} label="روی کارت ملی" />
                    <DocImage url={p.business_license_url} label="مجوز کسب‌وکار" />
                  </>
                )}
              </div>
            </section>
          );
        })
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-3" dir="rtl">
            <p className="font-iran-yekan-x font-bold text-neutral-900">رد درخواست احراز هویت</p>
            <p className="font-vazirmatn text-sm text-neutral-500">{rejectTarget.business_name}</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="دلیل رد (اختیاری)"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-vazirmatn text-sm resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-vazirmatn font-bold"
                onClick={() => void review(rejectTarget.business_id, "reject", rejectReason.trim())}
              >
                تأیید رد
              </button>
              <button
                type="button"
                className="flex-1 h-10 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-vazirmatn"
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
