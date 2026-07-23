import { Todo, updateTodoDeadline, updateTodoDetail, updateTodoIsDone, updateTodoName } from "@/lib/todo-control";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@mui/material";
import SimpleForm from "./SimpleForm";
import { todoUpdateDeadlineValidationForClient, todoUpdateDetailValidationForClient, todoUpdateIsDoneValidationForClient, todoUpdateNameValidationForClient } from "@/validation/todo-validation";

type TodoBoxProps = {
    todo: Todo,
};
export function TodoBox({ todo }: TodoBoxProps) {
    const nameProps = {
        label: "TODO",
        type: "text",
        id: todo.id,
        value: todo.name,
        validation: todoUpdateNameValidationForClient,
        update: updateTodoName,
    };

    const detailProps = {
        label: "詳細",
        type: "text",
        id: todo.id,
        value: todo.detail,
        validation: todoUpdateDetailValidationForClient,
        update: updateTodoDetail,
    };

    const deadlineProps = {
        label: "期日",
        type: "datetime-local",
        id: todo.id,
        value: todo.deadline?.toLocaleString("sv-SE") || "",
        validation: todoUpdateDeadlineValidationForClient,
        update: updateTodoDeadline,
    };

    const isDoneProps = {
        label: "完了",
        type: "checkbox",
        id: todo.id,
        value: todo.isDone,
        validation: todoUpdateIsDoneValidationForClient,
        update: updateTodoIsDone,
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
                <SimpleForm {...nameProps} />
                <SimpleForm {...detailProps} />
                <SimpleForm {...deadlineProps} />
                <SimpleForm {...isDoneProps} />
                <Button>削除</Button>
            </div>
        </div>
    );
}