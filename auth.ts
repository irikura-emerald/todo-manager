import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import signInValidation from "./validation/signin-validation";
import encrypt from "./lib/encrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                // console.log(credentials);
                const validatedCredentials = signInValidation.validateSync(credentials);
                // console.log(validatedCredentials);
                const email = validatedCredentials.email;
                const hashedPassword = encrypt(validatedCredentials.password);

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
        signIn: "auth/signin",
        newUser: "auth/new-user",
    },
    session: {
        strategy: "jwt",
    },
});