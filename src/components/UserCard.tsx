import React from "react";

import Avatar from "@components/Avatar";
import PlaceholderAvatar from "@assets/avatar-image.png";
function UserCard({ name, avatar }: { name: string; avatar?: string | null }) {
  return (
    <div className=" flex items-center">
      <Avatar avatar={avatar ?? PlaceholderAvatar} />
      <p className="truncate whitespace-nowrap font-bold text-brandgray-100">
        {name}
      </p>
    </div>
  );
}

export default UserCard;
