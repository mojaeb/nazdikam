import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { useAuth } from "@/src/contexts/AuthContext";
import { avatarGradientIndex } from "@/lib/utils";

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

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function Toast({ visible, message }: { visible: boolean; message: string }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-20 inset-x-0 z-50 flex justify-center px-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <div className="bg-neutral-900 text-white font-vazirmatn text-sm px-5 py-3 rounded-2xl shadow-xl">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DeleteAccountModal({
  open,
  deleting,
  onClose,
  onConfirm,
}: {
  open: boolean;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={deleting ? undefined : onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 bg-white rounded-2xl p-5 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base mb-2">حذف حساب کاربری</h2>
            <p className="font-vazirmatn text-sm text-neutral-500 leading-relaxed mb-5">
              با حذف حساب، تمامی اطلاعات شخصی شما از نزدیکام پاک می‌شود. این عمل قابل بازگشت نیست.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 h-11 rounded-xl bg-neutral-100 text-neutral-700 font-vazirmatn text-sm font-medium"
                disabled={deleting}
                onClick={onClose}
              >
                انصراف
              </button>
              <button
                type="button"
                className="flex-1 h-11 rounded-xl bg-red-600 text-white font-vazirmatn text-sm font-bold disabled:opacity-60"
                disabled={deleting}
                onClick={onConfirm}
              >
                {deleting ? "در حال حذف..." : "حذف حساب"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function EditProfilePage() {
  const [, navigate] = useLocation();
  const { user, refresh, logout } = useAuth();

  const displayName = user?.name ?? user?.phone ?? "کاربر";
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;

  const [name, setName] = useState("");
  const [phone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const initial = user?.name?.trim() || "";
    setName(initial);
    setDirty(false);
  }, [user?.id, user?.name]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setSaveError("نام الزامی است");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
        throw new Error(body.error?.message ?? "ذخیره پروفایل ناموفق بود");
      }
      await refresh();
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "ذخیره پروفایل ناموفق بود");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/auth/me", { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
        throw new Error(body.error?.message ?? "حذف حساب انجام نشد.");
      }
      await logout();
      navigate("/");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "حذف حساب انجام نشد.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8FA] pb-24">
      <Toast visible={saved} message="پروفایل با موفقیت ذخیره شد ✓" />
      <DeleteAccountModal
        open={deleteOpen}
        deleting={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
      />

      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-neutral-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0"
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate("/account")}
            aria-label="بازگشت"
          >
            <BackIcon />
          </motion.button>
          <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-base">ویرایش پروفایل</h1>
        </div>
        <motion.button
          type="button"
          className={[
            "h-9 px-5 rounded-xl font-vazirmatn font-bold text-sm transition-colors",
            dirty
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-neutral-100 text-neutral-400 cursor-default",
          ].join(" ")}
          whileTap={dirty ? { scale: 0.97 } : {}}
          onClick={dirty ? () => void handleSave() : undefined}
          disabled={saving || !dirty}
          aria-disabled={!dirty}
        >
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </motion.button>
      </header>

      <div className="pt-16 px-4 pb-6 max-w-md mx-auto space-y-5">
        <div className="flex justify-center pt-4 pb-2">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-4xl"
              style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
            >
              {(name.trim() || displayName).slice(0, 1)}
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -end-2 w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-md"
              aria-label="تغییر تصویر پروفایل"
              title="تغییر تصویر (به زودی)"
            >
              <CameraIcon />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block font-vazirmatn text-xs font-medium text-neutral-500 px-1">نام و نام خانوادگی</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDirty(true);
                setSaveError(null);
              }}
              placeholder="نام خود را وارد کنید"
              className="w-full h-12 bg-white rounded-2xl border border-neutral-200 px-4 font-vazirmatn text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 transition-all"
              style={{ boxShadow: "var(--shadow-elevation-1)" }}
            />
          </div>

          {phone && (
            <div className="space-y-1.5">
              <label className="block font-vazirmatn text-xs font-medium text-neutral-500 px-1">شماره موبایل</label>
              <div
                className="w-full h-12 bg-neutral-50 rounded-2xl border border-neutral-100 px-4 flex items-center gap-2"
                style={{ boxShadow: "var(--shadow-elevation-1)" }}
              >
                <span className="font-vazirmatn text-sm text-neutral-400 flex-1" dir="ltr">{phone}</span>
                <span className="text-[10px] font-vazirmatn bg-neutral-200 text-neutral-500 px-2 py-0.5 rounded-lg">تأیید شده</span>
              </div>
              <p className="font-vazirmatn text-xs text-neutral-400 px-1">شماره موبایل قابل ویرایش نیست.</p>
            </div>
          )}
        </div>

        {saveError && (
          <p className="font-vazirmatn text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {saveError}
          </p>
        )}

        <motion.button
          type="button"
          className={[
            "w-full h-12 rounded-2xl font-vazirmatn font-bold text-sm transition-colors",
            dirty ? "bg-teal-600 text-white shadow-sm" : "bg-neutral-100 text-neutral-400",
          ].join(" ")}
          whileTap={dirty ? { scale: 0.97 } : {}}
          onClick={dirty ? () => void handleSave() : undefined}
          disabled={saving || !dirty}
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </motion.button>

        <div
          className="bg-white rounded-2xl p-4 border border-red-100 space-y-3"
          style={{ boxShadow: "var(--shadow-elevation-1)" }}
        >
          <div>
            <h2 className="font-iran-yekan-x font-bold text-red-700 text-sm">حذف حساب کاربری</h2>
            <p className="font-vazirmatn text-xs text-neutral-500 mt-1 leading-relaxed">
              با حذف حساب، دسترسی شما به ذخیره‌شده‌ها، دنبال‌شده‌ها و کسب‌وکارهای مرتبط از بین می‌رود.
            </p>
          </div>
          {deleteError && (
            <p className="font-vazirmatn text-xs text-red-600">{deleteError}</p>
          )}
          <motion.button
            type="button"
            className="w-full h-11 rounded-xl bg-red-50 border border-red-200 text-red-600 font-vazirmatn text-sm font-medium"
            whileTap={{ scale: 0.98 }}
            onClick={() => setDeleteOpen(true)}
          >
            حذف حساب
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
