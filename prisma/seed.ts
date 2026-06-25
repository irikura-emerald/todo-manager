import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { faker } from "@faker-js/faker"
import { TodoCreateWithoutTodoListInput, TodoListCreateWithoutUserInput, UserCreateInput } from "@/app/generated/prisma/models";

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
    const todos: TodoCreateWithoutTodoListInput[] = [];
    for (let orderId = 1; orderId <= NUMBER_OF_TODO; orderId++) {
        const todo: TodoCreateWithoutTodoListInput = {
            name: faker.string.alphanumeric(100),
            detail: faker.string.alphanumeric(1000),
            deadline: faker.date.between({ from, to }),
            orderId,
        };
        todos.push(todo);
    }
    return todos;
}

function createTodoLists(): TodoListCreateWithoutUserInput[] {
    const NUMBER_OF_TODO_LIST = 10;
    const todoLists: TodoListCreateWithoutUserInput[] = [];
    for (let orderId = 1; orderId <= NUMBER_OF_TODO_LIST; orderId++) {
        const todoList: TodoListCreateWithoutUserInput = {
            name: faker.string.alphanumeric(100),
            orderId: orderId,
            todos: {
                create: createTodos(),
            },
        };
        todoLists.push(todoList);
    }
    return todoLists;
}

function createUsers(): UserCreateInput[] {
    const NUMBER_OF_USER = 5;
    const users: UserCreateInput[] = [];
    for (let i = 0; i < NUMBER_OF_USER; i++) {
        const user: UserCreateInput = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            todoLists: {
                create: createTodoLists(),
            },
        };
        users.push(user);
    }
    return users;
}

export async function main() {
    const users = createUsers();
    for (const user of users) {
        await prisma.user.create({ data: user });
    }
}

main();