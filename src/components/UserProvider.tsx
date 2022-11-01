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
});

export function useAuth() {
  return React.useContext(UserContext);
}

const firebaseCookie = "firebaseToken";

function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(null);
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
      await createUserWithEmailAndPassword(auth, email, password);
      createUser({ email, name });
      console.log("user " + name + " created successfully");
    } catch (e: any) {
      console.error(e.code);
    }
  }

  function logOut() {
    signOut(auth);
  }

  function authSubscribtion() {
    async function handleAuthChange(user: User | null) {
      if (!user) {
        cookie.remove(firebaseCookie);
        router.push("/login");
        return;
      }
      const token = await user.getIdToken();
      cookie.set(firebaseCookie, token, { expires: 14 });
      if (user.email) {
        prisma?.user.findFirst({ where: { email: user.email } });
      }
      router.push("/");
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
    return { emailLogin, emailSignUp, logOut };
  }, []);
  return (
    <UserContext.Provider value={createContext()}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
