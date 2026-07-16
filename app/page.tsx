"use client"

import Navigation from "@/components/Navigation";
import TodoListBox from "@/components/TodoListBox";
import { getTodoList, TodoList } from "@/lib/todolist-control";
import { useEffect, useState } from "react";

export default function Home() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);

  useEffect(() => {
    getTodoList()
      .then(todoLists => {
        // console.log(todoLists);
        setTodoLists(todoLists);
      });
  }, []);

  return (
    <>
      <Navigation />
      <div className="flex overflow-x-scroll">
        {
          todoLists.map(todoList => {
            // console.log(todoList);
            return <TodoListBox key={todoList.id} todoList={todoList} />;
          })
        }
      </div>
    </>
  );
}