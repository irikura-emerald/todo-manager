import { deleteTodoList, updateTodoListName } from "@/lib/todolist-control";
import { TodoBox } from "./TodoBox";
import { Button, TextField } from "@mui/material";
import { todoListUpdateValidationForClient } from "@/validation/todolist-validation";
import { createTodo } from "@/lib/todo-control";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { todoCreateValidationForClient } from "@/validation/todo-validation";
import SimpleTextForm from "./simple-form/SimpleTextForm";
import { addPrefixToTodoId, createSetTodos, PrefixedTodoList } from "@/lib/todolists-state-util";

type TodoListBoxProps = {
    todoList: PrefixedTodoList,
    setPrefixedTodoLists: (getNewTodoLists: ((prevTodoLists: PrefixedTodoList[]) => PrefixedTodoList[])) => void,
};
export default function TodoListBox({ todoList, setPrefixedTodoLists: setTodoLists }: TodoListBoxProps) {
    const todos = todoList.todos;
    const setTodos = createSetTodos({ setTodoLists, todoListId: todoList.id });

    const simpleFormProps = {
        label: "リスト名",
        type: "text",
        id: todoList.originId,
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
        deleteTodoList(todoList.originId)
            .then(() => {
                setTodoLists(prevTodoLists => {
                    const ownId = todoList.id;
                    const newTodoLists = prevTodoLists.filter(prevTodoList => prevTodoList.id !== ownId);
                    return newTodoLists;
                });
            });
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(todoCreateValidationForClient),
    });

    function handleCreateTodo({ name }: { name: string }) {
        createTodo({ todoListId: todoList.originId, name })
            .then(newTodo => {
                const newPrefixedTodo = addPrefixToTodoId(newTodo);
                setTodos(prevTodos => [...prevTodos, newPrefixedTodo]);
            });
        reset({ name: "" });
    }

    const todoNameAttributes = {
        label: "TODO名",
        ...register("name"),
        error: "name" in errors,
        helperText: errors.name?.message,
    };

    return (
        <div ref={setNodeRef} style={style} className="min-w-80">
            <div {...attributes} {...listeners} className="h-2 border-y-2 mx-4 my-2"></div>
            <div className="flex justify-evenly items-center">
                <SimpleTextForm {...simpleFormProps} />
                <Button onClick={handleDelete} variant="outlined" className="w-13">削除</Button>
            </div>
            <div>
                <SortableContext id={todoList.id.toString()} items={todos} strategy={verticalListSortingStrategy}>
                    {todos.map(todo => {
                        return (
                            <TodoBox key={todo.id} {...{ todo, setTodos }} />
                        );
                    })}
                </SortableContext>
                <form onSubmit={handleSubmit(handleCreateTodo)}>
                    <input type="hidden" value={todoList.originId} {...register("todoListId")} />
                    <div className="flex justify-evenly items-center">
                        <TextField margin="normal" {...todoNameAttributes} />
                        <Button variant="outlined" type="submit" disabled={isSubmitting} className="w-13">作成</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
