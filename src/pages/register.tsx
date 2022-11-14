import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import cookies from "next-cookies";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";


function Login() {
  const { emailSignUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    toast.promise(
      async () => {
        try {
          await emailSignUp({ email, password, name, confirm });
        } catch (e: any) {
          setPassword("");
          setConfirm("");
          setName("");
          setEmail("");
          throw new Error("User coudn't be created");
        }
      },
      {
        pending: "Waiting for response...",
        success: "Signed in successfully",
        error: "Couldn't sign up user",
      }
    );
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
          value={name}
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
          className="input"
          placeholder={"Your Name"}
        />
        <input
          type="email"
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          className="input"
          placeholder={"Email"}
        />
        <input
          type="password"
          value={password}
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          className="input"
          placeholder={"Password"}
        />
        <input
          type="password"
          className="input mb-4"
          placeholder={"Confirm Password"}
          value={confirm}
          onInput={(e) => setConfirm((e.target as HTMLInputElement).value)}
        />
        <Link href="/login">
          <p className="mb-8 cursor-pointer hover:underline">
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
