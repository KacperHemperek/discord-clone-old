import React, { useState } from "react";

import { MdClose, MdChevronLeft } from "react-icons/md";
import useNav from "../hooks/useNav";
import Overlay from "./Overlay";

function NavBar() {
  const { navOpen, setNav } = useNav();

  return (
    <>
      <Overlay show={navOpen} className={""} />
      <div
        className={`${
          navOpen ? "-translate-x-0" : "-translate-x-[115%] lg:-translate-x-0"
        } fixed left-0 z-50 flex h-screen w-80 flex-col bg-brandgray-500 transition lg:static`}
      >
        <div className="relative flex h-16 items-center  px-5 shadow-md">
          <button className="btn flex h-8 w-8 items-center justify-center  bg-brandgray-500 p-0  ">
            <MdChevronLeft className="h-8 w-8 " />
          </button>
          <button className="btn h-8 w-8 bg-brandgray-300"></button>
          <button
            onClick={() => setNav(false)}
            className="btn absolute -right-11 top-3 flex h-10 w-10 items-center justify-center bg-brandgray-500 p-0 lg:hidden"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar;
