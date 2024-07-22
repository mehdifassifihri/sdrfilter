import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  return (
    <div>
      <p className="text-3xl font-bold">Profile Management</p>
      <div className="w-full bg-white mt-5 rounded-md p-7 flex gap-5">
        <div className="flex flex-col gap-5">
          <input
            placeholder="First Name"
            className="p-3 border border-gray-400 rounded-md"
            type="text"
          />
          <input
            placeholder="Last Name"
            className="p-3 border border-gray-400 rounded-md"
            type="text"
          />
          <input
            placeholder="Username"
            className="p-3 border border-gray-400 rounded-md"
            type="text"
          />
          <select
            disabled
            className="p-3 border rounded-md border-gray-400 cursor-not-allowed"
            name=""
            id=""
          >
            <option>Roles</option>
          </select>
        </div>
        <div className="flex flex-col gap-5">
          <input
            placeholder="Email"
            className="p-3 border border-gray-400 rounded-md"
            type="text"
          />
          <input
            placeholder="Password"
            className="p-3 border border-gray-400 rounded-md"
            type="text"
          />
          <input
            placeholder="Confirm your password"
            className="p-3 border border-gray-400 rounded-md"
            type="text"
          />
          <button className="p-4 bg-cyan-500 text-white text-sm rounded-md">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
