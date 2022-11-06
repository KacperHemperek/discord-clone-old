import Image from "next/image";
import React from "react";

function UserCard({
  name,
  avatar = "https://i.pravatar.cc/400",
}: {
  name: string;
  avatar?: string;
}) {
  return (
    <div className=" flex items-center">
      <div className="relative mr-4 h-10 w-10 overflow-hidden rounded-md">
        <Image src={avatar} alt={"avatar image"} layout={"fill"} />
      </div>
      <p className="truncate whitespace-nowrap font-bold text-brandgray-100">
        {name}
      </p>
    </div>
  );
}

export default UserCard;
