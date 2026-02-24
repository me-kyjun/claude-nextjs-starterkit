import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 홈 페이지 컴포넌트
 */
export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/${locale}/register`}>{t("getStarted")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/about`}>{t("learnMore")}</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Next.js 15", desc: "App Router + Turbopack" },
              { title: "TypeScript 5", desc: "완전한 타입 안전성" },
              { title: "TailwindCSS v4", desc: "CSS-first 설정" },
              { title: "shadcn/ui", desc: "재사용 가능한 컴포넌트" },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
