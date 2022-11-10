import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import cookies from "next-cookies";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../../components/UserProvider";
import Layout from "../../layouts/layout";
import { trpc } from "../../utils/trpc";

function Chat() {
  const router = useRouter();
  const chatId = router.query.slug;
  const { currentUser, loadingUser } = useAuth();

  const { data } = trpc.channel.getUsers.useQuery({ id: Number(chatId) });
  const { mutate } = trpc.channel.addUser.useMutation();

  useEffect(() => {
    if (loadingUser || !currentUser || !chatId) return;

    if (data?.some((user) => user.id === currentUser.id)) return;

    mutate({
      channelId: Number(chatId),
      userId: currentUser.id,
    });
    console.log("Adding " + currentUser.name + " to channel");
  }, [currentUser, chatId]);

  return <Layout>{chatId}</Layout>;
}

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

export default Chat;
