"use server"

import { auth } from "@/auth";
import prisma from "./prisma";
import { todoListCreateValidation, todoListDeleteValidation, todoListMoveValidation, todoListUpdateValidationForServer } from "@/validation/todolist-validation";
import { Todo } from "./todo-control";
import { FormValues } from "@/components/SimpleForm";
import { PrismaClient } from "@/app/generated/prisma/internal/class";
import { DefaultArgs } from "@prisma/client/runtime/client";

export type TodoList = {
    id: number,
    name: string,
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
    await todoListUpdateValidationForServer.validate({ id, value });
    await prisma.todoList.update({
        where: { id },
        data: { name: value },
    });
    const isSuccessful = true;
    return isSuccessful;
}

type Transaction = Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">;
type GetOrderIdsProps = {
    tx: Transaction,
    ids: number[],
};
async function getOrderIds({ tx, ids }: GetOrderIdsProps): Promise<number[]> {
    const orderIds: number[] = [];
    for (const id of ids) {
        const todoList = await tx.todoList.findUnique({
            where: { id },
            select: { orderId: true },
        });
        if (!todoList) {
            throw new Error(`todoList(id:${id})の取得に失敗しました。`);
        }
        const orderId = todoList.orderId;
        orderIds.push(orderId);
    }
    return orderIds;
}

type ShiftTargetListsProps = {
    tx: Transaction,
    email: string,
    orderIdFrom: number,
    orderIdTo: number,
};
async function shiftTargetLists({ tx, email, orderIdFrom, orderIdTo }: ShiftTargetListsProps): Promise<void> {
    const isMoveRising = orderIdFrom < orderIdTo;
    const where = isMoveRising
        ? { gt: orderIdFrom, lte: orderIdTo }
        : { lt: orderIdFrom, gte: orderIdTo };
    const targetTodoLists = await tx.todoList.findMany({
        where: { orderId: where, user: { email } },
        select: { id: true, orderId: true },
        orderBy: { orderId: isMoveRising ? "asc" : "desc" },
    });
    for (const todoList of targetTodoLists) {
        const newOrderId = todoList.orderId + (isMoveRising ? (- 1) : 1);
        // console.log({ old: todoList.orderId, new: newOrderId });
        await tx.todoList.update({
            where: { id: todoList.id },
            data: { orderId: newOrderId },
        });
    }
}

export async function moveTodoList(idFrom: number, idTo: number) {
    await todoListMoveValidation.validate({ from: idFrom, to: idTo });
    const email = await getEmailOfSession();

    await prisma.$transaction(async (tx) => {
        const updateOrderIdFrom = (orderId: number) => tx.todoList.update({
            where: { id: idFrom },
            data: { orderId },
        });
        const [orderIdFrom, orderIdTo] = await getOrderIds({ tx, ids: [idFrom, idTo] });
        await updateOrderIdFrom(-1);
        await shiftTargetLists({ tx, email, orderIdFrom, orderIdTo });
        await updateOrderIdFrom(orderIdTo);
    });
}

export async function deleteTodoList(id: number) {
    await todoListDeleteValidation.validate({ id });
    const email = await getEmailOfSession();

    prisma.$transaction(async (tx: Transaction) => {
        const todoList = await tx.todoList.findUnique({
            where: { id },
            select: { orderId: true },
        });
        if (!todoList) {
            throw new Error("削除対象のTODOリスト取得に失敗しました。");
        }

        await tx.todoList.delete({
            where: { id },
        });

        const targetTodoLists = await tx.todoList.findMany({
            where: {
                orderId: { gt: todoList.orderId },
                user: { email },
            },
            select: { id: true, orderId: true },
            orderBy: { orderId: "asc" },
        });

        for (const todoList of targetTodoLists) {
            const newOrderId = todoList.orderId - 1;
            // console.log({ old: todoList.orderId, new: newOrderId });
            await tx.todoList.update({
                where: { id: todoList.id },
                data: { orderId: newOrderId },
            });
        }
    });
}