import React from "react";

function TitleSceleton({ className }: { className?: string }) {
  return (
    <div
      className={`${className} my-2 h-6 w-32 animate-pulse rounded-lg bg-slate-800`}
    ></div>
  );
}

export default TitleSceleton;
