import { useRouter } from "next/router";
import React from "react";
import { MdMenu } from "react-icons/md";
import NavBar from "../components/NavBar";
import useNav from "../hooks/useNav";
import { trpc } from "../utils/trpc";

function Layout({ children }: { children: React.ReactNode }) {
  const { setNav } = useNav();
  const router = useRouter();

  const { slug: channelId } = router.query;
  const { data: channel } = trpc.channel.getChannelById.useQuery({
    id: Number(channelId),
  });

  return (
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
          <h1 className="text-lg font-bold uppercase">{channel?.name ?? ""}</h1>
        </div>
        <main className="h-full p-4 md:px-16 md:py-9">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
