import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import cookies from "next-cookies";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import Chat from "../../components/Chat/Chat";
import { useAuth } from "../../components/UserProvider";
import Layout from "../../layouts/layout";
import { trpc } from "../../utils/trpc";

function ChatRoom() {
  const router = useRouter();
  const chatId = router.query.slug;
  const { currentUser, loadingUser } = useAuth();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");

  const { data } = trpc.channel.getUsers.useQuery({ id: Number(chatId) });
  const { mutate: addUser } = trpc.channel.addUser.useMutation();
  const { mutate: sendMessage } = trpc.channel.sendMessage.useMutation();
  const { data: messages, isLoading: loadingMessages } =
    trpc.channel.getMessages.useQuery(
      {
        channelId: Number(chatId),
      },
      { refetchInterval: 10000 }
    );

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() === "") return;
    if (!currentUser?.id) return;

    sendMessage({
      channelId: Number(chatId),
      message,
      userId: currentUser?.id ?? null,
    });
  }

  useEffect(() => {
    if (loadingUser || !currentUser || !chatId) return;

    if (data?.some((user) => user.id === currentUser.id)) return;

    addUser({
      channelId: Number(chatId),
      userId: currentUser.id,
    });
    console.log("Adding " + currentUser.name + " to channel");
  }, [currentUser, chatId, chatRef.current]);

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
