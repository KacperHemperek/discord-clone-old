import React from "react";

import { User } from "@prisma/client";

import Avatar from "@components/Avatar";
import { getDaysAgo } from "@helpers/date";
import PlaceholderAvatar from "@assets/avatar-image.png";
import { MdCheck } from "react-icons/md";

export type MessageProps = {
  user: User;
  body: string;
  createdAt: Date;
  sent?: boolean;
};

function Message({ body, createdAt, user, sent }: MessageProps) {
  const date = getDaysAgo(createdAt);

  return (
    <div className="my-4 flex w-full items-center ">
      <div>
        <Avatar avatar={user?.avatar ?? PlaceholderAvatar} />
      </div>
      <div className=" flex-grow ">
        <div className="mb-1 flex items-center text-brandgray-100">
          <div className="mr-6 flex flex-col md:flex-row md:items-center md:space-x-6">
            <h5 className=" font-bold md:text-lg">{user?.name}</h5>
            <p className="text-xs font-medium md:text-sm">{date}</p>
          </div>
          {sent && (
            <div className={`flex items-center space-x-2`}>
              <p className="hidden text-sm font-medium md:block">sent</p>
              <MdCheck className="h-4 w-4 text-brandgray-100" />
            </div>
          )}
        </div>
        <p className="text-lg font-medium">{body}</p>
      </div>
    </div>
  );
}

export default Message;
