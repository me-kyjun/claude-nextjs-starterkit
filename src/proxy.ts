import createMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

export default createMiddleware(routing);

export const config = {
  // next-intl 공식 문서 기준 matcher 패턴
  matcher: [
    // API, _next/static, _next/image, favicon.ico를 제외한 모든 경로
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
