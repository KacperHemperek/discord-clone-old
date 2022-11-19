import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";

import {
  MdClose,
  MdChevronLeft,
  MdAdd,
  MdSearch,
  MdExpandMore,
  MdAccountCircle,
  MdLogout,
} from "react-icons/md";

import useNav from "@hooks/useNav";
import useAuth from "@hooks/useAuth";
import useOnClickOutside from "@hooks/useClickOutside";
import { trpc } from "@utils/trpc";
import ChanelsList from "@components/ChanelsList";
import AddChatModal from "@components/AddChatModal";
import ChannelDescriptionSceleton from "@components/Sceletons/ChannelDescriptionSceleton";
import Overlay from "@components/Overlay";
import Title from "@components/Title";
import TitleSceleton from "@components/Sceletons/TitleSceleton";
import UserCard from "@components/UserCard";
import UserCardSkeleton from "@components/Sceletons/UserCardSkeleton";
import UserList from "@components/UserList";

function NavBar() {
  const { navOpen, setNav, channelId } = useNav();
  const { logOut, currentUser, loadingUser } = useAuth();

  const router = useRouter();

  const [showAllChannels, setShowAllChannels] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [search, setSearch] = useState("");

  const { data: channels, isLoading: loadingChannels } =
    trpc.channel.getChannels.useQuery();

  const { data: users, isLoading: loadingUsers } =
    trpc.channel.getUsers.useQuery({ id: channelId });

  const { data: currentChannel, isLoading: loadingCurrentChannel } =
    trpc.channel.getChannelById.useQuery({ id: channelId });

  const hideMenu = useCallback(() => {
    setShowAccountMenu(false);
  }, []);

  const closeNav = useCallback(() => {
    setNav(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const menuRef = useRef<null | HTMLDivElement>(null);
  const buttonRef = useRef<null | HTMLButtonElement>(null);
  useOnClickOutside(menuRef, hideMenu, buttonRef);

  const searchResults = useMemo(() => {
    return channels?.filter((item) => {
      const regex = new RegExp(search.trim(), "gi");
      return item.name.toLowerCase().match(regex);
    });
  }, [search, channels]);

  useEffect(() => {
    setShowAllChannels(false);
  }, [router.asPath]);

  const passSetModal = useCallback(
    (value: boolean) => setModalOpen(value),
    [modalOpen]
  );

  const closeButton = (
    <button
      onClick={() => setNav(false)}
      className="btn absolute -right-11 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-brandgray-400 p-0 lg:hidden"
    >
      <MdClose className="h-6 w-6" />
    </button>
  );

  return (
    <>
      <Overlay onClick={closeNav} show={navOpen && !modalOpen} />
      <Overlay onClick={closeModal} show={modalOpen} className="z-30" />
      <div
        className={`${
          navOpen ? "-translate-x-0" : "-translate-x-[115%] lg:-translate-x-0"
        } fixed left-0 z-20 flex h-screen w-80 min-w-[320px] flex-col bg-brandgray-400 transition lg:static`}
      >
        {/* Header of Navbar */}
        {showAllChannels ? (
          <div className="relative flex min-h-[64px] items-center justify-between bg-brandgray-400 pl-8 pr-6 shadow-md">
            <h1 className="text-lg font-bold ">Channels</h1>
            <button
              onClick={() => {
                setModalOpen(true);
              }}
              className=" flex h-8 w-8 items-center justify-center rounded-md bg-brandgray-300"
            >
              <MdAdd className="h-6 w-6" />
            </button>
            {closeButton}
          </div>
        ) : (
          <div className="relative flex min-h-[64px] items-center space-x-2 px-5 shadow-md">
            <button
              onClick={() => setShowAllChannels(true)}
              className="btn flex h-9 w-9 items-center justify-center  bg-brandgray-400 p-0"
            >
              <MdChevronLeft className="h-full w-full" />
            </button>
            <h1 className="text-lg font-bold ">All Channels</h1>
            {closeButton}
          </div>
        )}
        <div className="flex h-full flex-col justify-between ">
          <div className="px-8 py-6">
            {showAllChannels ? (
              <>
                {/* Search Bar */}
                <div className="mb-8 flex items-center rounded-md bg-brandgray-200 py-4 px-3 outline-2 outline-brandblue">
                  <MdSearch className="h-5 w-5" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="flex-1 bg-transparent pl-2 outline-none placeholder:text-brandgray-100"
                    placeholder={"Search"}
                  />
                </div>
                {/* Chat List */}

                <ChanelsList
                  setShowAllChannels={() => setShowAllChannels(false)}
                  channels={searchResults}
                />
              </>
            ) : (
              <>
                {!currentChannel && loadingCurrentChannel ? (
                  <>
                    <TitleSceleton className="mb-5" />
                    <ChannelDescriptionSceleton />
                    <TitleSceleton className="mb-5 w-32" />
                  </>
                ) : (
                  <>
                    <Title
                      title={currentChannel?.name ?? ""}
                      className="mb-5"
                    />
                    <p className="mb-10">{currentChannel?.desc ?? ""}</p>
                    <Title title="Members" className="mb-5" />
                  </>
                )}

                <UserList loading={loadingUsers} users={users} />
              </>
            )}
          </div>
          {/* User Account */}
          <div className="flex justify-between bg-brandgray-500 px-10 py-5">
            {loadingUser || !currentUser ? (
              <UserCardSkeleton />
            ) : (
              <UserCard name={currentUser?.name || "Guest"} />
            )}
            <div className="relative flex">
              {/* Floating Menu */}
              <div
                ref={menuRef}
                className={`${
                  showAccountMenu
                    ? "opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                } absolute bottom-full right-0 flex w-48 flex-col space-y-2 rounded-md  border border-brandgray-100 bg-brandgray-300 p-3 transition`}
              >
                <button className=" flex items-center rounded-md p-3 transition hover:bg-brandgray-200">
                  <MdAccountCircle className="mr-2 h-5 w-5 text-brandwhite" />
                  <p className="text-xs font-medium">Account</p>
                </button>
                <button
                  onClick={logOut}
                  className=" flex items-center rounded-md p-3 transition hover:bg-brandgray-200"
                >
                  <MdLogout className="mr-2 h-5 w-5 text-red-500" />
                  <p className="text-xs font-medium text-red-500">Logout</p>
                </button>
              </div>
              <button
                onClick={() => setShowAccountMenu((prev) => !prev)}
                ref={buttonRef}
              >
                <MdExpandMore className="h-5 w-5 text-brandwhite" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal to create new Chat */}
      {modalOpen && <AddChatModal setModalOpen={passSetModal} />}
    </>
  );
}

export default NavBar;
