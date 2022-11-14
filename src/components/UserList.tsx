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
    <div className="flex flex-col space-y-6">
      {loading
        ? [...Array(4)].map((_, idx) => <UserCardSkeleton key={idx} />)
        : users?.map((user) => (
            <UserCard name={user.name} key={user.name + user.id} />
          ))}
    </div>
  );
}

export default UserList;
