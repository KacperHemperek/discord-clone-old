import Link from "next/link";
import React from "react";

export interface ChanelCardProps {
  title: string;
  id: number;
}

function ChanelCard({ id, title }: ChanelCardProps) {
  function getShort() {
    return title
      .split(" ")
      .map((item, index) => {
        return index < 2 ? item[0] : "";
      })
      .join("");
  }

  return (
    <Link href={`/${id}`}>
      <div className="flex cursor-pointer items-center uppercase">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-brandgray-300 font-semibold">
          {getShort()}
        </div>
        <h3 className="flex-1 truncate whitespace-nowrap  text-lg font-bold">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export default ChanelCard;
