import React, { useEffect, useRef } from "react";

import { User } from "@prisma/client";
import autoAnimate from "@formkit/auto-animate";

import MessageComponent from "@components/Message";
import MessageSceleton from "@components/Sceletons/MessageSceleton";

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

  return (
    <div
      ref={chatRef}
      className={`${
        loading ? "overflow-y-hidden" : "overflow-y-scroll"
      } custom-scroll flex w-full flex-grow flex-col-reverse   p-4 md:py-8 md:px-16`}
    >
      {loading
        ? [...Array(10)].map((_, i) => <MessageSceleton key={i} />)
        : messages?.map(({ body, createdAt, id, user }) => (
            <MessageComponent
              body={body}
              user={user}
              createdAt={createdAt}
              id={id}
              key={id}
            />
          ))}
    </div>
  );
}

export default Chat;
