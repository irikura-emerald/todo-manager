"use client"

import Navigation from "@/components/Navigation";
import TodoListBox from "@/components/TodoListBox";
import { moveTodo as moveTodoInDB } from "@/lib/todo-control";
import { moveTodoList as moveTodoListInDB, createTodoList, getTodoLists } from "@/lib/todolist-control";
import { addPrefixToTodoListId, createSetTodos, getFromAndTo, isIdsValid, isSameTodoLists, isSameTodos, isTodoListIdValid, PrefixedTodo, PrefixedTodoList } from "@/lib/todolists-state-util";
import { todoListCreateValidation } from "@/validation/todolist-validation";
import { closestCorners, DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const TODO_LIST_CONTAINER_ID = "todo-lists";

export default function TestPage() {
    const [prefixedTodoLists, setPrefixedTodoLists] = useState<PrefixedTodoList[]>([]);

    useEffect(() => {
        getTodoLists()
            .then(todoLists => {
                // console.log(todoLists);
                const prefixedTodoLists = todoLists.map(todoList => addPrefixToTodoListId(todoList));
                setPrefixedTodoLists(prefixedTodoLists);
            });
    }, []);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(todoListCreateValidation),
    });

    const todoListNameAttributes = {
        label: "リスト名",
        type: "text",
        ...register("name"),
        error: "name" in errors,
        helperText: errors.name?.message,
    };

    function addTodoList({ name }: { name: string }) {
        createTodoList(name)
            .then(newTodoList => {
                const newPrefixedTodoList = addPrefixToTodoListId(newTodoList);
                setPrefixedTodoLists([...prefixedTodoLists, newPrefixedTodoList]);
            });
        reset({ name: "" });
    }

    function handleDragOver(event: DragOverEvent) {
        const { from, to } = getFromAndTo(event);

        // IDが一つでも取得できていないなら終了
        if (!isIdsValid({ from, to })) {
            return;
        }

        // 移動元と移動先でTodoかTodoListが一致するなら終了
        const isSameTodo = from.todoId === to.todoId;
        const isSameTodoList = from.todoListId == to.todoListId;
        if (isSameTodo || isSameTodoList) {
            return;
        }

        // 移動元のTodoListを取得
        const fromTodoList = prefixedTodoLists.find(todoList => todoList.id === from.todoListId) as PrefixedTodoList;

        // 移動させるTodoを取得
        const draggedTodo = fromTodoList.todos.find(todo => todo.id === from.todoId) as PrefixedTodo;

        setPrefixedTodoLists(prevPrefixedTodoLists => {
            const newTodoLists = prevPrefixedTodoLists.map(todoList => {
                const newTodoList: PrefixedTodoList = {
                    ...todoList,
                    todos: [],
                };
                if (todoList.id === from.todoListId) {
                    newTodoList.todos = todoList.todos.filter(todo => todo.id !== from.todoId);
                } else if (todoList.id === to.todoListId) {
                    todoList.todos.forEach(todo => {
                        if (todo.id === to.todoId) {
                            newTodoList.todos.push({ ...draggedTodo });
                        }
                        newTodoList.todos.push({ ...todo });
                    });
                } else {
                    newTodoList.todos = [...todoList.todos];
                }
                return newTodoList;
            });
            // console.log(newTodoLists);
            return newTodoLists;
        });
    }


    function handleDragEnd(event: DragEndEvent) {
        const isMovingTodoList = TODO_LIST_CONTAINER_ID === event.active.data.current?.sortable.containerId;
        if (isMovingTodoList) {
            moveTodoList(event);
        } else {
            moveTodo(event);
        }
    }

    function moveTodo(event: DragEndEvent) {
        const { from, to } = getFromAndTo(event);
        if (!isIdsValid({ from, to })
            || !isSameTodoLists({ from, to })
            || isSameTodos({ from, to })) {
            return;
        }

        const todoListId = from.todoListId;
        const getTodo = (todoId: string) => {
            const todoList = prefixedTodoLists.find(todoList => todoList.id === todoListId) as PrefixedTodoList;
            const todo = todoList.todos.find(todo => todo.id === todoId) as PrefixedTodo;
            return todo;
        };
        const fromTodo = getTodo(from.todoId);
        const toTodo = getTodo(to.todoId);
        moveTodoInDB(fromTodo.originId, toTodo.originId);

        // console.log({ from, to });

        const getNewTodos = (prevTodos: PrefixedTodo[]) => {
            const indexFrom = prevTodos.findIndex(todo => todo.id == from.todoId);
            const indexTo = prevTodos.findIndex(todo => todo.id == to.todoId);
            if (indexFrom == -1 || indexTo == -1) {
                return prevTodos;
            }

            const movedTodos = arrayMove(prevTodos, indexFrom, indexTo);
            return movedTodos;
        };
        const setTodos = createSetTodos({ setTodoLists: setPrefixedTodoLists, todoListId });
        setTodos(getNewTodos);
    }

    function moveTodoList({ active, over }: DragEndEvent) {
        const from = active.id as string;
        const to = over?.id as string;
        if (!isTodoListIdValid(from) || !isTodoListIdValid(to) || from === to) {
            return;
        }

        const getTodoList = (id: string) => prefixedTodoLists.find(todoList => todoList.id === id) as PrefixedTodoList;
        const fromTodoList = getTodoList(from);
        const toTodoList = getTodoList(to);
        moveTodoListInDB(fromTodoList.originId, toTodoList.originId);

        // console.log({ from, to, todoLists });
        setPrefixedTodoLists((todoLists) => {
            const indexFrom = todoLists.findIndex(todoList => todoList.id === from);
            const indexTo = todoLists.findIndex(todoList => todoList.id === to);
            if (indexFrom == -1 || indexTo == -1) {
                return todoLists;
            }

            const movedTodoLists = arrayMove(todoLists, indexFrom, indexTo);
            return movedTodoLists;
        });
    }

    return (
        <>
            <Navigation />
            <div className="flex">
                <DndContext
                    collisionDetection={closestCorners}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext id={TODO_LIST_CONTAINER_ID} items={prefixedTodoLists} strategy={horizontalListSortingStrategy}>
                        {
                            prefixedTodoLists.map(todoList => {
                                // console.log(todoList);
                                return <TodoListBox key={todoList.id} {...{ todoList, setPrefixedTodoLists }} />;
                            })
                        }
                    </SortableContext>
                </DndContext>

                <form onSubmit={handleSubmit(addTodoList)} className="flex justify-evenly items-center min-w-80 h-fit">
                    <TextField margin="normal" {...todoListNameAttributes} />
                    <Button variant="contained" type="submit" disabled={isSubmitting} className="w-13 h-8">作成</Button>
                </form>
            </div>
        </>
    );
}