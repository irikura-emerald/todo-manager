import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { faker } from "@faker-js/faker"
import { TodoListCreateInput } from "@/app/generated/prisma/models";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

export async function main() {
    const NUMBER_OF_TODO_LIST = 10;

    for (let orderId = 1; orderId <= NUMBER_OF_TODO_LIST; orderId++) {
        const todoList: TodoListCreateInput = {
            name: faker.string.alphanumeric(100),
            orderId: orderId,
        };
        await prisma.todoList.create({ data: todoList });
    }
}

main();