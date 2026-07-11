import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { SectionHeader } from "@/components/ui/section-header";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { toPersianNumerals } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  NAZDIKAM_ABOUT,
  NAZDIKAM_CONTACT_CHANNELS,
  SELLER_FAQS,
  SELLER_TUTORIAL_VIDEOS,
  type ContactChannel,
  type SupportFaq,
  type TutorialVideo,
} from "@/lib/business-support-content";
import {
  businessSupportTicketsQueryKey,
  createSupportTicket,
  fetchSupportTickets,
  ticketStatusColor,
  type SupportTicketDto,
} from "@/lib/support-api";
import {
  businessEntitlementsQueryKey,
  fetchEntitlements,
} from "@/lib/subscription-api";

function ContactIcon({ type }: { type: ContactChannel["icon"] }) {
  const s = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "mail":
      return <svg {...s}><path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" /></svg>;
    case "telegram":
      return <svg {...s}><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>;
    case "clock":
      return <svg {...s}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
    default:
      return <svg {...s}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>;
  }
}

function TutorialCard({ item }: { item: TutorialVideo }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.button
      type="button"
      className="snap-start shrink-0 w-56 text-start rounded-2xl overflow-hidden border border-neutral-100 bg-white"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      onClick={() => setOpen((v) => !v)}
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-28 relative flex items-center justify-center" style={{ background: item.gradient }}>
        <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
        <span className="absolute bottom-2 start-2 text-[10px] font-vazirmatn text-white/90 bg-black/30 px-2 py-0.5 rounded-md">
          {item.duration}
        </span>
      </div>
      <div className="p-3">
        <p className="font-iran-yekan-x font-bold text-sm text-neutral-900 line-clamp-1">{item.title}</p>
        <p className="font-vazirmatn text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
          {open ? item.description : `${item.description.slice(0, 48)}…`}
        </p>
      </div>
    </motion.button>
  );
}

function FaqItem({ faq }: { faq: SupportFaq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start"
      >
        <p className="font-iran-yekan-x font-bold text-sm text-neutral-800">{faq.question}</p>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="text-neutral-400 shrink-0 text-lg">‹</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 font-vazirmatn text-xs text-neutral-600 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: SupportTicketDto }) {
  return (
    <div className="bg-neutral-50 rounded-xl p-3 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="font-iran-yekan-x font-bold text-sm text-neutral-800">{ticket.subject}</p>
        <span className={`shrink-0 text-[10px] font-vazirmatn px-2 py-0.5 rounded-full ${ticketStatusColor(ticket.status)}`}>
          {ticket.status_label}
        </span>
      </div>
      <p className="font-vazirmatn text-xs text-neutral-500 line-clamp-2">{ticket.message}</p>
    </div>
  );
}

export function BusinessSupportPage() {
  const [, navigate] = useLocation();
  const { business } = useActiveBusiness();
  const queryClient = useQueryClient();
  const businessId = business?.id ?? 0;

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const { data: entitlements } = useQuery({
    queryKey: businessEntitlementsQueryKey(businessId),
    queryFn: () => fetchEntitlements(businessId),
    enabled: businessId > 0,
    staleTime: 60_000,
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: businessSupportTicketsQueryKey(businessId),
    queryFn: () => fetchSupportTickets(businessId),
    enabled: businessId > 0,
    staleTime: 0,
  });

  const hasPrioritySupport = entitlements?.feature_flags?.can_support_tickets === true;

  const handleSubmitTicket = async () => {
    if (!businessId || !subject.trim() || !message.trim()) return;
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(false);
    try {
      await createSupportTicket(businessId, {
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubject("");
      setMessage("");
      setFormSuccess(true);
      await queryClient.invalidateQueries({ queryKey: businessSupportTicketsQueryKey(businessId) });
    } catch (err) {
      setFormError(getApiErrorMessage(err, "ثبت تیکت ناموفق بود"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-4 pb-28 max-w-2xl mx-auto space-y-8" dir="rtl">
      <DashboardPageHeader
        title="آموزش و پشتیبانی"
        subtitle="راهنما، سوالات متداول و ارتباط با پشتیبانی"
        backPath="/business"
      />

      {/* ۱ — Tutorial videos */}
      <section id="tutorials" className="space-y-3">
        <SectionHeader title="ویدیوهای آموزشی" subtitle="آموزش استفاده از داشبورد کسب‌وکار" size="md" />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 snap-x">
          {SELLER_TUTORIAL_VIDEOS.map((item) => (
            <TutorialCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ۲ — FAQ */}
      <section id="faq" className="space-y-3">
        <SectionHeader title="سوالات متداول" subtitle="پاسخ پرسش‌های رایج فروشندگان" size="md" />
        <div className="space-y-2">
          {SELLER_FAQS.map((faq) => (
            <FaqItem key={faq.question} faq={faq} />
          ))}
        </div>
      </section>

      {/* ۳ — Contact */}
      <section id="contact" className="space-y-3">
        <SectionHeader title="راه‌های ارتباطی" subtitle="تماس با تیم نزدیکام" size="md" />
        <div className="space-y-2">
          {NAZDIKAM_CONTACT_CHANNELS.map((channel) => {
            const inner = (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ContactIcon type={channel.icon} />
                </div>
                <div className="min-w-0">
                  <p className="font-vazirmatn text-xs text-neutral-500">{channel.label}</p>
                  <p className="font-iran-yekan-x font-bold text-sm text-neutral-800 mt-0.5 truncate">{channel.value}</p>
                </div>
              </div>
            );

            if (channel.href) {
              return (
                <a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-2xl border border-neutral-100 p-4"
                  style={{ boxShadow: "var(--shadow-elevation-1)" }}
                >
                  {inner}
                </a>
              );
            }

            return (
              <div
                key={channel.id}
                className="bg-white rounded-2xl border border-neutral-100 p-4"
                style={{ boxShadow: "var(--shadow-elevation-1)" }}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ۴ — Support tickets */}
      <section id="tickets" className="space-y-3">
        <SectionHeader title="ارسال تیکت پشتیبانی" subtitle="پیگیری درخواست‌های پشتیبانی" size="md" />
        {hasPrioritySupport && (
          <p className="text-xs font-vazirmatn text-violet-700 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2">
            پلان حرفه‌ای شما — اولویت بالاتر در صف پشتیبانی
          </p>
        )}

        {formSuccess && (
          <p className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-vazirmatn text-sm">
            تیکت شما ثبت شد. به‌زودی پاسخ می‌دهیم.
          </p>
        )}
        {formError && (
          <p className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-vazirmatn text-sm">
            {formError}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="موضوع تیکت"
            disabled={submitting || businessId <= 0}
            className="w-full h-11 px-4 rounded-xl border border-neutral-200 font-vazirmatn text-sm outline-none focus:border-blue-400 disabled:opacity-50"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="توضیح مشکل یا درخواست خود را بنویسید..."
            disabled={submitting || businessId <= 0}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 font-vazirmatn text-sm outline-none resize-none focus:border-blue-400 disabled:opacity-50"
          />
          <motion.button
            type="button"
            className="w-full h-11 rounded-xl bg-blue-600 text-white font-vazirmatn text-sm font-bold disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
            disabled={submitting || businessId <= 0 || !subject.trim() || message.trim().length < 10}
            onClick={() => void handleSubmitTicket()}
          >
            {submitting ? "در حال ارسال..." : "ارسال تیکت"}
          </motion.button>
        </div>

        {ticketsLoading ? (
          <div className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
        ) : tickets.length > 0 ? (
          <div className="space-y-2">
            <p className="font-vazirmatn text-xs text-neutral-500">تیکت‌های قبلی ({toPersianNumerals(String(tickets.length))})</p>
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : null}
      </section>

      {/* ۵ — About */}
      <section id="about" className="space-y-3">
        <SectionHeader title="درباره نزدیکام" subtitle="آشنایی با پلتفرم" size="md" />
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
          <div className="h-24 bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center">
            <p className="text-2xl font-iran-yekan-x font-bold text-white">نزدیکام</p>
          </div>
          <div className="p-4 space-y-4">
            <p className="font-vazirmatn text-sm text-neutral-600 leading-relaxed">{NAZDIKAM_ABOUT.summary}</p>
            <div className="grid grid-cols-3 gap-2">
              {NAZDIKAM_ABOUT.stats.map((stat) => (
                <div key={stat.label} className="text-center bg-neutral-50 rounded-xl py-3">
                  <p className="font-iran-yekan-x font-bold text-blue-600">{stat.value}</p>
                  <p className="font-vazirmatn text-[10px] text-neutral-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {NAZDIKAM_ABOUT.highlights.map((item) => (
                <div key={item.title} className="flex gap-3 bg-neutral-50 rounded-xl p-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-iran-yekan-x font-bold text-sm text-neutral-800">{item.title}</p>
                    <p className="font-vazirmatn text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="w-full h-10 rounded-xl border border-blue-200 text-blue-700 font-vazirmatn text-sm font-medium"
            >
              صفحه کامل درباره نزدیکام
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
