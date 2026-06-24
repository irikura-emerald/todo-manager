import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { faker } from "@faker-js/faker"
import { TodoListCreateInput } from "@/app/generated/prisma/models";
import { TodoCreateInput } from "@/app/generated/prisma/models";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

function createTodos(): TodoCreateInput[] {
    const addDate = (object: Date, date: number) => object.setDate(object.getDate() + date);
    const from = addDate(new Date(), -7);
    const to = addDate(new Date(), 7);

    const NUMBER_OF_TODO = 10;
    const todos: TodoCreateInput[] = [];
    for (let orderId = 1; orderId <= NUMBER_OF_TODO; orderId++) {
        const todo: TodoCreateInput = {
            name: faker.string.alphanumeric(100),
            detail: faker.string.alphanumeric(1000),
            deadline: faker.date.between({ from, to }),
            orderId,
        };
        todos.push(todo);
    }
    return todos;
}

function createTodoLists(): TodoListCreateInput[] {
    const NUMBER_OF_TODO_LIST = 10;
    const todoLists: TodoListCreateInput[] = [];
    for (let orderId = 1; orderId <= NUMBER_OF_TODO_LIST; orderId++) {
        const todoList: TodoListCreateInput = {
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

export async function main() {
    const todoLists = createTodoLists();
    for (const todoList of todoLists) {
        await prisma.todoList.create({ data: todoList });
    }
}

main();