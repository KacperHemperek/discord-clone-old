import React, { useMemo, useState } from "react";

import { MdClose, MdChevronLeft, MdAdd, MdSearch } from "react-icons/md";
import useNav from "../hooks/useNav";
import ChanelsList from "./ChanelsList";
import Overlay from "./Overlay";

function NavBar() {
  const { navOpen, setNav } = useNav();
  const [showAllChannels, setShowAllChannels] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);
  const [search, setSearch] = useState("");
  const mockChannels: { title: string; id: number }[] = [
    {
      title: "Front-end Developers",
      id: 0,
    },
    { title: "Backend", id: 1 },
    { title: "Welcome", id: 2 },
  ];
  const searchResults = useMemo(() => {
    if (search.trim() === "") return null;
    return mockChannels.filter((item) => {
      const regex = new RegExp(search, "gi");
      return item.title.toLowerCase().match(regex);
    });
  }, [search]);

  const closeButton = (
    <button
      onClick={() => setNav(false)}
      className="btn absolute -right-11 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-brandgray-500 p-0 lg:hidden"
    >
      <MdClose className="h-6 w-6" />
    </button>
  );

  return (
    <>
      <Overlay onClick={() => setNav(false)} show={navOpen && !modalOpen} />
      <Overlay
        onClick={() => setModalOpen(false)}
        show={modalOpen}
        className="z-30"
      />
      <div
        className={`${
          navOpen ? "-translate-x-0" : "-translate-x-[115%] lg:-translate-x-0"
        } fixed left-0 z-20 flex h-screen w-80 flex-col bg-brandgray-500 transition lg:static`}
      >
        {/* Header of Navbar */}
        {showAllChannels ? (
          <div className="relative flex h-16 items-center justify-between pl-8 pr-6 shadow-md">
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
          <div className="relative flex h-16 items-center space-x-2 px-5 shadow-md">
            <button className="btn flex h-9 w-9 items-center justify-center  bg-brandgray-500 p-0">
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
                <ChanelsList channels={searchResults ?? mockChannels} />
              </>
            ) : (
              <div>lol</div>
            )}
          </div>
          {/* User Account */}
          <div className=""></div>
        </div>
      </div>
      {/* Modal to create new Chat */}
      {modalOpen && (
        <div className="ld:w-[650px] fixed top-1/2 left-1/2 z-50 flex w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-brandgray-500 py-4 px-5 shadow-xl md:w-[500px] md:py-8 md:px-10">
          <h1 className="mb-6 font-bold uppercase">new channle</h1>
          <input
            type="text"
            className="input mb-4 md:mb-6"
            placeholder={"Channel Name"}
          />
          <textarea
            rows={4}
            className="input mb-4 resize-none md:mb-6"
            placeholder={"Channel Name"}
          />
          <button className="btn self-end">Save</button>
        </div>
      )}
    </>
  );
}

export default NavBar;
