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
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const UserContext = React.createContext<UserContextType>({
  emailLogin: ({}: EmailLoginArgs) => {},
  emailSignUp: ({}: EmailSignUpArgs) => {},
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
    name,
  }: EmailSignUpArgs) {
    console.log("creating user");
    try {
      if (password !== confirm) {
        console.error("Password must be same");
        throw new Error("Passwords must match");
      }
      const creds = await createUserWithEmailAndPassword(auth, email, password);

      createUser({ email, name });
      console.log("user " + name + " created successfully");
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
      console.log(user);
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
