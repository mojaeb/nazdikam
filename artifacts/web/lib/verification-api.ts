import { markAppApiError, type ApiErrorBody } from "@/lib/api-error";
import type { VerificationStatus } from "@/lib/business.types";

export type VerificationType = "individual" | "legal";

export type VerificationPayloadDto = {
  first_name?: string;
  last_name?: string;
  father_name?: string;
  national_id?: string;
  portrait_url?: string;
  id_card_front_url?: string;
  id_card_back_url?: string;
  owner_first_name?: string;
  owner_last_name?: string;
  owner_father_name?: string;
  owner_national_id?: string;
  owner_portrait_url?: string;
  owner_id_card_front_url?: string;
  business_license_url?: string;
  guild_code?: string;
};

export type VerificationSubmissionDto = {
  id: number;
  business_id: number;
  type: VerificationType;
  status: "pending" | "approved" | "rejected";
  payload: VerificationPayloadDto;
  rejection_reason: string | null;
  notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

export type VerificationStateDto = {
  verification_status: VerificationStatus;
  submission: VerificationSubmissionDto | null;
};

export function businessVerificationQueryKey(businessId: number) {
  return [`/api/businesses/${businessId}/verification`] as const;
}

export async function fetchVerificationState(businessId: number): Promise<VerificationStateDto> {
  const res = await fetch(`/api/businesses/${businessId}/verification`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(body.error?.message ?? "خطا در بارگذاری وضعیت احراز هویت"),
      body,
      res.status,
    );
  }
  const body = (await res.json()) as { data?: VerificationStateDto };
  return body.data ?? { verification_status: "unverified", submission: null };
}

export type SubmitIndividualVerificationInput = {
  businessId: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalId: string;
  portrait: File;
  idCardFront: File;
  idCardBack: File;
};

export type SubmitLegalVerificationInput = {
  businessId: number;
  ownerFirstName: string;
  ownerLastName: string;
  ownerFatherName: string;
  ownerNationalId: string;
  guildCode: string;
  ownerPortrait: File;
  ownerIdCardFront: File;
  businessLicense: File;
};

export function submitVerification(
  input: SubmitIndividualVerificationInput | SubmitLegalVerificationInput,
): Promise<VerificationSubmissionDto> {
  const form = new FormData();

  if ("guildCode" in input) {
    form.append("type", "legal");
    form.append("owner_first_name", input.ownerFirstName);
    form.append("owner_last_name", input.ownerLastName);
    form.append("owner_father_name", input.ownerFatherName);
    form.append("owner_national_id", input.ownerNationalId);
    form.append("guild_code", input.guildCode);
    form.append("owner_portrait", input.ownerPortrait);
    form.append("owner_id_card_front", input.ownerIdCardFront);
    form.append("business_license", input.businessLicense);
  } else {
    form.append("type", "individual");
    form.append("first_name", input.firstName);
    form.append("last_name", input.lastName);
    form.append("father_name", input.fatherName);
    form.append("national_id", input.nationalId);
    form.append("portrait", input.portrait);
    form.append("id_card_front", input.idCardFront);
    form.append("id_card_back", input.idCardBack);
  }

  return fetch(`/api/businesses/${input.businessId}/verification/submit`, {
    method: "POST",
    credentials: "include",
    body: form,
  }).then(async (res) => {
    const body = (await res.json().catch(() => ({}))) as {
      data?: VerificationSubmissionDto;
      error?: { message?: string };
    };
    if (!res.ok) {
      throw markAppApiError(
        new Error(body.error?.message ?? "ارسال مدارک ناموفق بود"),
        body,
        res.status,
      );
    }
    if (!body.data) throw new Error("پاسخ سرور نامعتبر است");
    return body.data;
  });
}

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  verified: "تأیید شده — تیک آبی در صفحه عمومی نمایش داده می‌شود",
  pending: "در انتظار بررسی توسط پشتیبانی",
  unverified: "هنوز مدارک ارسال نشده",
};
