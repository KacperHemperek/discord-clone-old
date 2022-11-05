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
        show ? "opacity-100 " : "hidden opacity-0"
      } ${className} fixed h-full w-screen bg-black/60 transition`}
    ></div>
  );
}

export default Overlay;
