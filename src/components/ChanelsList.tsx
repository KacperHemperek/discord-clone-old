import { Channel, User } from "@prisma/client";
import React from "react";
import ChanelCard, { ChanelCardProps } from "./ChanelCard";

function ChanelsList({
  channels,
  setShowAllChannels,
}: {
  channels: Channel[] | null | undefined;
  setShowAllChannels: () => void;
}) {
  return (
    <div className="flex flex-col space-y-6">
      {channels?.map((item) => (
        <ChanelCard
          onClick={setShowAllChannels}
          key={item.id}
          id={item.id}
          name={item.name}
        />
      ))}
    </div>
  );
}

export default ChanelsList;
