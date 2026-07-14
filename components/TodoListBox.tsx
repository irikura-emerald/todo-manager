import { TodoList } from "@/lib/todolist-control";

type TodoListBoxProps = {
    todoList: TodoList
};
export default function TodoListBox({ todoList }: TodoListBoxProps) {
    return (
        <div className="w-[15rem] h-[30rem] overflow-hidden m-1">
            {todoList.name}
        </div>
    );
}

