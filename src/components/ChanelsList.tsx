import React from "react";
import ChanelCard, { ChanelCardProps } from "./ChanelCard";

function ChanelsList({ channels }: { channels: ChanelCardProps[] }) {
  return (
    <div className="flex flex-col space-y-6">
      {channels.map((item) => (
        <ChanelCard key={item.id} {...item} />
      ))}
    </div>
  );
}

export default ChanelsList;
