"use server"

import prisma from "./prisma";

export type Todo = {
    id: number,
    name: string,
    detail: string,
    deadline: Date,
    isDone: boolean,
    orderId: number,
};

export async function getTodos(todoListId: number): Promise<Todo[]> {
    const todos = await prisma.todo.findMany({
        where: { todoListId },
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
        },
    });
    return todos;
}