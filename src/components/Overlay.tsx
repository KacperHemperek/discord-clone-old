import React from "react";

function Overlay({
  show,
  onClick,
  className,
}: {
  show: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`${
        show ? "opacity-100 " : "pointer-events-none opacity-0"
      } ${className} fixed h-full w-screen bg-black/60 transition duration-300`}
    ></div>
  );
}

export default Overlay;
