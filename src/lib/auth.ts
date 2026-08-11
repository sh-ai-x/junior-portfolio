// NextAuth v5 config — GitHub OAuth + email magic link.

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/email";

const githubConfigured = !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET;
const emailConfigured = !!process.env.EMAIL_FROM;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(githubConfigured
      ? [GitHub({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!
        })]
      : []),
    ...(emailConfigured
      ? [Email({ from: process.env.EMAIL_FROM! })]
      : [])
  ],
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-only-not-for-prod",
  callbacks: {
    async session({ session, user }) {
      if (session.user && user?.id) {
        (session.user as { id?: string }).id = user.id;
      }
      return session;
    }
  }
});
