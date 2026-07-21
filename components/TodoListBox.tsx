import { TodoList, updateTodoListName } from "@/lib/todolist-control";
import { TodoBox } from "./TodoBox";
import { Button } from "@mui/material";
import SimpleForm from "./SimpleForm";
import { todoListUpdateValidationForClient } from "@/validation/todolist-validation";
import { useEffect, useState } from "react";
import { getTodos, Todo } from "@/lib/todo-control";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TodoListBoxProps = {
    todoList: TodoList
};
export default function TodoListBox({ todoList }: TodoListBoxProps) {
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="min-w-120">
            <SimpleForm {...simpleFormProps} />
            <Button>削除</Button>
            <div>
                {todos.map(todo => {
                    return (
                        <TodoBox key={todo.id} todo={todo} />
                    );
                })}
            </div>
        </div>
    );
}
