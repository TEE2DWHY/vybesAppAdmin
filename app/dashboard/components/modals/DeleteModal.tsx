import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";

interface DeleteModalProps {
  componentName: string;
  hideDeleteModal: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  componentName,
  hideDeleteModal,
}) => {
  return (
    <>
      <div className="fixed z-50 w-full h-full bg-[#1b1b1b62] flex items-center justify-center">
        <div className="bg-white w-[32%] flex items-center flex-col rounded-2xl p-10 shadow-lg relative">
          <MdOutlineCancel
            size={18}
            className="absolute top-3 right-8 cursor-pointer"
            onClick={hideDeleteModal}
          />
          <RiDeleteBin6Line color="red" size={45} />
          <h1 className="text-2xl font-medium capitalize mt-5">
            Delete {componentName}
          </h1>
          <p className="text-[#8C8C8C]">
            Are you sure you want to delete this {componentName}?
          </p>
          <div className="flex items-center justify-between w-full mt-8">
            <button className="border-2 border-gray-500 bg-white py-3 px-10 rounded-lg text-gray-500 font-medium">
              No, Cancel
            </button>
            <button className="border-none bg-[#C03744] py-3 px-10 rounded-lg text-white font-medium">
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
