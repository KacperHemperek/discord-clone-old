import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import cookies from "next-cookies";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../layouts/layout";
import { trpc } from "../../utils/trpc";

function Chat() {
  const router = useRouter();
  const chatId = router.query.slug;

  const { data } = trpc.channel.getUsers.useQuery({ id: Number(chatId) });

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
