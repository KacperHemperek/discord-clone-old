import Image from "next/image";
import React, { useState } from "react";
import ModalContainer from "./ModalContainer";

import AvatarPlaceholder from "@assets/avatar-image.png";
import useAuth from "@hooks/useAuth";
import { MdEdit } from "react-icons/md";

function AccountDetails() {
  const { currentUser } = useAuth();
  const [nameVal, setNameVal] = useState("");
  const [editProfile, setEditProfile] = useState(false);

  return (
    <ModalContainer>
      <div className=" flex justify-between align-top">
        <div
          className={
            "relative mb-4 h-24 w-24 overflow-hidden rounded-lg bg-brandgray-200 "
          }
        >
          <Image
            src={AvatarPlaceholder}
            alt={"current avatar image "}
            layout={"fill"}
            className={"object-cover"}
          />
        </div>
        {!editProfile && (
          <button
            onClick={() => setEditProfile(true)}
            className=" h-min w-min p-2 "
          >
            <MdEdit className="h-6 w-6" />
          </button>
        )}
      </div>
      <label className="mb-5 max-w-fit cursor-pointer hover:underline">
        Change photo
        <input
          type="file"
          onChange={() => {}}
          className="hidden"
          accept="image/*"
        />
      </label>
      <input
        className={`${
          editProfile ? "cursor-auto" : "cursor-not-allowed"
        } input`}
        placeholder={"Name"}
        value={!editProfile ? currentUser?.name : nameVal}
        onChange={(e) => {
          setNameVal(e.target.value);
        }}
        disabled={!editProfile}
      />
      {editProfile && (
        <div className="flex w-fit space-x-4 self-end">
          <button
            onClick={() => setEditProfile(false)}
            className="btn bg-red-500"
          >
            Discard
          </button>
          <button className="btn max-w-fit ">Save</button>
        </div>
      )}
    </ModalContainer>
  );
}

export default AccountDetails;
