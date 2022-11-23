import React from "react";

import { User } from "@prisma/client";

import UserCard from "@components/UserCard";
import UserCardSkeleton from "@components/Sceletons/UserCardSkeleton";

function UserList({
  users,
  loading,
}: {
  users: User[] | null | undefined;
  loading: boolean;
}) {
  return (
    <div className="custom-scroll flex w-full flex-grow flex-col space-y-6 overflow-y-scroll">
      {loading
        ? [...Array(6)].map((_, idx) => <UserCardSkeleton key={idx} />)
        : users?.map((user) => (
            <UserCard name={user.name} key={user.name + user.id} />
          ))}
    </div>
  );
}

export default UserList;
