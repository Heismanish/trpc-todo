"use client";
import React, { useState } from "react";
import { trpc } from "../_trpc/client";
import { router } from "@/server/trpc";
import { useRouter } from "next/navigation";

function CreateTodo() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const userTodoMutate = trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  const repsonse = userTodoMutate.data;
  console.log(repsonse);
  return (
    <div className="items-center flex flex-col justify-center">
      <h1 className="md:mt-12 mt-6 text-white font-bold text-3xl">
        Create Todo
      </h1>

      <div className="flex flex-col md:gap-8 gap-6 mt-8">
        <div className="flex flex-col gap-2 justify-center">
          <label htmlFor="email" className="text-gray-100 text-lg font-medium">
            Title
          </label>
          <input
            type="Title"
            placeholder="Title"
            className="text-gray-900 p-2 rounded-lg"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <label htmlFor="email" className="text-gray-100 text-lg font-medium">
            Description
          </label>
          <textarea
            placeholder="Description"
            className="text-gray-900 p-2 rounded-lg"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-md mt-8"
          onClick={() => {
            console.log("reached createTodo");
            userTodoMutate.mutate({ title, description });
          }}
        >
          Create Todo
        </button>
      </div>
    </div>
  );
}

export default CreateTodo;
