import { redirect } from "next/navigation";

/**
 * 루트 경로("/")에서 기본 로케일("/ko")로 리다이렉트
 */
export default function RootPage() {
  redirect("/ko");
}
