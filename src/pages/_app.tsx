// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppContext, AppType } from "next/app";
import { trpc } from "../utils/trpc";
import UserProvider from "../components/UserProvider";
import App from "next/app";
import { AppPropsType } from "next/dist/shared/lib/utils";
import Cookies from "js-cookie";
import cookies from "next-cookies";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
};
MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const firebaseToken = cookies(ctx);

  if(!firebaseToken) {
    return {...appContext}
  }
  try {
    trpc.user
  } catch (e) {
    
  }

  return {};
};

export default trpc.withTRPC(MyApp);
