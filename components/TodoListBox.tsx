import { TodoList, updateTodoList } from "@/lib/todolist-control";
import { TodoBox } from "./TodoBox";
import { Button } from "@mui/material";
import SimpleForm from "./SimpleForm";
import { todoListUpdateValidation } from "@/validation/todolist-validation";
import { useEffect, useState } from "react";
import { getTodos, Todo } from "@/lib/todo-control";

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

    function update({ id, value }: { id: number, value: string }) {
        updateTodoList(id, value);
    }

    const simpleFormProps = {
        label: "リスト名",
        type: "text",
        id: todoList.id,
        value: todoList.name,
        validation: todoListUpdateValidation,
        update,
    }

    return (
        <div className="min-w-120">
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
