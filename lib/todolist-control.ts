"use server"

import { auth } from "@/auth";
import prisma from "./prisma";

export type Todo = {
    id: number,
    name: string,
    detail: string,
    deadline: Date,
    isDone: boolean,
    orderId: number,
};

export type TodoList = {
    id: number,
    name: string,
    orderId: number,
    todos: Todo[],
};

export async function getTodoList(): Promise<TodoList[]> {
    const session = await auth();
    const email = session?.user?.email as string;
    const todoLists = await prisma.todoList.findMany({
        where: {
            user: { email },
        },
        select: {
            id: true,
            name: true,
            orderId: true,
            todos: {
                select: {
                    id: true,
                    name: true,
                    detail: true,
                    deadline: true,
                    isDone: true,
                    orderId: true,
                },
                orderBy: {
                    orderId: "asc",
                }
            },
        },
        orderBy: {
            orderId: "asc"
        }
    });
    return todoLists as TodoList[];
}