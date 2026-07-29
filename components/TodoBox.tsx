import { deleteTodo, Todo, updateTodoDeadline, updateTodoDetail, updateTodoIsDone, updateTodoName } from "@/lib/todo-control";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@mui/material";
import { todoUpdateDetailValidationForClient, todoUpdateIsDoneValidationForClient, todoUpdateNameValidationForClient } from "@/validation/todo-validation";
import SimpleTextForm from "./simple-form/SimpleTextForm";
import SimpleOptionalMultipleTextForm from "./simple-form/SimpleOptionalMultilineTextForm";
import SimpleOptionalDateForm from "./simple-form/SimpleOptionalDateForm";
import SimpleSwitchForm from "./simple-form/SimpleSwitchForm";

type TodoBoxProps = {
    todo: Todo,
    todos: Todo[],
    setTodos: (todos: Todo[]) => void
};
export function TodoBox({ todo, todos, setTodos }: TodoBoxProps) {
    const nameProps = {
        label: "TODO",
        id: todo.id,
        value: todo.name,
        validation: todoUpdateNameValidationForClient,
        update: updateTodoName,
    };

    const detailProps = {
        label: "詳細",
        id: todo.id,
        value: todo.detail,
        validation: todoUpdateDetailValidationForClient,
        update: updateTodoDetail,
    };

    const deadlineProps = {
        label: "期日",
        id: todo.id,
        value: todo.deadline,
        update: updateTodoDeadline,
    };

    const isDoneProps = {
        label: "完了",
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

    function handleDelete() {
        if (!confirm("本当に削除しますか？")) {
            return;
        }
        deleteTodo(todo.id)
            .then(() => {
                const ownId = todo.id;
                const newTodos = todos.filter(todo => todo.id !== ownId);
                setTodos(newTodos);
            });
    }

    return (
        <div ref={setNodeRef} style={style} className="border m-1 flex">
            <div {...attributes} {...listeners} className="w-2 border-x-2 m-2"></div>
            <div>
                <SimpleTextForm {...nameProps} />
                <SimpleOptionalMultipleTextForm {...detailProps} />
                <SimpleOptionalDateForm {...deadlineProps} />
                <SimpleSwitchForm {...isDoneProps} />
                <Button onClick={handleDelete}>削除</Button>
            </div>
        </div>
    );
}