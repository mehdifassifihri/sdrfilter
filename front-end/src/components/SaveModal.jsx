import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const SaveModal = ({ show, setShow, saveFilters }) => {
  const [filterDescription, setFilterDescription] = useState("");

  const animation = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(-50px)",
  });

  const handleSaveClick = () => {
    saveFilters(filterDescription);
    setShow(false);
  };
  return (
    show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <animated.div
          style={animation}
          className="bg-white p-6 w-96 rounded-lg shadow-lg flex flex-col gap-3"
        >
          <p className="text-2xl font-bold">Save Filters</p>
          <input
            value={filterDescription}
            onChange={(e) => setFilterDescription(e.target.value)}
            className="w-full p-4 border outline-none"
            placeholder="Filters Description"
            type="text"
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setShow(false)}
              className="w-full bg-red-600 text-sm font-bold text-white p-4 rounded-md hover:opacity-85"
            >
              Close
            </button>
            <button
              onClick={handleSaveClick}
              className="w-full bg-cyan-600 text-sm font-bold text-white p-4 rounded-md hover:opacity-85"
            >
              Save Filter
            </button>
          </div>
        </animated.div>
      </div>
    )
  );
};

export default SaveModal;
