import { useTranslations } from "next-intl";

/**
 * 사이트 푸터 컴포넌트
 */
export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {year} Next Starter. {t("rights")}.
        </p>
      </div>
    </footer>
  );
}
