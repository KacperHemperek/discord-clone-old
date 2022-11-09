import React from "react";

function UserCardSkeleton() {
  return (
    <div className="flex w-full items-center">
      <div className="relative mr-4 h-10 w-10 animate-pulse overflow-hidden rounded-md bg-slate-800"></div>
      <div className=" h-4 w-4/5 animate-pulse rounded-lg bg-slate-800" />
    </div>
  );
}

export default UserCardSkeleton;
