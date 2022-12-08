import React, { useCallback, useEffect, useState } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/router";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth } from "@utils/firebase";
import { trpc } from "@utils/trpc";
import { noop } from "@helpers/noop";
// import {
//   EmailLoginArgs,
//   EmailSignUpArgs,
//   UserContextType,
// } from "@interface/UserContext";
import { pusherClient } from "@utils/pusherClient";
import { User as PrismaUser } from "@prisma/client";
import { formatFireabseError } from "@helpers/firebaseError";
import { FirebaseError } from "firebase/app";

export interface EmailLoginArgs {
  email: string;
  password: string;
}

export interface EmailSignUpArgs extends EmailLoginArgs {
  confirm: string;
  name: string;
}

export interface UserContextType {
  emailLogin: ({ email, password }: EmailLoginArgs) => void;
  emailSignUp: ({ email, password, name, confirm }: EmailSignUpArgs) => void;
  logOut: () => void;
  currentUser: PrismaUser | null | undefined;
  loadingUser: boolean;
}

export const UserContext = React.createContext<UserContextType>({
  emailLogin: () => {
    noop();
  },
  emailSignUp: () => {
    noop();
  },
  logOut: () => {
    noop();
  },
  currentUser: null,
  loadingUser: false,
});

const firebaseCookie = "firebaseToken";

function UserProvider({ children }: { children: React.ReactNode }) {
  const { mutateAsync: createUser, data: createdUserData } =
    trpc.user.createUser.useMutation();

  const [currentUserEmail, setCurretnUserEmail] = useState<string | null>(null);

  const {
    data: currentUser,
    isLoading: loadingUser,
    refetch: refetchUser,
  } = trpc.user.getUserByEmail.useQuery({
    email: currentUserEmail,
  });

  const router = useRouter();

  const emailLogin = useCallback(
    async ({ email, password }: EmailLoginArgs) => {
      if (!email) {
        const err = new FirebaseError("email not provided", "invalid-email");

        throw new Error(formatFireabseError(err));
      }

      if (!password) {
        const err = new FirebaseError(
          "password not provided",
          "invalid-password"
        );

        throw new Error(formatFireabseError(err));
      }

      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (cred) {
          router.push("/");
        }
      } catch (e: any) {
        throw new Error(formatFireabseError(e));
      }
    },
    []
  );

  const emailSignUp = useCallback(
    async ({ email, confirm, password, name }: EmailSignUpArgs) => {
      if (password !== confirm) {
        const err = new FirebaseError(
          "Passwords not matching ",
          "passwords-does-not-match"
        );

        throw new Error(formatFireabseError(err));
      }

      if (!name) {
        const err = new FirebaseError("Name not provided", "name-not-provided");
        throw new Error(formatFireabseError(err));
      }

      try {
        await createUserWithEmailAndPassword(auth, email, password);

        await createUser({
          email,
          name,
        });

        router.push("/");
      } catch (e: any) {
        console.error(e);

        throw new Error(formatFireabseError(e.code));
      }
    },
    []
  );

  const logOut = useCallback(() => {
    signOut(auth);
    router.push("/login");
  }, [auth]);

  const handleAuthChange = useCallback(
    async (user: User | null) => {
      if (!user) {
        cookie.remove(firebaseCookie);
        return;
      }

      const token = await user.getIdToken();
      cookie.set(firebaseCookie, token, { expires: 14 });
      setCurretnUserEmail(user.email);
    },
    [firebaseCookie, currentUserEmail]
  );

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(handleAuthChange);
    const channel = pusherClient.subscribe("user-connection");

    channel.bind("user-created", async (user: PrismaUser) => {
      refetchUser();
    });
    return () => {
      channel.unsubscribe();
      unsub();
    };
  }, []);

  const createContext = useCallback((): UserContextType => {
    return {
      emailLogin,
      emailSignUp,
      logOut,
      currentUser,
      loadingUser,
    };
  }, [currentUser, emailLogin, emailSignUp, logOut, loadingUser]);

  return (
    <UserContext.Provider value={createContext()}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
