import React, { useState } from "react";
import Remove from "../assets/remove.png";

const OneFilter = (props) => {
  const [isSelected, setSelected] = useState(false);
  return (
    <button
      onClick={() => setSelected(!isSelected)}
      className={`p-4 flex gap-3 items-center rounded-md justify-center text-sm${
        isSelected
          ? "text-white bg-orange-500 text-white"
          : "bg-white text-black border"
      }`}
    >
      {isSelected && <img className="w-5" src={Remove} alt="" />}
      <p className="font-bold">{props.title}</p>
    </button>
  );
};

export default OneFilter;
