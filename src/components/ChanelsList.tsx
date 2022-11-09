import { Channel } from "@prisma/client";
import React from "react";
import ChanelCard from "./ChanelCard";

function ChanelsList({
  channels,
  setShowAllChannels,
  loading,
}: {
  channels: Channel[] | null | undefined;
  setShowAllChannels: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col space-y-6">
      {/* {loading ? (Array(4).map(_ => <))} */}
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
