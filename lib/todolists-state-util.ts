import { Active, Over } from "@dnd-kit/core";
import { Todo } from "./todo-control";
import { TodoList } from "./todolist-control";

type SetTodosProps = {
    setTodoLists: (getNewTodoLists: ((prevTodoLists: PrefixedTodoList[]) => PrefixedTodoList[])) => void,
    todoListId: string,
    getNewTodos: (prevTodos: PrefixedTodo[]) => PrefixedTodo[],
};
function setTodosWithHook({ setTodoLists, todoListId, getNewTodos }: SetTodosProps) {
    const getNewTodoLists = (prevTodoLists: PrefixedTodoList[]) => {
        return prevTodoLists.map(prevTodoList => {
            if (prevTodoList.id === todoListId) {
                prevTodoList.todos = getNewTodos(prevTodoList.todos);
            }
            return { ...prevTodoList };
        });

    }
    setTodoLists(getNewTodoLists);
}

type CreateSetTodosProps = {
    setTodoLists: (getNewTodoLists: ((prevTodoLists: PrefixedTodoList[]) => PrefixedTodoList[])) => void,
    todoListId: string,
};
export function createSetTodos({ setTodoLists, todoListId }: CreateSetTodosProps) {
    const setTodos = (getNewTodos: ((prevTodos: PrefixedTodo[]) => PrefixedTodo[])) => {
        setTodosWithHook({ setTodoLists, todoListId, getNewTodos });
    };
    return setTodos;
}

type GetFromAndToProps = {
    active: Active,
    over: Over | null,
};
export function getFromAndTo({ active, over }: GetFromAndToProps) {
    // 移動元と移動先のTodoとTodoListのIDを取得
    const from = {
        todoId: active.id as string,
        todoListId: active.data.current?.sortable.containerId as string,
    };
    const to = {
        todoId: over?.id as string,
        todoListId: over?.data.current?.sortable.containerId as string,
    };
    return { from, to };
}

type FromAndTo = {
    from: { todoId: string, todoListId: string },
    to: { todoId: string, todoListId: string },
};

export function isIdsValid({ from, to }: FromAndTo) {
    return isTodoIdValid(from.todoId)
        && isTodoListIdValid(from.todoListId)
        && isTodoIdValid(to.todoId)
        && isTodoListIdValid(to.todoListId);
}

export function isTodoListIdValid(id: string) {
    const regex = /^todolist-\d+$/;
    return regex.test(id);
}

export function isTodoIdValid(id: string) {
    const regex = /^todo-\d+$/;
    return regex.test(id);
}

export function isSameTodos({ from, to }: FromAndTo) {
    return from.todoId === to.todoId;
}

export function isSameTodoLists({ from, to }: FromAndTo) {
    return from.todoListId === to.todoListId;
}

// TodoとTodoListのidにprefixをつける
// (TodoとTodoListのidが一致した場合、dndkitで誤動作するため)
type PrefixedId = {
    id: string,
    originId: number,
};
export type PrefixedTodo = Omit<Todo, "id"> & PrefixedId;
export function addPrefixToTodoId(todo: Todo): PrefixedTodo {
    const prefixedTodo = {
        ...todo,
        id: `todo-${todo.id}`,
        originId: todo.id,
    };
    return prefixedTodo;
}

export type PrefixedTodoList = Omit<TodoList, "id" | "todos"> & PrefixedId & {
    todos: PrefixedTodo[],
};
export function addPrefixToTodoListId(todoList: TodoList): PrefixedTodoList {
    const prefixedTodos = todoList.todos.map(todo => addPrefixToTodoId(todo));
    const prefixedTodoList = {
        ...todoList,
        id: `todolist-${todoList.id}`,
        originId: todoList.id,
        todos: prefixedTodos,
    };
    return prefixedTodoList;
}

export function removePrefixFromTodoId(prefixedTodo: PrefixedTodo): Todo {
    const todo = {
        ...prefixedTodo,
        id: prefixedTodo.originId,
    };
    return todo;
}

export function removePrefixFromTodoListId(prefixedTodoList: PrefixedTodoList): TodoList {
    const todos = prefixedTodoList.todos.map(prefixedTodo => removePrefixFromTodoId(prefixedTodo));
    const todoList: TodoList = {
        ...prefixedTodoList,
        id: prefixedTodoList.originId,
        todos,
    };
    return todoList;
}