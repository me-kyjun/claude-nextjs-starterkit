import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  Palette,
  Code2,
  Smartphone,
  Search,
  Wrench,
  CheckCircle,
  Database,
} from "lucide-react";

/**
 * 홈 페이지 컴포넌트
 */
export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();

  const features = [
    {
      icon: Zap,
      title: t("features.fastPerformance.title"),
      description: t("features.fastPerformance.description"),
    },
    {
      icon: Shield,
      title: t("features.typeSecure.title"),
      description: t("features.typeSecure.description"),
    },
    {
      icon: Palette,
      title: t("features.beautifulDesign.title"),
      description: t("features.beautifulDesign.description"),
    },
    {
      icon: Code2,
      title: t("features.developmentExperience.title"),
      description: t("features.developmentExperience.description"),
    },
    {
      icon: Smartphone,
      title: t("features.responsiveDesign.title"),
      description: t("features.responsiveDesign.description"),
    },
    {
      icon: Search,
      title: t("features.seoOptimized.title"),
      description: t("features.seoOptimized.description"),
    },
    {
      icon: Wrench,
      title: t("features.extensibleFeature.title"),
      description: t("features.extensibleFeature.description"),
    },
    {
      icon: CheckCircle,
      title: t("features.professionalSupport.title"),
      description: t("features.professionalSupport.description"),
    },
    {
      icon: Database,
      title: t("features.stateManagement.title"),
      description: t("features.stateManagement.description"),
    },
  ];

  const techStack = [
    { title: "Next.js 15", subtitle: "App Router" },
    { title: "TypeScript 5", subtitle: "완전한 타입 안전성" },
    { title: "TailwindCSS v4", subtitle: "유틸리티 CSS" },
    { title: "shadcn/ui", subtitle: "컴포넌트 라이브러리" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* 히어로 섹션 */}
        <section className="border-b">
          <div className="container mx-auto px-4 py-24 text-center sm:py-32">
            <div className="mb-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              ✨ Next.js 15 기반 스타터킷
            </div>
            <h1 className="mb-6 whitespace-pre-line text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground sm:text-xl">
              {t("description")}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-lg">
                <Link href={`/${locale}/register`}>{t("getStarted")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-lg"
              >
                <Link href={`/${locale}/about`}>{t("learnMore")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 기술 스택 섹션 */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {techStack.map((tech) => (
                <div key={tech.title} className="text-center">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    {tech.subtitle}
                  </p>
                  <h3 className="text-lg font-semibold">{tech.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 주요 기능 섹션 */}
        <section>
          <div className="container mx-auto px-4 py-24 sm:py-32">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold tracking-tight">
                {t("keyFeatures")}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {t("keyFeaturesDesc")}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex flex-col rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
                  >
                    <Icon className="mb-4 h-8 w-8 text-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
