import Image from "next/image";
import React from "react";
import Avatar from "../Avatar";

function UserCard({
  name,
  avatar = "https://i.pravatar.cc/400",
}: {
  name: string;
  avatar?: string;
}) {
  return (
    <div className=" flex items-center">
      <Avatar avatar={avatar} />
      <p className="truncate whitespace-nowrap font-bold text-brandgray-100">
        {name}
      </p>
    </div>
  );
}

export default UserCard;
