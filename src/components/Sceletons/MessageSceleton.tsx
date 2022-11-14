import React from "react";

function MessageSceleton() {
  return (
    <div className="my-4 flex w-full">
      <div className="mr-4 h-10 w-10 animate-pulse rounded-md bg-slate-700"></div>
      <div className=" flex-grow ">
        <div className="mb-1 flex items-center space-x-8 text-brandgray-100">
          <span className="my-1 h-4 w-36 animate-pulse rounded-lg bg-slate-700 md:my-[5px] md:h-[18px] "></span>
          <span className="my-[2px] h-3 w-24 animate-pulse rounded-lg bg-slate-700 md:my-[3px] md:h-[14px] "></span>
        </div>
        <div className="flex w-full flex-col">
          <span className="my-[5px] h-[18px] w-full animate-pulse rounded-lg bg-slate-700"></span>
          <span className="my-[5px] h-[18px] w-5/6 animate-pulse rounded-lg bg-slate-700"></span>
        </div>
      </div>
    </div>
  );
}

export default MessageSceleton;
