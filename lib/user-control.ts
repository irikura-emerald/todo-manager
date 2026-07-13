"use server"

import { emailValidation, nameValidation, passwordValidation, tellValidation, UpdateUserValidation } from "@/validation/update-user-validation";
import prisma from "./prisma";
import { auth } from "@/auth";
import encrypt from "./encrypt";

export async function getAuthenticatedUser(...columns: string[]) {
    const session = await auth();
    const email = session?.user?.email as string;
    const where = { email };
    console.log(where);

    const select: Record<string, boolean> = {};
    select.id = true;
    for (const column of columns) {
        select[column] = true;
    }
    // console.log(select);

    const user = prisma.user.findUnique({ where, select });
    // console.log(await user);

    return user
}

async function updateData(column: string, data: string, validation: UpdateUserValidation): Promise<boolean> {
    const session = await auth();
    const email = session?.user?.email as string;

    const unvalidated = { value: data };
    const validated = await validation.validate(unvalidated);

    const user = await prisma.user.update({
        where: { email },
        data: { [column]: validated.value },
    });
    const isSuccessful = user ? true : false;
    return isSuccessful;
}

export async function updateName(name: string): Promise<boolean> {
    const column = "name";
    const data = name;
    const validation = nameValidation;
    const isSuccessful = updateData(column, data, validation);
    return isSuccessful;
}

export async function updateEmail(email: string): Promise<boolean> {
    const column = "email";
    const data = email;
    const validation = emailValidation;
    const isSuccessful = updateData(column, data, validation);
    return isSuccessful;
}

export async function updateTell(tell: string): Promise<boolean> {
    const column = "tell";
    const data = tell;
    const validation = tellValidation;
    const isSuccessful = updateData(column, data, validation);
    return isSuccessful;
}

export async function updatePassword(password: string): Promise<boolean> {
    const column = "hashedPassword";
    const data = encrypt(password);
    const validation = passwordValidation;
    const isSuccessful = updateData(column, data, validation);
    return isSuccessful;
}
