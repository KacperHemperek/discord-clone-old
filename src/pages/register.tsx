import React, { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import cookies from "next-cookies";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-toastify";

import useAuth from "@hooks/useAuth";

function Login() {
  const { emailSignUp } = useAuth();
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  async function addUser(e: React.FormEvent) {
    const signUp = async () => {
      try {
        emailSignUp({
          email: emailRef.current?.value as string,
          password: passwordRef.current?.value as string,
          name: nameRef.current?.value as string,
          confirm: confirmRef.current?.value as string,
        });
      } catch (e: any) {
        (passwordRef.current as HTMLInputElement).value = "";
        (emailRef.current as HTMLInputElement).value = "";
        (nameRef.current as HTMLInputElement).value = "";
        (confirmRef.current as HTMLInputElement).value = "";
        throw new Error(e);
      }
    };

    e.preventDefault();
    toast.promise(signUp, {
      pending: "Waiting for response...",
      success: "Signed in successfully",
      error: "Couldn't sign up user",
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
          ref={nameRef}
          className="input"
          placeholder={"Your Name"}
        />
        <input
          type="email"
          ref={emailRef}
          className="input"
          placeholder={"Email"}
        />
        <input
          type="password"
          ref={passwordRef}
          className="input"
          placeholder={"Password"}
        />
        <input
          type="password"
          className="input mb-4"
          placeholder={"Confirm Password"}
          ref={confirmRef}
        />
        <Link href="/login">
          <p className="mb-8 cursor-pointer underline">
            Already have an account? Login!
          </p>
        </Link>
        <button type="submit" className="btn self-end">
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
