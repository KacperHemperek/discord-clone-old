import React, { useState } from "react";

import { MdClose, MdChevronLeft, MdAdd, MdSearch } from "react-icons/md";
import useNav from "../hooks/useNav";
import ChanelsList from "./ChanelsList";
import Overlay from "./Overlay";

function NavBar() {
  const { navOpen, setNav } = useNav();
  const [showAllChannels, setShowAllChannels] = useState(true);

  const closeButton = (
    <button
      onClick={() => setNav(false)}
      className="btn absolute -right-11 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-brandgray-500 p-0 lg:hidden"
    >
      <MdClose className="h-6 w-6" />
    </button>
  );

  const mockChannels: { title: string; id: number }[] = [
    {
      title: "Front-end Developers",
      id: 0,
    },
    { title: "Backend", id: 1 },
    { title: "Welcome", id: 2 },
  ];

  return (
    <>
      <Overlay onClick={() => setNav(false)} show={navOpen} />
      <div
        className={`${
          navOpen ? "-translate-x-0" : "-translate-x-[115%] lg:-translate-x-0"
        } fixed left-0 z-50 flex h-screen w-80 flex-col bg-brandgray-500 transition lg:static`}
      >
        {/* Header of Navbar */}
        {showAllChannels ? (
          <div className="relative flex h-16 items-center justify-between pl-8 pr-6 shadow-md">
            <h1 className="text-lg font-bold ">Channels</h1>
            <button className=" flex h-8 w-8 items-center justify-center rounded-md bg-brandgray-300">
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
            {/* Search Bar */}
            {/* Chat List */}
            {showAllChannels ? (
              <>
                <div className="mb-8 flex items-center rounded-md bg-brandgray-200 py-4 px-3 outline-2 outline-brandblue">
                  <MdSearch className="h-5 w-5" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent pl-2 outline-none placeholder:text-brandgray-100"
                    placeholder={"Search"}
                  />
                </div>
                <ChanelsList channels={mockChannels} />
              </>
            ) : (
              <div>lol</div>
            )}
          </div>
          {/* User Account */}
          <div className=""></div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
