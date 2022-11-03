import React from "react";

function Overlay({ show, className }: { show: boolean; className: string }) {
  return (
    <div
      className={`${
        show ? "opacity-100 " : "hidden opacity-0"
      } ${className} fixed h-full w-screen bg-black/60 transition`}
    ></div>
  );
}

export default Overlay;
