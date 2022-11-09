import { User } from "@prisma/client";
import React from "react";
import UserCard from "./UserCard";

function UserList({ users }: { users: User[] | null | undefined }) {
  return (
    <div className="flex flex-col space-y-6">
      {users?.map((user) => (
        <UserCard name={user.name} key={user.name + user.id} />
      ))}
    </div>
  );
}

export default UserList;
