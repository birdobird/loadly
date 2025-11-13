import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { q } from "@/lib/db";

export const config: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      const email = user.email!;
      const existing = await q("SELECT id FROM users WHERE email=$1", [email]);
      let userId = existing.rows[0]?.id;

      if (!userId) {
        const ins = await q(
          "INSERT INTO users(email,name,image) VALUES($1,$2,$3) RETURNING id",
          [email, user.name, user.image]
        );
        userId = ins.rows[0].id;
      }

      if (account) {
        await q(
          `INSERT INTO user_accounts(user_id,provider,provider_account_id,access_token,refresh_token)
           VALUES($1,$2,$3,$4,$5)
           ON CONFLICT(provider,provider_account_id) DO UPDATE
           SET access_token=EXCLUDED.access_token,
               refresh_token=EXCLUDED.refresh_token`,
          [
            userId,
            account.provider,
            account.providerAccountId,
            account.access_token ?? null,
            account.refresh_token ?? null,
          ]
        );
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
