import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navigation } from "./Navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { Button } from "@/components/ui/button";

/**
 * 사이트 헤더 컴포넌트 (네비게이션, 테마 토글, 언어 전환 포함)
 */
export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-4 flex">
          <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Next Starter</span>
          </Link>
          <Navigation />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/login`}>{t("login")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/${locale}/register`}>{t("register")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
