// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import UserProvider from "../components/UserProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={3000}
        className={"fixed top-6 right-6"}
        pauseOnHover={false}
      />
    </UserProvider>
  );
};

export default trpc.withTRPC(MyApp);
