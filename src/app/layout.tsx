import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Starter Kit",
  description: "Next.js 15 + TypeScript + TailwindCSS + shadcn/ui 스타터킷",
};

/**
 * 루트 레이아웃: HTML 기본 구조 담당
 * getLocale()로 현재 로케일을 읽어 lang 속성 동적 설정
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
