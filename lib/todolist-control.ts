"use server"

import { auth } from "@/auth";
import prisma from "./prisma";
import { todoListCreateValidation, todoListUpdateValidationForServer } from "@/validation/todolist-validation";
import { Todo } from "./todo-control";
import { FormValues } from "@/components/SimpleForm";

export type TodoList = {
    id: number,
    name: string,
    orderId: number,
    todos: Todo[],
};

async function getEmailOfSession(): Promise<string> {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
        throw new Error("セッションユーザのEmail取得に失敗しました。");
    }
    return email;
}

export async function getTodoLists(): Promise<TodoList[]> {
    const email = await getEmailOfSession();
    const todoLists = await prisma.todoList.findMany({
        where: {
            user: { email },
        },
        select: {
            id: true,
            name: true,
            orderId: true,
        },
        orderBy: {
            orderId: "asc"
        }
    });
    return todoLists as TodoList[];
}

export async function createTodoList(name: string): Promise<TodoList> {
    todoListCreateValidation.validateSync({ name });

    const email = await getEmailOfSession();

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

export async function testTodoListOwner(id: number): Promise<boolean> {
    const email = await getEmailOfSession();
    const todoList = await prisma.todoList.findUnique({
        select: {
            user: {
                select: {
                    email: true
                }
            }
        },
        where: { id },
    });
    const isTodoListMine = todoList && todoList.user.email === email ? true : false;
    return isTodoListMine;
}

export async function updateTodoListName({ id, value }: FormValues): Promise<boolean> {
    todoListUpdateValidationForServer.validate({ id, value });
    await prisma.todoList.update({
        where: { id },
        data: { name: value },
    });
    const isSuccessful = true;
    return isSuccessful;
}