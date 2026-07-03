import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { hash } from "crypto";
import signInSchema from "./schemas/signin-schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                // console.log(credentials);
                const validatedCredentials = signInSchema.validateSync(credentials);
                // console.log(validatedCredentials);
                const email = validatedCredentials.email;
                const hashedPassword = hash("sha256", validatedCredentials.password);

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        hashedPassword: true,
                    }
                });

                if (!user || user.hashedPassword !== hashedPassword) {
                    throw new Error("EmailかPasswordが違います");
                }
                return user;
            },
        })
    ],
    pages: {
        signIn: "signin"
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: ({ session, token }) => {
            session.user.id = token.id as string;
            return session;
        },
    },
});