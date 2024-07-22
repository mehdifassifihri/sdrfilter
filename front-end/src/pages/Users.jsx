import React, { useState } from "react";
import { Table } from "antd";
import Modal from "../components/Modal";
import UsersLogo from "../assets/usersss.png";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../utils/fn";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const columns = [
    { title: "Nom", dataIndex: "nom", key: "firstName" },
    { title: "Prenom", dataIndex: "prenom", key: "lastName" },
    { title: "Username", dataIndex: "username", key: "username" },
    {
      title: "Role",
      dataIndex: ["role", "name"],
      key: "name",
    },
  ];

  const userQuery = useQuery({
    queryFn: () => fetchUsers(),
    queryKey: ["users"],
    enabled: true,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">User Management</p>
        <button
          onClick={() => setShowModal(true)}
          className=" bg-cyan-600 px-6 py-3 text-white rounded-md font-bold"
        >
          Add User
        </button>
      </div>
      <div className="flex mt-3">
        <div className="bg-white w-48 p-3 rounded-md flex items-end justify-between">
          <div className="flex flex-col justify-center">
            <img className="w-8" src={UsersLogo} alt="" />
            <p className="text-lg font-bold">Users</p>
          </div>
          <p className="font-bold text-lg">12</p>
        </div>
      </div>
      <Table
        className="text-xs overflow-scroll bg-white rounded-md mt-5"
        columns={columns}
        dataSource={userQuery?.data}
      />
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Users;
