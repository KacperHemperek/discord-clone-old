import React, { useEffect, useState } from "react";

import useAuth from "@hooks/useAuth";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ModalContainer from "./ModalContainer";

function AddChatModal({
  setModalOpen,
}: {
  setModalOpen: (value: boolean) => void;
}) {
  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const { currentUser } = useAuth();
  const router = useRouter();

  const {
    mutate: createChannel,
    data,
    error,
    isLoading,
  } = trpc.channel.createChannel.useMutation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createChannel({
      desc: channelDesc,
      name: channelName,
      userId: currentUser?.id ?? null,
    });
  }

  useEffect(() => {
    if (!isLoading && data) {
      toast.success(`Channel ${data.name} was successfully created`);

      router.push(`/${data.id}`);
      setModalOpen(false);
      return;
    }
    if (error) {
      toast.error("Could't create channel");
      setModalOpen(false);
    }
  }, [isLoading, data, error]);

  return (
    <ModalContainer isForm handleSubmit={handleSubmit}>
      <h1 className="mb-6 font-bold uppercase">new channle</h1>
      <input
        type="text"
        className="input mb-4 md:mb-6"
        placeholder={"Channel Name"}
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        />
      <textarea
        rows={4}
        className="input mb-4 resize-none md:mb-6"
        placeholder={"Channel Description"}
        value={channelDesc}
        onChange={(e) => setChannelDesc(e.target.value)}
      />
      <button type="submit" className="btn self-end">
        Save
      </button>
    </ModalContainer>
  );
}

export default AddChatModal;
