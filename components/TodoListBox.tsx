import { TodoList } from "@/lib/todolist-control";

type TodoListBoxProps = {
    todoList: TodoList
};
export default function TodoListBox({ todoList }: TodoListBoxProps) {
    return (
        <div className="w-60 h-120 overflow-hidden m-1">
            {todoList.name}
        </div>
    );
}

