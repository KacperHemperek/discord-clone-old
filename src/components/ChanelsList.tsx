import { User } from "@prisma/client";
import React from "react";
import ChanelCard, { ChanelCardProps } from "./ChanelCard";

function ChanelsList({
  channels,
  setShowAllChannels,
}: {
  channels: {
    title: string;
    id: number;
    description?: string | undefined;
    users?: User[] | undefined;
  }[];
  setShowAllChannels: () => void;
}) {
  return (
    <div className="flex flex-col space-y-6">
      {channels.map((item) => (
        <ChanelCard
          onClick={setShowAllChannels}
          key={item.id}
          id={item.id}
          title={item.title}
        />
      ))}
    </div>
  );
}

export default ChanelsList;
