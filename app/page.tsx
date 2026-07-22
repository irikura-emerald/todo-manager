"use client"

import Navigation from "@/components/Navigation";
import TodoListBox from "@/components/TodoListBox";
import { createTodoList, getTodoLists, moveTodoList, TodoList } from "@/lib/todolist-control";
import { todoListCreateValidation } from "@/validation/todolist-validation";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);

  useEffect(() => {
    getTodoLists()
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

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) {
      return;
    }

    const idFrom = active.id as number;
    const idTo = over.id as number;
    moveTodoList(idFrom, idTo);

    // console.log({ from: idFrom, to: idTo, todoLists });
    setTodoLists((todoLists) => {

      const indexFrom = todoLists.findIndex(todoList => todoList.id == idFrom);
      const indexTo = todoLists.findIndex(todoList => todoList.id == idTo);
      if (indexFrom == -1 || indexTo == -1) {
        return todoLists;
      }

      const movedTodoLists = arrayMove(todoLists, indexFrom, indexTo);
      return movedTodoLists;
    });
  }

  return (
    <>
      <Navigation />
      <div className="flex">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todoLists} strategy={horizontalListSortingStrategy}>
            {
              todoLists.map(todoList => {
                // console.log(todoList);
                return <TodoListBox key={todoList.id} {...{ todoList, todoLists, setTodoLists }} />;
              })
            }
          </SortableContext>
        </DndContext>

        <form onSubmit={handleSubmit(addTodoList)} className="min-w-120">
          <TextField margin="normal" {...todoListNameAttributes} />
          <Button variant="contained" type="submit" disabled={isSubmitting}>新規作成</Button>
        </form>
      </div>
    </>
  );
}