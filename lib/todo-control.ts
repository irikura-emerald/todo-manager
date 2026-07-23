"use server"

import { todoCreateValidationForServer, todoMoveValidation, todoUpdateDeadlineValidationForServer, todoUpdateDetailValidationForServer, todoUpdateIsDoneValidationForServer, todoUpdateNameValidationForServer } from "@/validation/todo-validation";
import prisma from "./prisma";
import { PrismaClient } from "@/app/generated/prisma/internal/class";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { getEmailOfSession } from "./todolist-control";

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

    // console.log({ name, orderId, todoListId });
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

export async function testTodoOwner(id: number): Promise<boolean> {
    const email = await getEmailOfSession();
    const todo = await prisma.todo.findUnique({
        select: {
            todoList: {
                select: {
                    user: {
                        select: {
                            email: true
                        }
                    }
                }
            }
        },
        where: { id },
    });
    const isTodoMine = todo && todo.todoList.user.email === email ? true : false;
    return isTodoMine;
}

type Transaction = Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">;
type GetOrderIdsProps = {
    tx: Transaction,
    ids: number[],
};
async function getOrderIds({ tx, ids }: GetOrderIdsProps): Promise<number[]> {
    const orderIds: number[] = [];
    for (const id of ids) {
        const todo = await tx.todo.findUnique({
            where: { id },
            select: { orderId: true },
        });
        if (!todo) {
            throw new Error(`todo(id:${id})の取得に失敗しました。`);
        }
        const orderId = todo.orderId;
        orderIds.push(orderId);
    }
    return orderIds;
}

type ShiftTargetListsProps = {
    tx: Transaction,
    todoListId: number,
    orderIdFrom: number,
    orderIdTo: number,
};
async function shiftTargetLists({ tx, todoListId, orderIdFrom, orderIdTo }: ShiftTargetListsProps): Promise<void> {
    const isMoveRising = orderIdFrom < orderIdTo;
    const where = isMoveRising
        ? { gt: orderIdFrom, lte: orderIdTo }
        : { lt: orderIdFrom, gte: orderIdTo };
    const targetTodos = await tx.todo.findMany({
        where: { orderId: where, todoList: { id: todoListId } },
        select: { id: true, orderId: true },
        orderBy: { orderId: isMoveRising ? "asc" : "desc" },
    });
    for (const todo of targetTodos) {
        const newOrderId = todo.orderId + (isMoveRising ? (- 1) : 1);
        // console.log({ old: todo.orderId, new: newOrderId });
        await tx.todo.update({
            where: { id: todo.id },
            data: { orderId: newOrderId },
        });
    }
}

export async function moveTodo(idFrom: number, idTo: number) {
    await todoMoveValidation.validate({ from: idFrom, to: idTo });

    const todoFrom = await prisma.todo.findUnique({
        where: { id: idFrom },
        select: { todoListId: true },
    });
    if (!todoFrom) {
        throw new Error(`todo(id:${idFrom})の取得に失敗しました。`);
    }
    const todoListId = todoFrom.todoListId;

    await prisma.$transaction(async (tx) => {
        const updateOrderIdFrom = (orderId: number) => tx.todo.update({
            where: { id: idFrom },
            data: { orderId },
        });
        const [orderIdFrom, orderIdTo] = await getOrderIds({ tx, ids: [idFrom, idTo] });
        await updateOrderIdFrom(-1);
        await shiftTargetLists({ tx, todoListId, orderIdFrom, orderIdTo });
        await updateOrderIdFrom(orderIdTo);
    });
}

export async function updateTodoName({ id, value }: { id: number, value: string }): Promise<boolean> {
    await todoUpdateNameValidationForServer.validate({ id, value });
    const todo = await prisma.todo.update({
        where: { id },
        data: { name: value },
    });
    const isSuccessful = todo ? true : false;
    return isSuccessful;
}

export async function updateTodoDetail({ id, value }: { id: number, value: string }): Promise<boolean> {
    await todoUpdateDetailValidationForServer.validate({ id, value });
    const todo = await prisma.todo.update({
        where: { id },
        data: { detail: value },
    });
    const isSuccessful = todo ? true : false;
    return isSuccessful;
}

export async function updateTodoDeadline({ id, value }: { id: number, value: string }): Promise<boolean> {
    await todoUpdateDeadlineValidationForServer.validate({ id, value });
    const todo = await prisma.todo.update({
        where: { id },
        data: { deadline: value },
    });
    const isSuccessful = todo ? true : false;
    return isSuccessful;
}

export async function updateTodoIsDone({ id, value }: { id: number, value: string }): Promise<boolean> {
    await todoUpdateIsDoneValidationForServer.validate({ id, value });
    const todo = await prisma.todo.update({
        where: { id },
        data: { isDone: value ? true : false },
    });
    const isSuccessful = todo ? true : false;
    return isSuccessful;
}
