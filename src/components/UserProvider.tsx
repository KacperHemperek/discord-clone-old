import React, { useEffect, useState } from "react";
import {
  EmailLoginArgs,
  EmailSignUpArgs,
  UserContextType,
} from "../interface/UserContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../utils/firebase";

import cookie from "js-cookie";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const UserContext = React.createContext<UserContextType>({
  emailLogin: ({}: EmailLoginArgs) => {},
  emailSignUp: ({}: EmailSignUpArgs) => {},
  logOut: () => {},
  currentUser: () => null,
});

export function useAuth() {
  return React.useContext(UserContext);
}

const firebaseCookie = "firebaseToken";

function UserProvider({ children }: { children: React.ReactNode }) {
  const { mutate: createUser } = trpc.user.createUser.useMutation();

  const router = useRouter();

  async function emailLogin({ email, password }: EmailLoginArgs) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      throw new Error(e.code);
    }
  }

  async function emailSignUp({
    email,
    confirm,
    password,
    name,
  }: EmailSignUpArgs) {
    try {
      if (password !== confirm) {
        throw new Error("Passwords must match");
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred) {
        createUser({ email, name });
      }
    } catch (e: any) {
      console.error(e);
      throw new Error(e);
    }
  }

  function logOut() {
    signOut(auth);
  }

  function currentUser() {
    const userQuery = trpc.user.getUserByEmail.useQuery({
      email: auth.currentUser?.email ?? null,
    });
    return userQuery.data;
  }

  async function handleAuthChange(user: User | null) {
    if (!user) {
      cookie.remove(firebaseCookie);
      router.push("/login");
      return;
    }
    const token = await user.getIdToken();
    cookie.set(firebaseCookie, token, { expires: 14 });
    console.log("redirecting");
    router.push("/");
  }

  useEffect(() => {
    auth.onAuthStateChanged(handleAuthChange);
  }, []);

  const createContext = React.useCallback((): UserContextType => {
    return { emailLogin, emailSignUp, logOut, currentUser };
  }, []);
  return (
    <UserContext.Provider value={createContext()}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
