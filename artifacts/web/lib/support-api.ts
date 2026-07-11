import { markAppApiError, type ApiErrorBody } from "@/lib/api-error";

export type SupportTicketDto = {
  id: number;
  business_id: number | null;
  subject: string;
  message: string;
  status: string;
  status_label: string;
  created_at: string;
  updated_at: string;
};

export function businessSupportTicketsQueryKey(businessId: number) {
  return [`/api/businesses/${businessId}/support-tickets`] as const;
}

export async function fetchSupportTickets(businessId: number): Promise<SupportTicketDto[]> {
  const res = await fetch(`/api/businesses/${businessId}/support-tickets`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(body.error?.message ?? "خطا در بارگذاری تیکت‌ها"),
      body,
      res.status,
    );
  }
  const body = (await res.json()) as { data?: SupportTicketDto[] };
  return body.data ?? [];
}

export async function createSupportTicket(
  businessId: number,
  input: { subject: string; message: string },
): Promise<SupportTicketDto> {
  const res = await fetch(`/api/businesses/${businessId}/support-tickets`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await res.json().catch(() => ({}))) as {
    data?: SupportTicketDto;
    error?: { message?: string };
  };
  if (!res.ok) {
    throw markAppApiError(
      new Error(body.error?.message ?? "ثبت تیکت ناموفق بود"),
      body,
      res.status,
    );
  }
  if (!body.data) throw new Error("پاسخ سرور نامعتبر است");
  return body.data;
}

export function ticketStatusColor(status: string): string {
  switch (status) {
    case "resolved":
      return "bg-emerald-50 text-emerald-700";
    case "in_progress":
      return "bg-blue-50 text-blue-700";
    case "closed":
      return "bg-neutral-100 text-neutral-500";
    default:
      return "bg-amber-50 text-amber-700";
  }
}
