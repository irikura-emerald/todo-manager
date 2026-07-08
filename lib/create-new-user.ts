"use server"

import newUserValidation from "@/validation/new-user-validation";
import prisma from "./prisma";
import encrypt from "./encrypt";

type newUserProps = {
    name: string,
    email: string,
    tell: string,
    password: string,
};

export default async function createNewUser(props: newUserProps) {
    const validated = await newUserValidation.validate(props);
    const user = prisma.user.create({
        data: {
            name: validated.name,
            email: validated.email,
            tell: validated.tell,
            hashedPassword: encrypt(validated.password),
        }
    });
    return user;
}