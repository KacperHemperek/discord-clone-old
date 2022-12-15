import React, { useEffect, useMemo, useRef, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import cookies from "next-cookies";

import { MdSend } from "react-icons/md";

import Chat from "@components/Chat";
import useAuth from "@hooks/useAuth";
import Layout from "@layouts/layout";
import { trpc } from "@utils/trpc";
import { pusherClient } from "@utils/pusherClient";
import { User } from "@prisma/client";

function ChatRoom() {
  const router = useRouter();
  const chatId = router.query.slug;

  const { currentUser, loadingUser } = useAuth();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  const { data } = trpc.channel.getUsers.useQuery({ id: Number(chatId) });
  const { mutate: addUser } = trpc.channel.addUser.useMutation();
  const {
    mutateAsync: sendMessage,
    isLoading,
    data: newMessage,
  } = trpc.channel.sendMessage.useMutation();
  const {
    data: messagesFetched,
    isLoading: loadingMessages,
    refetch: updateMessages,
  } = trpc.channel.getMessages.useQuery({
    channelId: Number(chatId),
  });

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageInputRef.current?.value) return;

    const message = messageInputRef.current.value;

    if (message.trim() === "" || !currentUser?.id) return;

    try {
      await sendMessage({
        channelId: Number(chatId),
        message,
        userId: currentUser?.id ?? null,
      });
    } catch (err) {
      console.error(err);
      throw new Error("sending message failed");
    }
    messageInputRef.current.value = "";
  }

  useEffect(() => {
    if (loadingUser || !currentUser || !chatId) return;

    if (data?.some((user) => user.id === currentUser.id)) return;

    addUser({
      channelId: Number(chatId),
      userId: currentUser.id,
    });
    console.log("Adding " + currentUser.name + " to channel");
  }, [
    currentUser,
    chatId,
    chatRef.current,
    data,
    loadingUser,
    messagesFetched,
  ]);

  useEffect(() => {
    const channel = pusherClient.subscribe("chat-connection");

    channel.bind("chat-message", ({ id }: { id: number }) => {
      if (String(id) === chatId) {
        updateMessages();
      }
    });
  }, []);

  return (
    <Layout>
      {/* messages */}
      <Chat messages={messagesFetched} loading={loadingMessages} />
      {/* send message */}
      <form
        onSubmit={handleSendMessage}
        className="mx-4 mb-4 flex items-center rounded-lg bg-brandgray-200 p-2 md:mx-16  md:mb-10"
      >
        <input
          type={"text"}
          className="h-min flex-grow resize-none bg-transparent pl-4 outline-none placeholder:text-brandgray-100"
          placeholder="Type a message here"
          ref={messageInputRef}
        />
        <button className="flex h-10 w-10 items-center justify-center rounded-md bg-brandblue">
          <MdSend className=" h-4 w-4" />
        </button>
      </form>
    </Layout>
  );
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

export default ChatRoom;
