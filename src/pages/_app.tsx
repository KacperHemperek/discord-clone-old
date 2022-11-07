// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import UserProvider from "../components/UserProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface InitialNavContextType {
  navOpen: boolean;
  setNav: (...args: any) => void;
  channelId: number | null;
}

const initialNavContext = {
  navOpen: false,
  setNav: (value: boolean) => {},
  channelId: null,
};

export const NavContext =
  createContext<InitialNavContextType>(initialNavContext);

const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navOpen, setNavOpen] = useState(false);
  const [channelId, setChannelId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setNavOpen(false);
    if (router.query.slug) {
      setChannelId(Number(router.query.slug));
    }
  }, [router.asPath]);

  return (
    <NavContext.Provider
      value={{
        navOpen,
        setNav: (value: boolean) => {
          setNavOpen(value);
        },
        channelId,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <NavProvider>
        <Component {...pageProps} />
        <ToastContainer
          theme="dark"
          position="top-right"
          autoClose={3000}
          className={"fixed top-6 right-6"}
          pauseOnHover={false}
        />
      </NavProvider>
    </UserProvider>
  );
};

export default trpc.withTRPC(MyApp);
