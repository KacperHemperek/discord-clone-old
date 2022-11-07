import React from "react";

function AddChatModal() {
  return (
    <div className="ld:w-[650px] fixed top-1/2 left-1/2 z-50 flex w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-brandgray-400 py-4 px-5 shadow-xl md:w-[500px] md:py-8 md:px-10">
      <h1 className="mb-6 font-bold uppercase">new channle</h1>
      <input
        type="text"
        className="input mb-4 md:mb-6"
        placeholder={"Channel Name"}
      />
      <textarea
        rows={4}
        className="input mb-4 resize-none md:mb-6"
        placeholder={"Channel Description"}
      />
      <button className="btn self-end">Save</button>
    </div>
  );
}

export default AddChatModal;
