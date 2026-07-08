"use server"

import prisma from "@/lib/prisma";

export default async function testEmailDuplicate(email: string) {
    const isDuplicate = await prisma.user.findUnique({
        where: { email },
        select: { email: true },
    }) as unknown as boolean;
    return !isDuplicate;
};
