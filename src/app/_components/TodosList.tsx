"use client";
import React from "react";
import { trpc } from "../_trpc/client";
import { useRouter } from "next/navigation";

function TodosList() {
  const router = useRouter();
  const userName = trpc.user.me.useQuery();
  const todos = trpc.todo.allTodos.useQuery();
  const todoCompletedMutation = trpc.todo.todoCompleted.useMutation({
    onSuccess: () => {
      todos.refetch();
    },
  });
  const todoDeleteMutation = trpc.todo.deleteTodo.useMutation({
    onSuccess: () => {
      todos.refetch();
    },
  });

  const userData = userName.data;
  console.log(todos.data);

  if (userName.isError || todos.error || todos.isError) {
    router.push("/login");
  }

  return (
    <div className="min-w-full lg:min-w-[720px] flex flex-col gap-2">
      <h1 className="text-lg text-gray-100 font-semibold text-center">
        Hello {userData?.name} 👋
      </h1>
      {todos.isSuccess
        ? todos?.data?.map((items) => {
            return (
              <div
                key={items.id}
                className={
                  items.completed
                    ? "border-4 border-gray-600 p-4 flex items-center justify-between rounded-xl bg-gray-200 opacity-50 min-w-2xl"
                    : "border-4 border-gray-600 p-4 flex items-center justify-between rounded-xl bg-gray-200 min-w-2xl"
                }
              >
                <main>
                  <p className="text-gray-900 text-lg font-semibold">
                    {items.title}
                  </p>
                  <p className="text-gray-700 text-lg ">{items.description}</p>
                </main>
                <div className="flex gap-2">
                  <button
                    disabled={items.completed ? true : false}
                    className={
                      items.completed
                        ? "px-3 py-1 rounded-xl bg-gray-300 "
                        : "px-3 py-1 rounded-xl bg-gray-300 hover:bg-gray-200 transition"
                    }
                    onClick={() => {
                      todoCompletedMutation.mutate({ todoId: items.id });
                    }}
                  >
                    ✔️{" "}
                  </button>
                  <button
                    className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                    onClick={() => {
                      todoDeleteMutation.mutate({ todoId: items.id });
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>
            );
          })
        : ""}
      <button
        className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-md mt-8"
        onClick={() => {
          router.push("createTodo");
        }}
      >
        Add Todo{" "}
      </button>{" "}
    </div>
  );
}

export default TodosList;
