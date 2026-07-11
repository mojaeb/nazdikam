# اجرای محلی (Windows)

## روش سریع — یک کلیک

```powershell
cd D:\DEVLIC\projects\behroozi\front
.\scripts\run.ps1
```

دو پنجره PowerShell باز می‌شود (API + Web).

## روش دستی — دو ترمینال

**ترمینال ۱ — API**

```powershell
cd D:\DEVLIC\projects\behroozi\front
pnpm dev:api
```

**ترمینال ۲ — Web**

```powershell
cd D:\DEVLIC\projects\behroozi\front
pnpm dev:web
```

## آدرس‌ها

| سرویس | آدرس |
|--------|------|
| وب‌اپ | http://localhost:22333/ |
| API | http://127.0.0.1:8080/api/healthz |

## پیش‌نیاز

فایل `.env` در ریشه پروژه (از `.env.example` کپی کنید).

اولین بار یا بعد از تغییر schema:

```powershell
pnpm --filter @workspace/db run push
```

این دستور جداول Drizzle و جدول `sessions` (برای ورود) را می‌سازد.

## ورود (dev)

بعد از وارد کردن شماره، کد OTP در **لاگ ترمینال API** چاپ می‌شود (`_dev_otp`).
