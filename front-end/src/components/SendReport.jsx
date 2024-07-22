import React from "react";
import { useSpring, animated } from "@react-spring/web";

const SendReport = (show, setShow) => {
  const animation = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(-50px)",
  });
  const email = localStorage.getItem("userId");
  return (
    show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <animated.div
          style={animation}
          className="bg-white p-6 w-96 rounded-lg shadow-lg flex flex-col gap-3"
        >
          <p className="text-xl font-semibold">
            Voulez-vous vraiment envoyer un rapport dans votre boite e-mail{" "}
            {email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button className="w-full bg-red-600 text-sm font-bold text-white p-4 rounded-md hover:opacity-85">
              Close
            </button>
            <button className="w-full bg-cyan-600 text-sm font-bold text-white p-4 rounded-md hover:opacity-85">
              Save Filter
            </button>
          </div>
        </animated.div>
      </div>
    )
  );
};

export default SendReport;
