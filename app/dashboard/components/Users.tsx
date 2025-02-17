import React from "react";
import { PiLetterCircleVBold } from "react-icons/pi";
import { TbCircleLetterB } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

const Users = () => {
  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl border-b border-b-black font-extrabold">
          Users
        </h1>
      </div>
      <div className="flex justify-between my-8">
        <div className="rounded-md bg-gradient-to-r from-blue-500 to-blue-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <PiLetterCircleVBold size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">50</h1>
            <h4 className="capitalize text-white">No of vybers</h4>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-r from-orange-500 to-orange-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <TbCircleLetterB size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">90</h1>
            <h4 className="capitalize text-white">No of baddies</h4>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-r from-red-500 to-red-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <FaUsers size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">140</h1>
            <h4 className="capitalize text-white">Total No of users</h4>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-r from-green-500 to-green-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <FaUserAlt size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">120</h1>
            <h4 className="capitalize text-white">Active users</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
