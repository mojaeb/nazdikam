import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VerificationImageFieldProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function VerificationImageField({
  label,
  file,
  onChange,
  disabled,
}: VerificationImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (next: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    if (!next) {
      setPreview(null);
      onChange(null);
      return;
    }
    setPreview(URL.createObjectURL(next));
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      <label className="block font-vazirmatn text-xs font-medium text-neutral-500">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full rounded-xl border border-dashed border-neutral-200 overflow-hidden text-start transition-colors",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-300",
        )}
      >
        {preview ? (
          <img src={preview} alt="" className="w-full h-36 object-cover" />
        ) : (
          <div className="h-28 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="font-vazirmatn text-xs">انتخاب تصویر</span>
          </div>
        )}
      </button>
      {file && (
        <p className="font-vazirmatn text-[10px] text-neutral-400 truncate">{file.name}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="space-y-1.5">
      <label className="block font-vazirmatn text-xs font-medium text-neutral-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        dir={dir}
        className="w-full h-11 px-4 rounded-xl border border-neutral-200 font-vazirmatn text-sm outline-none focus:border-blue-400 disabled:opacity-50"
      />
    </div>
  );
}

export function IndividualVerificationForm({
  disabled,
  onSubmit,
  submitting,
}: {
  disabled?: boolean;
  submitting?: boolean;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    fatherName: string;
    nationalId: string;
    portrait: File;
    idCardFront: File;
    idCardBack: File;
  }) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [portrait, setPortrait] = useState<File | null>(null);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    fatherName.trim() &&
    /^\d{10}$/.test(nationalId.trim()) &&
    portrait &&
    idCardFront &&
    idCardBack;

  return (
    <div className="space-y-4">
      <p className="font-vazirmatn text-sm text-neutral-500">برای مدرسین و افراد حقیقی</p>
      <Field label="نام" value={firstName} onChange={setFirstName} disabled={disabled} />
      <Field label="نام خانوادگی" value={lastName} onChange={setLastName} disabled={disabled} />
      <Field label="نام پدر" value={fatherName} onChange={setFatherName} disabled={disabled} />
      <Field
        label="کد ملی"
        value={nationalId}
        onChange={(v) => setNationalId(v.replace(/\D/g, "").slice(0, 10))}
        disabled={disabled}
        placeholder="۱۰ رقم"
        dir="ltr"
      />
      <VerificationImageField label="عکس پرسنلی" file={portrait} onChange={setPortrait} disabled={disabled} />
      <VerificationImageField label="روی کارت ملی" file={idCardFront} onChange={setIdCardFront} disabled={disabled} />
      <VerificationImageField label="پشت کارت ملی" file={idCardBack} onChange={setIdCardBack} disabled={disabled} />
      <button
        type="button"
        disabled={disabled || submitting || !canSubmit}
        onClick={() => {
          if (!portrait || !idCardFront || !idCardBack) return;
          onSubmit({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            fatherName: fatherName.trim(),
            nationalId: nationalId.trim(),
            portrait,
            idCardFront,
            idCardBack,
          });
        }}
        className="w-full h-11 rounded-xl bg-teal-600 text-white font-vazirmatn text-sm font-bold disabled:opacity-50"
      >
        {submitting ? "در حال ارسال..." : "ارسال مدارک"}
      </button>
    </div>
  );
}

export function LegalVerificationForm({
  disabled,
  submitting,
  onSubmit,
}: {
  disabled?: boolean;
  submitting?: boolean;
  onSubmit: (data: {
    ownerFirstName: string;
    ownerLastName: string;
    ownerFatherName: string;
    ownerNationalId: string;
    guildCode: string;
    ownerPortrait: File;
    ownerIdCardFront: File;
    businessLicense: File;
  }) => void;
}) {
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerFatherName, setOwnerFatherName] = useState("");
  const [ownerNationalId, setOwnerNationalId] = useState("");
  const [guildCode, setGuildCode] = useState("");
  const [ownerPortrait, setOwnerPortrait] = useState<File | null>(null);
  const [ownerIdCardFront, setOwnerIdCardFront] = useState<File | null>(null);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);

  const canSubmit =
    ownerFirstName.trim() &&
    ownerLastName.trim() &&
    ownerFatherName.trim() &&
    /^\d{10}$/.test(ownerNationalId.trim()) &&
    guildCode.trim() &&
    ownerPortrait &&
    ownerIdCardFront &&
    businessLicense;

  return (
    <div className="space-y-4">
      <p className="font-vazirmatn text-sm text-neutral-500">برای کسب‌وکارهای دارای مجوز</p>
      <Field label="نام صاحب کسب‌وکار" value={ownerFirstName} onChange={setOwnerFirstName} disabled={disabled} />
      <Field label="نام خانوادگی صاحب کسب‌وکار" value={ownerLastName} onChange={setOwnerLastName} disabled={disabled} />
      <Field label="نام پدر صاحب کسب‌وکار" value={ownerFatherName} onChange={setOwnerFatherName} disabled={disabled} />
      <Field
        label="کد ملی صاحب کسب‌وکار"
        value={ownerNationalId}
        onChange={(v) => setOwnerNationalId(v.replace(/\D/g, "").slice(0, 10))}
        disabled={disabled}
        placeholder="۱۰ رقم"
        dir="ltr"
      />
      <Field label="کد اصناف" value={guildCode} onChange={setGuildCode} disabled={disabled} dir="ltr" />
      <VerificationImageField label="عکس صاحب کسب‌وکار" file={ownerPortrait} onChange={setOwnerPortrait} disabled={disabled} />
      <VerificationImageField label="روی کارت ملی صاحب" file={ownerIdCardFront} onChange={setOwnerIdCardFront} disabled={disabled} />
      <VerificationImageField label="عکس مجوز کسب‌وکار" file={businessLicense} onChange={setBusinessLicense} disabled={disabled} />
      <button
        type="button"
        disabled={disabled || submitting || !canSubmit}
        onClick={() => {
          if (!ownerPortrait || !ownerIdCardFront || !businessLicense) return;
          onSubmit({
            ownerFirstName: ownerFirstName.trim(),
            ownerLastName: ownerLastName.trim(),
            ownerFatherName: ownerFatherName.trim(),
            ownerNationalId: ownerNationalId.trim(),
            guildCode: guildCode.trim(),
            ownerPortrait,
            ownerIdCardFront,
            businessLicense,
          });
        }}
        className="w-full h-11 rounded-xl bg-teal-600 text-white font-vazirmatn text-sm font-bold disabled:opacity-50"
      >
        {submitting ? "در حال ارسال..." : "ارسال مدارک"}
      </button>
    </div>
  );
}
