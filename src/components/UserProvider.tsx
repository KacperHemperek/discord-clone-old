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
  /* tslint:disable:no-empty */
  emailLogin: ({}: EmailLoginArgs) => {},
  /* tslint:disable:no-empty */
  emailSignUp: ({}: EmailSignUpArgs) => {},
  /* tslint:disable:no-empty */
  logOut: () => {},
  currentUser: null,
  loadingUser: false,
});

export function useAuth() {
  return React.useContext(UserContext);
}

const firebaseCookie = "firebaseToken";

function UserProvider({ children }: { children: React.ReactNode }) {
  const { mutate: createUser } = trpc.user.createUser.useMutation();
  const [currentMail, setCurrentMail] = useState<string | null>(null);
  const { data: currentUser, isLoading: loadingUser } =
    trpc.user.getUserByEmail.useQuery({
      email: currentMail,
    });

  const router = useRouter();

  async function emailLogin({ email, password }: EmailLoginArgs) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred) {
        router.push("/");
      }
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
        router.push("/");
      }
    } catch (e: any) {
      console.error(e);
      throw new Error(e);
    }
  }

  function logOut() {
    signOut(auth);
    router.push("/login");
  }

  async function handleAuthChange(user: User | null) {
    if (!user) {
      cookie.remove(firebaseCookie);
      return;
    }
    const token = await user.getIdToken();
    cookie.set(firebaseCookie, token, { expires: 14 });
    setCurrentMail(user.email || null);
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(handleAuthChange);
    return () => unsub();
  }, []);

  const createContext = React.useCallback((): UserContextType => {
    return { emailLogin, emailSignUp, logOut, currentUser, loadingUser };
  }, [currentUser, emailLogin, emailSignUp, logOut, currentMail]);

  return (
    <UserContext.Provider value={createContext()}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
