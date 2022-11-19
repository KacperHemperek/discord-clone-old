import React, { useEffect, useState } from "react";

import useAuth from "@hooks/useAuth";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

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
    <form
      onSubmit={handleSubmit}
      className="ld:w-[650px] fixed top-1/2 left-1/2 z-50 flex w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-brandgray-400 py-4 px-5 shadow-xl md:w-[500px] md:py-8 md:px-10"
    >
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
    </form>
  );
}

export default AddChatModal;
