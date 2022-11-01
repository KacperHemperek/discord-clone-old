import Link from "next/link";
import React from "react";

function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-brandwhite">
      <div className="flex w-80 flex-col rounded-xl bg-brandgray-500 p-8 shadow-lg md:w-96">
        <h1 className=" mb-6 text-xl font-bold uppercase ">Login</h1>
        <input type="email" className="input" placeholder={"Email"} />
        <input type="email" className="input" placeholder={"Password"} />
        <input
          type="email"
          className="input mb-4"
          placeholder={"Confirm Password"}
        />
        <Link href="/register">
          <p className="mb-8 cursor-pointer hover:underline">
            Don't have an account yet? Register!
          </p>
        </Link>
        <button className="btn self-end">Log in</button>
      </div>
    </div>
  );
}

export default Login;
