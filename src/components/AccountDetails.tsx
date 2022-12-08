import Image from "next/image";
import React, { useCallback, useState } from "react";

import ModalContainer from "./ModalContainer";
import AvatarPlaceholder from "@assets/avatar-image.png";
import useAuth from "@hooks/useAuth";
import { MdEdit } from "react-icons/md";
import { trpc } from "@utils/trpc";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { usersStorage } from "@utils/firebase";

function AccountDetails() {
  const { currentUser } = useAuth();

  const [nameVal, setNameVal] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const { mutate: editUser } = trpc.user.editUser.useMutation();

  const photoUrl = newPhoto && URL.createObjectURL(newPhoto);

  const submitEditUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const newName = nameVal.trim() === "" ? null : nameVal;

      getFirebaseLink().then((photo) => {
        console.log(photo);
        editUser({
          name: newName,
          avatar: photo,
          userId: currentUser?.id ?? null,
        });
      });

      setNameVal(currentUser?.name ?? "");
    },
    [currentUser, nameVal]
  );

  const getFirebaseLink = useCallback(async () => {
    if (!newPhoto || !currentUser?.id) {
      return null;
    }
    const userImageRef = ref(
      usersStorage,
      `${currentUser?.id}/${newPhoto.name}`
    );

    await uploadBytes(userImageRef, newPhoto);

    const photoRef = ref(userImageRef);

    const photo = await getDownloadURL(photoRef);
    console.log(photo);

    return photo;
  }, [newPhoto, currentUser]);

  function onImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setNewPhoto(event.target.files[0]);
    }
  }
  //TODO: validate inputs edit user
  const displayContent = useCallback(() => {
    return editProfile ? (
      <>
        <label className="mb-5 max-w-fit cursor-pointer hover:underline">
          Change photo
          <input
            type="file"
            onChange={onImageChange}
            className="hidden"
            accept="image/*"
          />
        </label>

        <input
          className={"input"}
          placeholder={"Name"}
          value={nameVal}
          onChange={(e) => {
            setNameVal(e.target.value);
          }}
          disabled={!editProfile}
        />
        <div className="flex w-fit space-x-4 self-end">
          <button
            onClick={resetForm}
            className="btn bg-red-500 hover:bg-red-500/90"
          >
            Discard
          </button>
          <button type="submit" className="btn max-w-fit ">
            Save
          </button>
        </div>
      </>
    ) : (
      <>
        <div className="mb-6">
          <p className="text-sm  text-brandgray-200">Name</p>
          <h4 className="text-lg font-medium ">{currentUser?.name}</h4>
        </div>
        <div className="mb-6">
          <p className="text-sm  text-brandgray-200">Email</p>
          <h4 className="text-lg font-medium ">{currentUser?.email}</h4>
        </div>
      </>
    );
  }, [currentUser, editProfile]);

  function resetForm() {
    setEditProfile(false);
    setNameVal(currentUser?.name ?? "");
    setNewPhoto(null);
  }

  return (
    <ModalContainer isForm handleSubmit={submitEditUser}>
      <div className=" flex justify-between align-top">
        <div
          className={`${
            editProfile ? "mb-4" : "mb-8"
          } relative h-24 w-24 overflow-hidden rounded-lg bg-brandgray-200 `}
        >
          {/* FIXME: image is undefined */}
          <Image
            src={photoUrl ?? currentUser?.avatar ?? AvatarPlaceholder}
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
      {displayContent()}
    </ModalContainer>
  );
}

export default AccountDetails;
