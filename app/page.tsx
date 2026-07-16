"use client"

import Navigation from "@/components/Navigation";
import TodoListBox from "@/components/TodoListBox";
import { createTodoList, getTodoList, TodoList } from "@/lib/todolist-control";
import todoListCreateValidation from "@/validation/todolist-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);

  useEffect(() => {
    getTodoList()
      .then(todoLists => {
        // console.log(todoLists);
        setTodoLists(todoLists);
      });
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(todoListCreateValidation),
  });

  const todoListNameAttributes = {
    label: "リスト名",
    type: "text",
    ...register("name"),
    error: "name" in errors,
    helperText: errors.name?.message,
  };

  function addTodoList({ name }: { name: string }) {
    createTodoList(name)
      .then(newTodoList => {
        setTodoLists([...todoLists, newTodoList]);
      });
    reset({ name: "" });
  }

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

        <form onSubmit={handleSubmit(addTodoList)} className="min-w-120">
          <TextField margin="normal" {...todoListNameAttributes} />
          <Button variant="contained" type="submit" disabled={isSubmitting}>新規作成</Button>
        </form>
      </div>
    </>
  );
}