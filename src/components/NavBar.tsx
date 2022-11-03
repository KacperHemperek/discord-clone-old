import React from "react";

import { MdClose } from "react-icons/md";

function NavBar() {
  return (
    <div className="fixed left-0 flex h-screen w-80 -translate-x-[115%] flex-col bg-brandgray-500">
      <div className="relative flex h-16 space-x-4 p-5 shadow-md">
        <button className="btn h-8 w-8  bg-brandgray-300"></button>
        <button className="btn h-8 w-8  bg-brandgray-300"></button>
        <button className="btn  absolute -right-11 top-3 flex h-10 w-10 items-center justify-center bg-brandgray-500 p-0">
          <MdClose className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default NavBar;
