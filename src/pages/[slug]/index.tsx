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
import { MessageProps } from "@components/Message";
import _ from "lodash";

function ChatRoom() {
  const router = useRouter();
  const chatId = router.query.slug;
  const { currentUser, loadingUser } = useAuth();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const [messagesState, setMessagesState] = useState<
    | {
        user: User;
        body: string;
        createdAt: Date;
      }[]
  >([]);

  const { data } = trpc.channel.getUsers.useQuery({ id: Number(chatId) });
  const { mutate: addUser } = trpc.channel.addUser.useMutation();
  const { mutate: sendMessage, isLoading } =
    trpc.channel.sendMessage.useMutation();
  const {
    data: messagesFetched,
    isLoading: loadingMessages,
    refetch: updateMessages,
  } = trpc.channel.getMessages.useQuery({
    channelId: Number(chatId),
  });
  const messages = useMemo<MessageProps[] | undefined>(() => {
    console.log(messagesFetched);

    if (messagesFetched && (!messagesState || messagesState?.length === 0)) {
      setMessagesState(messagesFetched);
    }
    if (!messagesState || !messagesFetched) return [] as MessageProps[];
    //FIXME: messages update but sent checkmark doesn't
    const result: MessageProps[] = messagesState.map((item): MessageProps => {

      if (messagesFetched.filter((curr) => _.isEqual(curr, item)).length > 0) {
        return {
          body: item.body,
          user: item.user,
          createdAt: item.createdAt,
          sent: true,
        };
      } else {
        return {
          body: item.body,
          user: item.user,
          createdAt: item.createdAt,
          sent: false,
        };
      }
    });
    return result;
  }, [messagesFetched, messagesState]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() === "") return;
    if (!currentUser?.id) return;
    try {
      setMessagesState((prev) => [
        { body: message, createdAt: new Date(), user: currentUser },
        ...prev,
      ]);
      await sendMessage({
        channelId: Number(chatId),
        message,
        userId: currentUser?.id ?? null,
      });
    } catch (err) {
      console.error(err);
      throw new Error("sending message failed");
    }
    setMessage("");
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
      console.log(id);
      if (String(id) === chatId) {
        console.log("updating messages");
        updateMessages();
      }
    });
  }, []);

  return (
    <Layout>
      {/* messages */}
      <Chat messages={messages} loading={loadingMessages} />
      {/* send message */}
      <form
        onSubmit={handleSendMessage}
        className="mx-4 mb-4 flex items-center rounded-lg bg-brandgray-200 p-2 md:mx-16  md:mb-10"
      >
        <input
          type={"text"}
          className="h-min flex-grow resize-none bg-transparent pl-4 outline-none placeholder:text-brandgray-100"
          placeholder="Type a message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
