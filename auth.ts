import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { hash } from "crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                // console.log(credentials);
                const email = credentials.email as string;
                const hashedPassword = hash("sha256", credentials.password as string);

                const user = await prisma.user.findUnique({
                    where: { email }
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
});