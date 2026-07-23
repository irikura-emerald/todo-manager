import { Todo } from "@/lib/todo-control";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
    const formattedDate = todo.deadline?.toLocaleString("sv-SE");
    setValue("deadline", formattedDate || "");
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
        type: "checkbox",
        ...register("isDone"),
        error: "isDone" in errors,
        helperText: errors.isDone?.message,
    };

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="border m-1 flex">
            <div {...attributes} {...listeners} className="w-2 border-x-2 m-2"></div>
            <div>
                <form onSubmit={handleSubmit(() => { })}>
                    <TextField margin="normal" {...nameAttributes} />
                    <TextField margin="normal" {...detailAttributes} />
                    <TextField margin="normal" {...deadlineAttributes} />
                    <TextField margin="normal" {...isDoneAttributes} />
                </form>
                <Button>削除</Button>
            </div>
        </div>
    );
}