import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "../../route";
import User from "../../model/user";
import bcrypt from "bcryptjs";

const resolvedSecret = process.env.NEXTAUTH_SECRET || 'dev-insecure-temp-secret-change-me';
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('[NextAuth] NEXTAUTH_SECRET is missing. Using insecure development fallback. Add NEXTAUTH_SECRET to .env.local.');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  // debug: process.env.NODE_ENV === "development",
  secret: resolvedSecret,
};
