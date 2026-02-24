"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * 언어 전환 버튼 컴포넌트 (한국어/영어)
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  /** 현재 경로에서 로케일만 교체하여 이동 */
  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={locale === "ko" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleLocaleChange("ko")}
      >
        한국어
      </Button>
      <Button
        variant={locale === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleLocaleChange("en")}
      >
        English
      </Button>
    </div>
  );
}
