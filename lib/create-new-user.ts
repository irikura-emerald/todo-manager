"use server"

import newUserValidation from "@/validation/new-user-validation";
import { hash } from "crypto";
import prisma from "./prisma";

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
            hashedPassword: hash("sha256", validated.password),
        }
    });
    return user;
}