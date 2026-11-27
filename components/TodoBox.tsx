import { deleteTodo, updateTodoDeadline, updateTodoDetail, updateTodoIsDone, updateTodoName } from "@/lib/todo-control";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@mui/material";
import { todoUpdateDetailValidationForClient, todoUpdateIsDoneValidationForClient, todoUpdateNameValidationForClient } from "@/validation/todo-validation";
import SimpleTextForm from "./simple-form/SimpleTextForm";
import SimpleOptionalMultipleTextForm from "./simple-form/SimpleOptionalMultilineTextForm";
import SimpleOptionalDateForm from "./simple-form/SimpleOptionalDateForm";
import SimpleSwitchForm from "./simple-form/SimpleSwitchForm";
import { PrefixedTodo } from "@/lib/todolists-state-util";

type TodoBoxProps = {
    todo: PrefixedTodo,
    setTodos: (getNewTodos: ((prevTodos: PrefixedTodo[]) => PrefixedTodo[])) => void,
};
export function TodoBox({ todo, setTodos }: TodoBoxProps) {
    const nameProps = {
        label: "TODO",
        id: todo.originId,
        value: todo.name,
        validation: todoUpdateNameValidationForClient,
        update: updateTodoName,
    };

    const detailProps = {
        label: "詳細",
        id: todo.originId,
        value: todo.detail,
        validation: todoUpdateDetailValidationForClient,
        update: updateTodoDetail,
    };

    const deadlineProps = {
        label: "期日",
        id: todo.originId,
        value: todo.deadline,
        update: updateTodoDeadline,
    };

    const isDoneProps = {
        label: "完了",
        id: todo.originId,
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
        deleteTodo(todo.originId)
            .then(() => {
                setTodos(prevTodos => {
                    const ownId = todo.id;
                    const newTodos = prevTodos.filter(todo => todo.id !== ownId);
                    return newTodos;
                });
            });
    }

    return (
        <div ref={setNodeRef} style={style} className="border m-1 flex">
            <div {...attributes} {...listeners} className="w-2 border-x-2 m-2"></div>
            <div className="flex flex-col">
                <SimpleTextForm {...nameProps} />
                <SimpleOptionalMultipleTextForm {...detailProps} />
                <SimpleOptionalDateForm {...deadlineProps} />
                <div className="flex justify-between p-1">
                    <SimpleSwitchForm {...isDoneProps} />
                    <Button onClick={handleDelete} variant="outlined">削除</Button>
                </div>
            </div>
        </div>
    );
}