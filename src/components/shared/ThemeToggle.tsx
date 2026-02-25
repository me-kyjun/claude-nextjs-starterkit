"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * 다크/라이트 테마 토글 버튼 컴포넌트
 * 라이트 모드: 해 아이콘 표시, 다크 모드: 달 아이콘 표시
 * 클릭 시 현재 테마와 반대 테마로 즉시 전환
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);

  // hydration 불일치 방지: 클라이언트 마운트 후에만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // 마운트 전에는 빈 버튼 렌더링 (hydration 불일치 방지)
  if (!mounted) {
    return <Button variant="outline" size="icon" aria-label={t("toggle")} />;
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label={t("toggle")}>
      {resolvedTheme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">{t("toggle")}</span>
    </Button>
  );
}
