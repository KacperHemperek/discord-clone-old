import React, { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import cookies from "next-cookies";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-toastify";

import useAuth from "@hooks/useAuth";
import { formatReactTostifyError } from "@helpers/firebaseError";
import { isEmpty } from "@helpers/isEmpty";

function Login() {
  const { emailSignUp } = useAuth();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    const signUp = async () =>
      emailSignUp({
        email,
        password,
        name,
        confirm,
      });
    e.preventDefault();
    toast.promise(signUp, {
      pending: "Waiting for response...",
      success: "Signed in successfully",
      error: {
        render({ data }) {
          setEmail("");
          setConfirm("");
          setName("");
          setPassword("");
          return (
            <span className="capitalize">{formatReactTostifyError(data)}</span>
          );
        },
      },
    });
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center text-brandwhite">
      <form
        onSubmit={addUser}
        className="flex w-80 flex-col rounded-xl bg-brandgray-500 p-8 shadow-lg md:w-96"
      >
        <h1 className=" mb-6 text-xl font-bold uppercase ">Register</h1>

        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="input"
          placeholder={"Your Name"}
        />
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="input"
          placeholder={"Email"}
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="input"
          placeholder={"Password"}
        />
        <input
          type="password"
          className="input mb-4"
          placeholder={"Confirm Password"}
          onChange={(e) => setConfirm(e.target.value)}
          value={confirm}
        />
        <Link href="/login">
          <p className="mb-8 max-w-fit cursor-pointer underline">
            Already have an account? Login!
          </p>
        </Link>
        <button
          type="submit"
          className="btn w-full "
          disabled={
            isEmpty(email) ||
            isEmpty(password) ||
            isEmpty(confirm) ||
            isEmpty(name)
          }
        >
          Register
        </button>
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
