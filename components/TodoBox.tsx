import { Todo } from "@/lib/todolist-control";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

type TodoBoxProps = {
    todo: Todo,
};
type TodoForm = Omit<Todo, "deadline"> & {
    deadline: string,
};
export function TodoBox({ todo }: TodoBoxProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<TodoForm>({
        // resolver: yupResolver(),
    });

    setValue("name", todo.name,);
    setValue("detail", todo.detail);
    const formattedDate = todo.deadline.toLocaleString("sv-SE");
    setValue("deadline", formattedDate);
    setValue("isDone", todo.isDone);

    const nameAttributes = {
        label: "TODO",
        type: "text",
        ...register("name"),
        error: "name" in errors,
        helperText: errors.name?.message,
    };

    const detailAttributes = {
        label: "詳細",
        ...register("detail"),
        error: "detail" in errors,
        helperText: errors.detail?.message,
        maxRows: 3,
        multiline: true,
    };

    const deadlineAttributes = {
        label: "期日",
        type: "datetime-local",
        ...register("deadline"),
        error: "deadline" in errors,
        helperText: errors.deadline?.message,
    };

    const isDoneAttributes = {
        label: "完了",
        type: "checkbox",
        ...register("isDone"),
        error: "isDone" in errors,
        helperText: errors.isDone?.message,
    };

    return (
        <div className="border m-1">
            <form onSubmit={handleSubmit(() => { })}>
                <TextField margin="normal" {...nameAttributes} />
                <TextField margin="normal" {...detailAttributes} />
                <TextField margin="normal" {...deadlineAttributes} />
                <TextField margin="normal" {...isDoneAttributes} />
            </form>
            <Button>削除</Button>
        </div>
    );
}