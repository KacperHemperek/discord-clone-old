import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import cookies from "next-cookies";
import Head from "next/head";
import { useAuth } from "../components/UserProvider";

const Home: NextPage = () => {
  const { logOut } = useAuth();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen w-screen items-center justify-center">
        <button onClick={logOut} className="btn">
          Log out
        </button>
      </div>
    </>
  );
};

export function getServerSideProps(
  ctx: GetServerSidePropsContext
): InferGetServerSidePropsType<any> {
  const cookie = cookies(ctx);

  if (!cookie.firebaseToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
}

export default Home;
