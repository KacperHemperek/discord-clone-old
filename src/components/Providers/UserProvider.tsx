import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/router";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";

import { auth, usersStorage } from "@utils/firebase";
import { trpc } from "@utils/trpc";
import { noop } from "@helpers/noop";
import { toBase64 } from "@helpers/file";
import {
  EmailLoginArgs,
  EmailSignUpArgs,
  UserContextType,
} from "@interface/UserContext";

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
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

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
    avatar,
  }: EmailSignUpArgs) {
    try {
      if (password !== confirm) {
        throw new Error("Passwords must match");
      }
      await createUserWithEmailAndPassword(auth, email, password);

      createUser({
        email,
        name,
        avatar: avatar?.name,
      });

      setNewPhoto(avatar);
      router.push("/");
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

  useEffect(() => {
    if (newPhoto && createdUserData) {
      const userImageRef = ref(
        usersStorage,
        `${createdUserData.id}/${newPhoto.name}`
      );

      uploadBytes(userImageRef, newPhoto);

      setNewPhoto(null);
    }
  }, [createdUserData]);

  const createContext = React.useCallback((): UserContextType => {
    return { emailLogin, emailSignUp, logOut, currentUser, loadingUser };
  }, [currentUser, emailLogin, emailSignUp, logOut, currentMail, loadingUser]);

  return (
    <UserContext.Provider value={createContext()}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
