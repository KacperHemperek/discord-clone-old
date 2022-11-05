import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import cookies from "next-cookies";
import Head from "next/head";
import { MdMenu } from "react-icons/md";
import NavBar from "../components/NavBar";
import { useAuth } from "../components/UserProvider";
import useNav from "../hooks/useNav";

const Home: NextPage = () => {
  const { logOut, currentUser } = useAuth();
  const { navOpen, setNav } = useNav();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen w-screen  text-brandwhite">
        <NavBar />
        <div className="flex w-full flex-col">
          <div className="flex min-h-[64px] items-center px-4 shadow-lg md:px-16">
            <button
              className="cursor-pointer lg:hidden"
              onClick={() => setNav(true)}
            >
              <MdMenu className="mr-6 h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold uppercase">Frontend Developers</h1>
          </div>
          <div className="h-full p-4 md:px-16 md:py-9">
            <h1 className="font text-3xl">Hi, {currentUser()?.name}</h1>
            <button onClick={logOut} className="btn">
              Log out
            </button>
          </div>
        </div>
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
