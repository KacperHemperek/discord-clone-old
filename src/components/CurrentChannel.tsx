import React from "react";

import ChannelDescriptionSceleton from "./Sceletons/ChannelDescriptionSceleton";
import TitleSceleton from "./Sceletons/TitleSceleton";
import Title from "./Title";
import UserList from "./UserList";
import { trpc } from "@utils/trpc";

function CurrentChannel({ channelId }: { channelId: number | null }) {
  const { data: users, isLoading: loadingUsers } =
    trpc.channel.getUsers.useQuery({ id: channelId });

  const { data: currentChannel, isLoading: loadingCurrentChannel } =
    trpc.channel.getChannelById.useQuery({ id: channelId });

  return loadingCurrentChannel ? (
    <>
      <TitleSceleton className="mb-5" />
      <ChannelDescriptionSceleton />
      <TitleSceleton className="mb-5 w-32" />
    </>
  ) : (
    <>
      <Title title={currentChannel?.name ?? ""} className="mb-5" />
      <p className="mb-10">{currentChannel?.desc ?? ""}</p>
      <Title title="Members" className="mb-5" />
      <UserList loading={loadingUsers} users={users} />
    </>
  );
}

export default CurrentChannel;
