import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { nomsColonnesSM } from "../utils/colones";
import { Space, Table, Tag, Button, message } from "antd";
import OneFilter from "./OneFilter";
import RemoveGray from "../assets/greyremove.png";
import DoneW from "../assets/DoneWhite.png";

const FilterModal = ({
  showModal,
  setShowModal,
  selectedFilters,
  setSelectedFilters,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const animation = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? "translateY(0)" : "translateY(-50px)",
  });

  const handleFilterClick = () => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [title]: null,
    }));
    console.log("wefewfwfefe");
  };

  const warning = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const columnsName = nomsColonnesSM;

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
        {contextHolder}
        <animated.div
          style={animation}
          className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-3 mx-80"
        >
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">Selectionnez les filtres</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-zinc-200 rounded-md flex items-center justify-center"
              >
                <img className="w-4" src={RemoveGray} alt="" />
              </button>
              <button
                onClick={() => warning("Filter added !")}
                className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center"
              >
                <img className="w-4" src={DoneW} alt="" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {columnsName.map((field) => (
              <OneFilter onClick={handleFilterClick} title={field.title} />
            ))}
          </div>
        </animated.div>
      </div>
    )
  );
};

export default FilterModal;
