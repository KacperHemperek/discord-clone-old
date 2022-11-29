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

import { auth, usersStorage } from "@utils/firebase";
import { trpc } from "@utils/trpc";
import { noop } from "@helpers/noop";
import {
  EmailLoginArgs,
  EmailSignUpArgs,
  UserContextType,
} from "@interface/UserContext";
import { pusherClient } from "@utils/pusherClient";
import { User as PrismaUser } from "@prisma/client";

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
  const { mutate: createUser, data: createdUserData } =
    trpc.user.createUser.useMutation();


  const [currentMail, setCurrentMail] = useState<string | null>(null);
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
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (cred) {
          router.push("/");
        }
      } catch (e: any) {
        throw new Error(e.code);
      }
    },
    []
  );

  const emailSignUp = useCallback(
    async ({ email, confirm, password, name }: EmailSignUpArgs) => {
      try {
        if (password !== confirm) {
          throw new Error("Passwords must match");
        }
        await createUserWithEmailAndPassword(auth, email, password);

        createUser({
          email,
          name,
        });

        router.push("/");
      } catch (e: any) {
        console.error(e);
        throw new Error(e);
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
    return { emailLogin, emailSignUp, logOut, currentUser, loadingUser };
  }, [currentUser, emailLogin, emailSignUp, logOut, currentMail, loadingUser]);

  return (
    <UserContext.Provider value={createContext()}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
