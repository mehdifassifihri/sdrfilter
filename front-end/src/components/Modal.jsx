import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Modal = ({ showModal, setShowModal }) => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});

  const animation = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? "translateY(0)" : "translateY(-50px)",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8083/role"); // Adjust the URL as needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8083/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowModal(false);
      // Optionally, you can handle additional logic after a successful POST request
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <animated.div
          style={animation}
          className="bg-white p-6 w-96 rounded-lg shadow-lg flex flex-col gap-3"
        >
          <h2 className="text-2xl font-semibold mb-4">Add User</h2>
          <input
            name="firstName"
            placeholder="First name"
            className="border p-3 text-sm rounded-md border-gray-400 outline-none"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
          <input
            name="lastName"
            placeholder="Last name"
            className="border p-3 text-sm rounded-md border-gray-400 outline-none"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
          <input
            name="username"
            placeholder="Username"
            className="border p-3 text-sm rounded-md border-gray-400 outline-none"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
          <input
            name="password"
            placeholder="Password"
            className="border p-3 text-sm rounded-md border-gray-400 outline-none"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
          <input
            name="confirmPassword"
            placeholder="Confirm your password"
            className="border p-3 text-sm rounded-md border-gray-400 outline-none"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
          <FormControl className="w-32 w-full">
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              className="bg-white"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.roleName}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </FormControl>
          <div className="w-full flex gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-85 w-full"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
            >
              Ajouter
            </button>
          </div>
        </animated.div>
      </div>
    )
  );
};

export default Modal;
