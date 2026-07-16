import { TodoList } from "@/lib/todolist-control";
import { TodoBox } from "./TodoBox";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";

type TodoListBoxProps = {
    todoList: TodoList
};
export default function TodoListBox({ todoList }: TodoListBoxProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ name: string }>({
    });

    setValue("name", todoList.name);

    const nameAttributes = {
        label: "リスト名",
        type: "text",
        ...register("name"),
        error: "name" in errors,
        helperText: errors.name?.message,
    };

    return (
        <div className="min-w-120">
            <form onSubmit={handleSubmit(() => { })}>
                <TextField margin="normal" {...nameAttributes} />
            </form>
            <Button>削除</Button>
            <div>
                {todoList.todos.map(todo => {
                    return (
                        <TodoBox key={todo.id} todo={todo} />
                    );
                })}
            </div>
        </div>
    );
}
