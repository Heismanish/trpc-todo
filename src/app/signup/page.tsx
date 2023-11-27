"use client";
import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "../_trpc/client";
import { useRouter } from "next/navigation";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const userSignupMutate = trpc.user.signup.useMutation({
    onSuccess: (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      setName("");
      setPassword("");
      setEmail("");
      router.push("/login");
    },
  });

  // const handleSignup = () => {
  //   console.log("reached signup");
  //   userSignupMutate.mutate({ name, password, email });
  // };

  return (
    <div className="flex flex-col md:mt-24 mt-12 items-center ">
      <h1 className="text-white text-3xl font-semibold">Signup</h1>

      <div className="md:mt-24 mt-16 flex flex-col items-center justify-center gap-4 md:gap-8">
        <div className="flex flex-col gap-2 justify-center">
          <label htmlFor="name" className="text-gray-100 text-lg font-medium">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="text-gray-900 p-2 rounded-lg"
            autoComplete="true"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-md mt-8 transition-colors  hover:bg-blue-400 cursor-pointer"
        onClick={() => {
          console.log("reached signup");
          userSignupMutate.mutate({ name, password, email });
        }}
      >
        Signup
      </button>
      <p className="text-gray-100 mt-4">
        Already a user? &nbsp;
        <Link href={"/login"} className="text-blue-500">
          Got to Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
