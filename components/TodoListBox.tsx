import { deleteTodoList, TodoList, updateTodoListName } from "@/lib/todolist-control";
import { TodoBox } from "./TodoBox";
import { Button, TextField } from "@mui/material";
import SimpleForm from "./SimpleForm";
import { todoListUpdateValidationForClient } from "@/validation/todolist-validation";
import { useEffect, useState } from "react";
import { createTodo, getTodos, Todo } from "@/lib/todo-control";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { todoCreateValidationForClient } from "@/validation/todo-validation";

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
                const newTodoLists: TodoList[] = [];
                for (const oldList of todoLists) {
                    if (todoList.id < oldList.id) {
                        newTodoLists.push(oldList);
                    } else if (todoList.id > oldList.id) {
                        const newList = { ...oldList };
                        newList.orderId = oldList.orderId - 1;
                        newTodoLists.push(newList);
                    }
                }
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

    return (
        <div ref={setNodeRef} style={style} className="min-w-120">
            <div {...attributes} {...listeners} className="h-2 border-y-2 mx-4 my-2"></div>
            <SimpleForm {...simpleFormProps} />
            <Button onClick={handleDelete}>削除</Button>
            <div>
                {todos.map(todo => {
                    return (
                        <TodoBox key={todo.id} todo={todo} />
                    );
                })}

                <form onSubmit={handleSubmit(handleCreateTodo)} className="min-w-120">
                    <input type="hidden" value={todoList.id} {...register("todoListId")} />
                    <TextField margin="normal" {...todoNameAttributes} />
                    <Button variant="contained" type="submit" disabled={isSubmitting}>新規作成</Button>
                </form>
            </div>
        </div>
    );
}
