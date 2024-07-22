import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/UserSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const errorMessage = useSelector((state) => state.error);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-cover bg-[url('assets/loginbg.jpg')]">
      <div className="bg-white w-96 space-y-6 px-10 py-16 rounded-md">
        <div className="flex flex-col justify-center space-y-1">
          <div className="flex items-center">
            <img className="w-10" src={Logo} alt="Logo" />
            <p className="font-semibold ml-2">Connecter</p>
          </div>
          <p className="text-zinc-500 text-xs">
            Veuillez saisir votre login et password
          </p>
          <p className="text-red-500 text-xs">{errorMessage}</p>
        </div>
        <form className="space-y-3" action="">
          <input
            placeholder="Email"
            className="w-full py-4 px-3 rounded-md outline-none border border-gray-300 text-xs"
            onChange={handleUsername}
          />
          <input
            placeholder="Password"
            type="password"
            onChange={handlePassword}
            className="w-full py-4 px-3 rounded-md border-gray-300 outline-none border text-xs"
          />
        </form>
        <button
          onClick={handleSubmit}
          className="bg-cyan-600 w-full py-4 text-white text-xs rounded-md hover:opacity-90"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default Login;
