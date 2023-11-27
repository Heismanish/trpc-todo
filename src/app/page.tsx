"use client";
import { useRouter } from "next/navigation";
import TodosList from "./_components/TodosList";
import { trpc } from "./_trpc/client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  // const repsonse = trpc.user.me.useQuery();
  // if (repsonse.isError) {
  //   router.push("login");
  // }
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token"));

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className=" text-gray-50 font-bold text-2xl md:text-3xl md:mb-12 mb-6">
        Todo App Using TRPC
      </h1>
      {loggedIn ? (
        <TodosList />
      ) : (
        <p className="text-gray-100 mt-4 flex flex-col justify-center items-center gap-2 text-sm">
          <Link
            href={"/login"}
            className="text-blue-500  hover:text-blue-400 transition"
          >
            Got to Login
          </Link>
          <Link
            href={"/login"}
            className="text-blue-500 hover:text-blue-400 transition"
          >
            Got to Signup
          </Link>
        </p>
      )}
    </main>
  );
}
