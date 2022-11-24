import React, { useCallback, useEffect, useRef } from "react";

import { User } from "@prisma/client";
import autoAnimate from "@formkit/auto-animate";

import MessageComponent from "@components/Message";
import MessageSceleton from "@components/Sceletons/MessageSceleton";
import useNav from "@hooks/useNav";
import { CHANNEL_NAME, pusherClient } from "@utils/pusherClient";
import { MdMessage } from "react-icons/md";

type ChatProps = {
  messages:
    | { user: User; id: number; body: string; createdAt: Date }[]
    | undefined;
  loading?: boolean;
};

function Chat({ messages, loading }: ChatProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
      autoAnimate(chatRef.current);
    }
  }, []);

  const renderMessages = useCallback(() => {
    console.log(messages);

    if (loading) {
      return [...Array(10)].map((_, i) => <MessageSceleton key={i} />);
    }
    if (!messages || messages.length === 0) {
      return (
        <div className="text-bold flex self-center text-lg ">
          <span>There are no messages </span>{" "}
          <MdMessage className="mx-2 self-center" />
          <span>in chat</span>
        </div>
      );
    }

    return messages?.map(({ body, createdAt, id, user }) => (
      <MessageComponent
        body={body}
        user={user}
        createdAt={createdAt}
        id={id}
        key={id}
      />
    ));
  }, [loading, messages]);

  return (
    <div
      ref={chatRef}
      className={`${
        loading || !messages ? "overflow-y-hidden" : "overflow-y-scroll"
      } custom-scroll flex w-full flex-grow flex-col-reverse   p-4 md:py-8 md:px-16`}
    >
      {renderMessages()}
    </div>
  );
}

export default Chat;
