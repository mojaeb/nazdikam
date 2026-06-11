import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | نزدیکام",
    default: "نزدیکام — بازار محلی شمال ایران",
  },
  description:
    "بازار آنلاین محلی برای مازندران، گیلان و گلستان. کسب‌وکارها، محصولات و خدمات نزدیک شما.",
  keywords: ["بازار", "مازندران", "گیلان", "گلستان", "کسب‌وکار محلی", "نزدیکام"],
  openGraph: {
    locale: "fa_IR",
    type: "website",
    siteName: "نزدیکام",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0D8FBB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
