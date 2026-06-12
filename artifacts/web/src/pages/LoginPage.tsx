import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";

/* ─── Step 1: Enter phone ─────────────────────────────── */
function PhoneStep({
  onNext,
}: {
  onNext: (phone: string, otp: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone }),
      });
      const data = await res.json() as {
        success?: boolean;
        _dev_otp?: string;
        error?: { message: string };
      };

      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "خطا در ارسال کد");
        return;
      }

      onNext(phone, data._dev_otp ?? "");
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="phone"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
        </div>
        <h1 className="font-iran-yekan-x font-bold text-2xl text-neutral-900">ورود به نزدیکام</h1>
        <p className="font-vazirmatn text-sm text-neutral-500 mt-2">شماره موبایل خود را وارد کنید</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-vazirmatn text-neutral-600">شماره موبایل</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="09121234567"
            dir="ltr"
            required
            className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-center"
          />
        </div>

        {error && (
          <p className="text-xs font-vazirmatn text-red-500 text-center">{error}</p>
        )}

        <motion.button
          type="submit"
          disabled={loading || phone.length < 10}
          className="w-full h-12 rounded-xl bg-blue-500 text-white font-iran-yekan-x font-bold text-sm disabled:opacity-50 transition-all hover:bg-blue-600"
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
        </motion.button>
      </form>
    </motion.div>
  );
}

/* ─── Step 2: Enter OTP ───────────────────────────────── */
function OtpStep({
  phone,
  devOtp,
  onSuccess,
  onBack,
}: {
  phone: string;
  devOtp: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json() as {
        success?: boolean;
        error?: { message: string };
      };

      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "کد اشتباه است");
        return;
      }

      await refresh();
      onSuccess();
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h1 className="font-iran-yekan-x font-bold text-2xl text-neutral-900">کد تأیید</h1>
        <p className="font-vazirmatn text-sm text-neutral-500 mt-2">
          کد ارسال‌شده به <span dir="ltr" className="font-bold text-neutral-700">{phone}</span> را وارد کنید
        </p>
        {devOtp && (
          <div className="mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-vazirmatn text-amber-700">
              کد توسعه: <span dir="ltr" className="font-bold tracking-widest">{devOtp}</span>
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-vazirmatn text-neutral-600">کد {toPersianNumerals(6)} رقمی</label>
          <input
            type="tel"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="------"
            dir="ltr"
            maxLength={6}
            required
            className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-lg font-bold tracking-[0.4em] font-vazirmatn text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-center"
          />
        </div>

        {error && (
          <p className="text-xs font-vazirmatn text-red-500 text-center">{error}</p>
        )}

        <motion.button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full h-12 rounded-xl bg-emerald-500 text-white font-iran-yekan-x font-bold text-sm disabled:opacity-50 transition-all hover:bg-emerald-600"
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "در حال بررسی..." : "تأیید و ورود"}
        </motion.button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-xs font-vazirmatn text-neutral-400 hover:text-neutral-600 transition-colors py-2"
        >
          ویرایش شماره
        </button>
      </form>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────── */
export default function LoginPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handlePhoneNext = (p: string, otp: string) => {
    setPhone(p);
    setDevOtp(otp);
    setStep("otp");
  };

  const handleSuccess = () => {
    const redirectTo = new URLSearchParams(window.location.search).get("redirect") ?? "/account";
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center px-5" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="card p-7">
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <PhoneStep key="phone" onNext={handlePhoneNext} />
            ) : (
              <OtpStep
                key="otp"
                phone={phone}
                devOtp={devOtp}
                onSuccess={handleSuccess}
                onBack={() => setStep("phone")}
              />
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full text-center text-xs font-vazirmatn text-neutral-400 hover:text-neutral-600 transition-colors py-4"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}
