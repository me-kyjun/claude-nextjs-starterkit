import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
    signIn: "/ko/login",
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
  },
});
