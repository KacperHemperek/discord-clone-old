// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import UserProvider from "../components/UserProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { createContext, useState } from "react";

export const NavContext = createContext({
  navOpen: false,
  setNav: (value: boolean) => {},
});


const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <NavContext.Provider
      value={{
        navOpen,
        setNav: (value: boolean) => {
          console.log(navOpen);
          setNavOpen(value);
        },
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
