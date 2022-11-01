import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import cookies from "next-cookies";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../components/UserProvider";

function Login() {
  const { emailLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen w-screen items-center justify-center text-brandwhite">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          emailLogin({ email, password });
        }}
        className="flex w-80 flex-col rounded-xl bg-brandgray-500 p-8 shadow-lg md:w-96"
      >
        <h1 className=" mb-6 text-xl font-bold uppercase ">Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder={"Email"}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mb-4"
          placeholder={"Password"}
        />

        <Link href="/register">
          <p className="mb-8 cursor-pointer hover:underline">
            Don't have an account yet? Register!
          </p>
        </Link>
        <button className="btn self-end">Log in</button>
      </form>
    </div>
  );
}

export function getServerSideProps(
  ctx: GetServerSidePropsContext
): InferGetServerSidePropsType<any> {
  const cookie = cookies(ctx);

  if (cookie.firebaseToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}

export default Login;
