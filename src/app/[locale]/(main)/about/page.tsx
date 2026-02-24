import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 소개 페이지 컴포넌트
 */
export default function AboutPage() {
  const t = useTranslations("about");

  const features = [
    t("featureList.auth"),
    t("featureList.i18n"),
    t("featureList.theme"),
    t("featureList.ui"),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>
        <p className="mb-8 text-muted-foreground">{t("description")}</p>

        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>{t("features")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
