import Link from "next/link";
import React from "react";

function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-brandwhite">
      <div className="flex w-80 flex-col rounded-xl bg-brandgray-500 p-8 shadow-lg md:w-96">
        <h1 className=" mb-6 text-xl font-bold uppercase ">Register</h1>
        <input type="text" className="input" placeholder={"Your Name"} />
        <input type="email" className="input" placeholder={"Email"} />
        <input type="password" className="input" placeholder={"Password"} />
        <input
          type="password"
          className="input mb-4"
          placeholder={"Confirm Password"}
        />
        <Link href="/login">
          <p className="mb-8 cursor-pointer hover:underline">
            Already have an account? Login!
          </p>
        </Link>
        <button className="btn self-end">Log in</button>
      </div>
    </div>
  );
}

export default Login;
