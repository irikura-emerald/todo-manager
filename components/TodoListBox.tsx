import { deleteTodoList, TodoList, updateTodoListName } from "@/lib/todolist-control";
import { TodoBox } from "./TodoBox";
import { Button, TextField } from "@mui/material";
import SimpleForm from "./SimpleForm";
import { todoListUpdateValidationForClient } from "@/validation/todolist-validation";
import { useEffect, useState } from "react";
import { createTodo, getTodos, Todo } from "@/lib/todo-control";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { todoCreateValidationForClient } from "@/validation/todo-validation";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";

type TodoListBoxProps = {
    todoList: TodoList,
    todoLists: TodoList[],
    setTodoLists: (todoLists: TodoList[]) => void,
};
export default function TodoListBox({ todoList, todoLists, setTodoLists }: TodoListBoxProps) {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        getTodos(todoList.id)
            .then(todos => {
                setTodos(todos);
            });
    }, [todoList]);

    const simpleFormProps = {
        label: "リスト名",
        type: "text",
        id: todoList.id,
        value: todoList.name,
        validation: todoListUpdateValidationForClient,
        update: updateTodoListName,
    }

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todoList.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    function handleDelete() {
        if (!confirm("本当に削除しますか？")) {
            return;
        }
        deleteTodoList(todoList.id)
            .then(() => {
                const ownId = todoList.id;
                const newTodoLists = todoLists.filter(todoList => todoList.id !== ownId);
                setTodoLists(newTodoLists);
            });
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(todoCreateValidationForClient),
    });

    function handleCreateTodo({ name }: { name: string }) {
        createTodo({ todoListId: todoList.id, name })
            .then(newTodo => {
                setTodos([...todos, newTodo]);
            });
        reset({ name: "" });
    }

    const todoNameAttributes = {
        label: "TODO名",
        type: "text",
        ...register("name"),
        error: "name" in errors,
        helperText: errors.name?.message,
    };

    function handleDragEnd({ active, over }: DragEndEvent) {
        if (!over || active.id === over.id) {
            return;
        }

        const idFrom = active.id as number;
        const idTo = over.id as number;
        // moveTodo(idFrom, idTo);

        // console.log({ from: idFrom, to: idTo, todoLists });
        setTodos((todos) => {

            const indexFrom = todos.findIndex(todo => todo.id == idFrom);
            const indexTo = todos.findIndex(todo => todo.id == idTo);
            if (indexFrom == -1 || indexTo == -1) {
                return todos;
            }

            const movedTodos = arrayMove(todos, indexFrom, indexTo);
            return movedTodos;
        });
    }

    return (
        <div ref={setNodeRef} style={style} className="min-w-120">
            <div {...attributes} {...listeners} className="h-2 border-y-2 mx-4 my-2"></div>
            <SimpleForm {...simpleFormProps} />
            <Button onClick={handleDelete}>削除</Button>
            <div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={todos} strategy={verticalListSortingStrategy}>
                        {todos.map(todo => {
                            return (
                                <TodoBox key={todo.id} todo={todo} />
                            );
                        })}
                    </SortableContext>
                </DndContext>
                <form onSubmit={handleSubmit(handleCreateTodo)} className="min-w-120">
                    <input type="hidden" value={todoList.id} {...register("todoListId")} />
                    <TextField margin="normal" {...todoNameAttributes} />
                    <Button variant="contained" type="submit" disabled={isSubmitting}>新規作成</Button>
                </form>
            </div>
        </div>
    );
}
