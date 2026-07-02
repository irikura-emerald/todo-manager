import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { hash } from "crypto";
import signInSchema from "./schemas/signin-schema";

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
                const validatedCredentials = signInSchema.validateSync(credentials);
                // console.log(validatedCredentials);
                const email = validatedCredentials.email;
                const hashedPassword = hash("sha256", validatedCredentials.password);

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