import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const SUPPORTED_LOCALES = ["ko", "en"];

/**
 * URL에서 로케일 세그먼트를 추출
 * 경로의 첫 번째 세그먼트가 지원 로케일이면 해당 값, 아니면 기본값 "ko" 반환
 */
function getLocaleFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const firstSegment = pathname.split("/")[1];
    return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : "ko";
  } catch {
    return "ko";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * 사용자 인증 로직
       * 실제 프로젝트에서는 DB 조회로 대체
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 예시: 하드코딩된 테스트 계정
        // 실제 프로젝트에서는 DB에서 사용자 조회 필요
        if (
          credentials.email === "test@example.com" &&
          credentials.password === "password"
        ) {
          return {
            id: "1",
            email: "test@example.com",
            name: "Test User",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    /** JWT 토큰에 사용자 정보 추가 */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    /** 세션에 사용자 정보 추가 */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    /** callbackUrl의 로케일을 파싱하여 동적으로 로그인 페이지 리다이렉트 */
    async redirect({ url, baseUrl }) {
      const absoluteUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
      const locale = getLocaleFromUrl(absoluteUrl);

      if (
        url.startsWith(baseUrl) &&
        !url.includes("/login") &&
        !url.includes("/register")
      ) {
        return url;
      }
      return `${baseUrl}/${locale}/login`;
    },
  },
});
