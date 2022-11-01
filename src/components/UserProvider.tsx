import React, { useEffect } from "react";
import {
  EmailLoginArgs,
  EmailSignUpArgs,
  UserContextType,
} from "../interface/UserContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "../utils/firebase";

import cookie from "js-cookie";

const UserContext = React.createContext<UserContextType>({
  emailLogin: ({}: EmailLoginArgs) => {},
  emailSignUp: ({}: EmailSignUpArgs) => {},
});

export function useAuth() {
  return React.useContext(UserContext);
}

const firebaseCookie = "firebaseToken";

function UserProvider({ children }: { children: React.ReactNode }) {
  async function emailLogin({ email, password, redirect }: EmailLoginArgs) {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      console.log("User logged in successfully");
    } catch (e: any) {
      console.error(e.message);
      throw new Error(e.code);
    }
  }

  async function emailSignUp({
    email,
    confirm,
    password,
    redirect,
  }: EmailSignUpArgs) {
    try {
      if (password !== confirm) {
        throw new Error("Passwords must match");
      }
      await createUserWithEmailAndPassword(auth, email, password);

      console.log();
    } catch (e: any) {
      console.error(e.code);
    }
  }

  function authSubscribtion() {
    async function handleAuthChange(user: User | null) {
      if (!user) {
        cookie.remove(firebaseCookie);
        return;
      }
      const token = await user.getIdToken();
      cookie.set(firebaseCookie, token, { expires: 14 });
    }

    return auth.onAuthStateChanged(handleAuthChange);
  }

  useEffect(() => {
    const unsubscribe = authSubscribtion();

    return () => {
      unsubscribe();
    };
  }, []);

  const createContext = React.useCallback((): UserContextType => {
    return { emailLogin, emailSignUp };
  }, []);
  return (
    <UserContext.Provider value={createContext()}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
