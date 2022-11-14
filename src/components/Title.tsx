import React from "react";

function Title({ title, className }: { title: string; className?: string }) {
  return (
    <h1 className={`${className} text-lg font-bold uppercase`}>{title}</h1>
  );
}

export default Title;
