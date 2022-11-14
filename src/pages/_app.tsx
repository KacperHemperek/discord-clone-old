import React from "react";
import type { AppType } from "next/app";

import { ToastContainer } from "react-toastify";

import { trpc } from "@utils/trpc";
import UserProvider from "@components/Providers/UserProvider";
import NavProvider from "@components/Providers/NavProvider";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

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
