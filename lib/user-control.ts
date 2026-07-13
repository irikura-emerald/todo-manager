"use server"

import { emailValidation, nameValidation, passwordValidation, tellValidation, UpdateUserValidation } from "@/validation/update-user-validation";
import prisma from "./prisma";
import { auth } from "@/auth";
import encrypt from "./encrypt";

export async function getAuthenticatedUser(...columns: string[]) {
    const session = await auth();
    const email = session?.user?.email as string;
    const where = { email };
    // console.log(where);

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

type updatePasswordProps = {
    currentPassword: string,
    newPassword: string,
};
export async function updatePassword(passwords: updatePasswordProps): Promise<boolean> {
    const session = await auth();
    const email = session?.user?.email as string;

    const validated = await passwordValidation.validate(passwords);
    const hashedCurrentPassword = encrypt(validated.currentPassword);
    const hashedNewPassword = encrypt(validated.newPassword);

    const user = await prisma.user.findUnique({
        where: { email },
        select: { hashedPassword: true }
    });
    const isMatched = user && (user.hashedPassword === hashedCurrentPassword);
    if (!isMatched) {
        return false;
    }

    const updatedUser = await prisma.user.update({
        where: { email },
        data: { hashedPassword: hashedNewPassword },
    });
    const isSuccessful = updatedUser ? true : false;
    return isSuccessful;
}
