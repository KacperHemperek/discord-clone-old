import React from "react";

function ChannelDescriptionSceleton() {
  const lineStyle = " bg-slate-800 h-4 mb-3 rounded-lg animate-pulse ";

  return (
    <div className="flex w-full flex-col">
      <span className={lineStyle + "w-full"}></span>
      <span className={lineStyle + "w-full"}></span>
      <span className={lineStyle + "w-4/5"}></span>
      <span className={lineStyle + "w-3/4"}></span>
    </div>
  );
}

export default ChannelDescriptionSceleton;
