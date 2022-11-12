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
      } ${className} fixed h-screen w-screen bg-black/40 transition duration-300`}
    ></div>
  );
}

export default Overlay;
