"use server"

import { todoCreateValidationForServer } from "@/validation/todo-validation";
import prisma from "./prisma";

export type Todo = {
    id: number,
    name: string,
    detail: string,
    deadline: Date | null,
    isDone: boolean,
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
        },
        orderBy: {
            orderId: "asc",
        },
    });
    return todos;
}

export async function createTodo({ todoListId, name }: { todoListId: number, name: string }): Promise<Todo> {
    await todoCreateValidationForServer.validate({ todoListId, name });

    const { _max: { orderId: maxOfOrderId } } = await prisma.todo.aggregate({
        _max: { orderId: true },
        where: { todoListId },
    });
    const orderId = (maxOfOrderId as number) + 1;

    console.log({ name, orderId, todoListId });
    const newTodo = await prisma.todo.create({
        data: {
            name,
            orderId,
            todoListId,
        },
        select: { id: true, name: true, detail: true, deadline: true, isDone: true },
    });
    return newTodo;
}