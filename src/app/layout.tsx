import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Starter Kit",
  description: "Next.js 15 + TypeScript + TailwindCSS + shadcn/ui 스타터킷",
};

/**
 * 루트 레이아웃: HTML 기본 구조만 담당
 * lang 속성과 ThemeProvider는 [locale]/layout.tsx에서 처리
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
