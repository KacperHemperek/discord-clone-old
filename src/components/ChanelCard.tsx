import Link from "next/link";
import React from "react";
import useNav from "../hooks/useNav";

export interface ChanelCardProps {
  name: string;
  id: number;
  onClick: () => void;
}

function ChanelCard({
  id,
  name,
  onClick: setShowAllChannels,
}: ChanelCardProps) {
  function getShort() {
    return name
      .split(" ")
      .map((item, index) => {
        return index < 2 ? item[0] : "";
      })
      .join("");
  }

  return (
    <Link href={`/${id}`}>
      <div
        onClick={setShowAllChannels}
        className="flex cursor-pointer items-center uppercase"
      >
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-brandgray-300 font-semibold">
          {getShort()}
        </div>
        <h3 className="flex-1 truncate whitespace-nowrap  text-lg font-bold">
          {name}
        </h3>
      </div>
    </Link>
  );
}

export default ChanelCard;
