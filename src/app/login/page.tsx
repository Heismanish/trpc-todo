"use client";
import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "../_trpc/client";
import { useRouter } from "next/navigation";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const userLoginMutate = trpc.user.login.useMutation({
    onSuccess: (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      setPassword("");
      setEmail("");
      router.push("/");
    },
  });

  return (
    <div className="flex flex-col md:mt-24 mt-12 items-center ">
      <h1 className="text-white text-3xl font-semibold">Login</h1>

      <div className="md:mt-24 mt-16 flex flex-col items-center justify-center gap-4 md:gap-8">
        <div className="flex flex-col gap-2 justify-center">
          <label htmlFor="email" className="text-gray-100 text-lg font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="text-gray-900 p-2 rounded-lg"
            autoComplete="true"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 justify-center">
          <label htmlFor="email" className="text-gray-100 text-lg font-medium">
            Password
          </label>
          <input
            type="password"
            className="text-gray-900 p-2 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button
        className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-md mt-8"
        onClick={() => {
          console.log("reached login");
          userLoginMutate.mutate({ password, email });
        }}
      >
        Login
      </button>
      <p className="text-gray-100 mt-4">
        New user? &nbsp;
        <Link href={"/signup"} className="text-blue-500">
          Got to Signup
        </Link>
      </p>
    </div>
  );
}

export default Login;
