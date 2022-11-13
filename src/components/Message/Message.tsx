import { User } from "@prisma/client";
import React from "react";
import Avatar from "../Avatar";
import { getDaysAgo } from "../../helpers/date";

type MessageProps = {
  user: User;
  id: number;
  body: string;
  createdAt: Date;
};

function Message({ body, createdAt, user }: MessageProps) {
  const date = getDaysAgo(createdAt);

  return (
    <div className="my-4 flex w-full">
      <div>
        <Avatar avatar="https://i.pravatar.cc/400" />
      </div>
      <div className=" flex-grow ">
        <div className="mb-1 flex items-center space-x-8 text-brandgray-100">
          <h5 className=" font-bold md:text-lg">{user?.name}</h5>
          <p className="text-xs font-medium md:text-sm">{date}</p>
        </div>
        <p className="text-lg font-medium">{body}</p>
      </div>
    </div>
  );
}

export default Message;
