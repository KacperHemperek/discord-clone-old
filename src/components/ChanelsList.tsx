import React from "react";

import { Channel } from "@prisma/client";

import ChanelCard from "@components/ChanelCard";

function ChanelsList({
  channels,
  setShowAllChannels,
}: {
  channels: Channel[] | null | undefined;
  setShowAllChannels: () => void;
}) {
  return (
    <div className="custom-scroll flex flex-col space-y-6 overflow-y-scroll">
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
