import Image, { StaticImageData } from "next/image";
import React from "react";

function Avatar({ avatar }: { avatar: string | StaticImageData }) {
  return (
    <div className="relative mr-4 h-10 w-10 overflow-hidden rounded-md bg-brandgray-200">
      <Image src={avatar} alt={"avatar image"} layout={"fill"} />
    </div>
  );
}

export default Avatar;
