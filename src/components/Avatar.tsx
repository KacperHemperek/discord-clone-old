import Image from "next/image";
import React from "react";

function Avatar({ avatar }: { avatar: string }) {
  return (
    <div className="relative mr-4 h-10 w-10 overflow-hidden rounded-md">
      <Image src={avatar} alt={"avatar image"} layout={"fill"} />
    </div>
  );
}

export default Avatar;
