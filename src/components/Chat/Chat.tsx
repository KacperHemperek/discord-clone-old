import { Message, User } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import MessageComponent from "../Message/Message";
import MessageSceleton from "../Message/MessageSceleton";
import { useAuth } from "../UserProvider";

type ChatProps = {
  messages:
    | { user: User; id: number; body: string; createdAt: Date }[]
    | undefined;
  loading?: boolean;
};

function Chat({ messages, loading }: ChatProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }
  }, []);

  return (
    <div
      ref={chatRef}
      className="custom-scroll flex w-full flex-grow flex-col-reverse overflow-y-scroll  p-4 md:py-8 md:px-16"
    >
      {loading && !messages
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
