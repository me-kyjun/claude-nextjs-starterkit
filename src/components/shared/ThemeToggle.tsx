"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/**
 * 다크/라이트 테마 토글 버튼 컴포넌트
 * 라이트 모드: 해 아이콘 표시, 다크 모드: 달 아이콘 표시
 * 클릭 시 현재 테마와 반대 테마로 즉시 전환
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label={t("toggle")}>
      {/* 라이트 모드일 때 보임 */}
      <Sun className="h-[1.2rem] w-[1.2rem] block dark:hidden" />
      {/* 다크 모드일 때 보임 */}
      <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
      <span className="sr-only">{t("toggle")}</span>
    </Button>
  );
}
