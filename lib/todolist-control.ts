"use server"

import { auth } from "@/auth";
import prisma from "./prisma";
import { todoListCreateValidation } from "@/validation/todolist-validation";

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

export async function createTodoList(name: string): Promise<TodoList> {
    todoListCreateValidation.validateSync({ name });

    const session = await auth();
    const email = session?.user?.email as string;

    const { _max: { orderId: maxOfOrderId } } = await prisma.todoList.aggregate({
        _max: { orderId: true },
        where: { user: { email } },
    });
    const orderId = (maxOfOrderId as number) + 1;

    const user = await prisma.user.findUnique({
        select: { id: true },
        where: { email },
    });
    if (!user) {
        throw new Error("ユーザの取得に失敗しました。");
    }
    const userId = user.id;

    const todos = {
        select: {
            id: true,
            name: true,
            detail: true,
            deadline: true,
            isDone: true,
            orderId: true,
        }
    };

    const newTodoList = await prisma.todoList.create({
        data: { name, orderId, userId },
        select: { id: true, name: true, orderId: true, todos },
    });
    return newTodoList;
}