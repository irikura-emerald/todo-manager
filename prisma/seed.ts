import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { faker } from "@faker-js/faker"
import { TodoCreateWithoutTodoListInput, TodoListCreateWithoutUserInput, UserCreateInput } from "@/app/generated/prisma/models";
import { hash } from "crypto";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

function createTodos(): TodoCreateWithoutTodoListInput[] {
    const addDate = (object: Date, date: number) => object.setDate(object.getDate() + date);
    const from = addDate(new Date(), -7);
    const to = addDate(new Date(), 7);

    const NUMBER_OF_TODO = 10;
    const todos = createDatas(NUMBER_OF_TODO, orderId => {
        return {
            name: faker.string.alphanumeric(100),
            detail: faker.string.alphanumeric(1000),
            deadline: faker.date.between({ from, to }),
            orderId,
        };
    });
    return todos;
}

function createTodoLists(): TodoListCreateWithoutUserInput[] {
    const NUMBER_OF_TODO_LIST = 10;
    const todoLists = createDatas(NUMBER_OF_TODO_LIST, orderId => {
        return {
            name: faker.string.alphanumeric(100),
            orderId: orderId,
            todos: {
                create: createTodos(),
            },
        };
    });
    return todoLists;
}

function createUsers(): UserCreateInput[] {
    const NUMBER_OF_USER = 5;
    const users = createDatas(NUMBER_OF_USER, () => {
        return {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            tell: faker.phone.number(),
            hashedPassword: hash("sha256", "password"),
            todoLists: {
                create: createTodoLists(),
            },
        };
    });
    return users;
}

function createDatas<T>(numberOfData: number, createOne: (orderId: number) => T): T[] {
    const datas: T[] = [];
    for (let orderId = 1; orderId <= numberOfData; orderId++) {
        const data = createOne(orderId);
        datas.push(data);
    }
    return datas;
}

export async function main() {
    const users = createUsers();
    for (const user of users) {
        await prisma.user.create({ data: user });
    }
}

main();