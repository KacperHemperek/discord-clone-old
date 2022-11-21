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

  const { mutate: updateUser } = trpc.user.editUser.useMutation();

  const [currentMail, setCurrentMail] = useState<string | null>(null);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  const { data: currentUser, isLoading: loadingUser } =
    trpc.user.getUserByEmail.useQuery({
      email: currentMail,
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
    async ({ email, confirm, password, name, avatar }: EmailSignUpArgs) => {
      try {
        if (password !== confirm) {
          throw new Error("Passwords must match");
        }
        await createUserWithEmailAndPassword(auth, email, password);

        createUser({
          email,
          name,
        });

        setNewPhoto(avatar);
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

  const addPhotoToUser = useCallback(async () => {
    if (!newPhoto || !createdUserData) {
      return;
    }
    const userImageRef = ref(
      usersStorage,
      `${createdUserData.id}/${newPhoto.name}`
    );

    const res = await uploadBytes(userImageRef, newPhoto);

    const photoRef = ref(userImageRef);
    const photo = await getDownloadURL(photoRef);

    console.log(photo);
    updateUser({ avatar: photo, userId: createdUserData.id });

    updateUser;
    setNewPhoto(null);
  }, [newPhoto, createdUserData]);

  useEffect(() => {
    addPhotoToUser();
  }, [createdUserData]);

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
