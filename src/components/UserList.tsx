import { User } from "@prisma/client";
import React from "react";
import UserCard from "./UserCard";

function UserList({
  users,
}: {
  users: { name: string; email: string; id: number }[];
}) {
  return <div className="flex flex-col space-y-6">
  {users.map((user) => (
    <UserCard name={user.name} />
  ))}
</div>
}

export default UserList;
