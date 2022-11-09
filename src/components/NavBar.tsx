import { User } from "@prisma/client";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MdClose,
  MdChevronLeft,
  MdAdd,
  MdSearch,
  MdExpandMore,
  MdAccountCircle,
  MdLogout,
} from "react-icons/md";
import { useOnClickOutside } from "../hooks/useClickOutside";
import useNav from "../hooks/useNav";
import AddChatModal from "./AddChatModal";
import ChanelsList from "./ChanelsList";
import Overlay from "./Overlay";
import UserCard from "./UserCard";
import UserList from "./UserList";
import { useAuth } from "./UserProvider";

function NavBar() {
  const { navOpen, setNav, channelId } = useNav();
  const { logOut } = useAuth();
  const [showAllChannels, setShowAllChannels] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();

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

  const mockChannels: {
    title: string;
    id: number;
    description?: string;
    users?: User[];
  }[] = [
    {
      title: "Front-end Developers",
      id: 0,
    },
    {
      title: "Backend",
      id: 1,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora et est distinctio, dolores excepturi itaque dolor quisquam magnam possimus laborum!",
      users: [
        { name: "Kacper Hemperek", email: "kacper@hemperek.com", id: 1 },
        { name: "Martyna", email: "martyna@maruda.com", id: 2 },
        { name: "Aleksander", email: "aleksander@example.com", id: 3 },
      ],
    },
    {
      title: "Welcome",
      id: 2,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora et est distinctio, dolores excepturi itaque ",
      users: [
        { name: "Kacper Hemperek", email: "kacper@hemperek.com", id: 1 },
        {
          name: "Martyna",
          email: "martyna@maruda.com",
          id: 2,
        },
      ],
    },
  ];

  const searchResults = useMemo(() => {
    return mockChannels.filter((item) => {
      const regex = new RegExp(search.trim(), "gi");
      return item.title.toLowerCase().match(regex);
    });
  }, [search]);

  useEffect(() => {
    setShowAllChannels(false);
  }, [router.asPath]);

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
                <h2 className="mb-5 text-lg font-bold uppercase text-brandwhite">
                  Channel Name
                </h2>
                <p className="mb-10">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Commodi cumque repellendus repudiandae suscipit dignissimos
                  porro saepe voluptas ratione quam voluptate.
                </p>
                <h2 className="mb-5 text-lg font-bold uppercase text-brandwhite">
                  Members
                </h2>
                {/* change hardcoded channels to the channel that is now selected */}
                <UserList
                  users={
                    mockChannels.filter(
                      (channel) => channel.id === channelId
                    )[0]?.users ?? []
                  }
                />
              </>
            )}
          </div>
          {/* User Account */}
          <div className="flex justify-between bg-brandgray-500 px-10 py-5">
            <UserCard name={currentUser?.name || "Guest"} />
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
      {modalOpen && <AddChatModal />}
    </>
  );
}

export default NavBar;
