import React, { PropsWithChildren } from "react";

interface ModalContainerProps extends PropsWithChildren {
  handleSubmit?: (e: React.FormEvent) => void;
  isForm?: boolean;
}

function ModalContainer({
  children,
  handleSubmit = (e: React.FormEvent) => e.preventDefault(),
  isForm = false,
}: ModalContainerProps) {
  return isForm ? (
    <form
      onSubmit={handleSubmit}
      className="ld:w-[650px] fixed top-1/2 left-1/2 z-50 flex w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-brandgray-400 py-4 px-5 shadow-xl md:w-[500px] md:py-8 md:px-10"
    >
      {children}
    </form>
  ) :  (
    <div className="ld:w-[650px] fixed top-1/2 left-1/2 z-50 flex w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-brandgray-400 py-4 px-5 shadow-xl md:w-[500px] md:py-8 md:px-10">
      {children}
    </div>
  );
}

export default ModalContainer;
