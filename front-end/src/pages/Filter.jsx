import React, { useRef, useState, useEffect } from "react";
import { Query, useQuery } from "@tanstack/react-query";

// Assets
import Save from "../assets/save.png";
import FilterLogoCyan from "../assets/filterlogo.png";
import Filterlogo from "../assets/filter.png";
import Csvlogo from "../assets/csv.png";
import Report from "../assets/report.png";
import Done from "../assets/DoneWhite.png";
import Plus from "../assets/plus.png";
import RemoveGray from "../assets/greyremove.png";
import DoneW from "../assets/DoneWhite.png";

// Icons
import { Import, UploadIcon } from "lucide-react";

// Ant Design
import { Space, Table, Tag, Button, message } from "antd";

// Material UI
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CircularProgress } from "@mui/material";

// Utility Functions
import { fetchData, fetchFiltersByUserId, fetchMsgIds } from "../utils/fn";
import {
  nomsColonnesMAP,
  nomsColonnesSIP,
  nomsColonnesSM,
} from "../utils/colones";

// Components
import FilterModal from "../components/FilterModal";
import OneFilter from "../components/OneFilter";
import Modal from "../components/Modal";
import SaveModal from "../components/SaveModal";

// React Spring
import { useSpring, animated } from "@react-spring/web";

// Redux
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendReport from "../components/SendReport";

const Filter = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [sdrtype, setSdrtype] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [SaveFilterModal, setSaveFilterModal] = useState(false);
  const [columnsName, setColumnsName] = useState([]);
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  const userId = localStorage.getItem("userId");

  if (!isAuthenticated) {
    navigate("/login");
  }

  useEffect(() => {
    switch (sdrtype) {
      case "SM":
        setColumnsName(nomsColonnesSM);
        break;
      case "SIP":
        setColumnsName(nomsColonnesSIP);
        break;
      case "MAP":
        setColumnsName(nomsColonnesMAP);
        break;
      default:
        setColumnsName([]);
    }
  }, [sdrtype]);

  const warning = (message) => {
    messageApi.open({
      type: "warning",
      content: message,
    });
  };

  const animation = useSpring({
    opacity: filterModalOpen ? 1 : 0,
    transform: filterModalOpen ? "translateY(0)" : "translateY(-50px)",
  });

  const query = useQuery({
    queryFn: () => fetchData(msgIdsQuery.data.message_ids),
    queryKey: ["results"],
    enabled: false,
  });

  const msgIdsQuery = useQuery({
    queryFn: () => fetchMsgIds(sdrtype, filters),
    queryKey: ["msgids"],
    enabled: false,
  });

  const filterQuery = useQuery({
    queryFn: () => fetchFiltersByUserId(),
    queryKey: ["filters"],
    enabled: true,
  });

  const handleFilterClick = (title) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [title]: null,
    }));
  };

  const generateReport = async () => {
    const url =
      "http://localhost:3030/report/generate?email=m.fassifihri12@gmail.com"; // Adjust the URL as needed

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: query.data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log(data); // Handle success response
    } catch (error) {
      console.error("Failed to send report:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate_csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query.data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SMResults.csv"); // Set the filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("There was an error downloading the file:", error);
    }
  };

  const handleApplyFilter = () => {
    setFilters({});
    const newFilters = {};

    selectedFilters.forEach((filter) => {
      const { filterName, filterValue } = filter;
      newFilters[filterName] = filterValue;
    });

    setFilters(newFilters);
  };

  const handleSaveFilter = (description) => {
    const userId = localStorage.getItem("userId");

    const filterArray = Object.entries(filters).map(([key, value]) => ({
      filterName: key,
      filterValue: value,
    }));

    fetch("http://localhost:8088/filters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: description, // Use the passed description
        filters: filterArray,
        userId: userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        filterQuery.refetch();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleValueChange = (e, key) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: e.target.value,
    }));
  };

  const handleChange = (event) => {
    setSdrtype(event.target.value);
    console.log(event.target.value);
    console.log(columnsName);
  };

  const handleFilterChange = (event) => {
    setSelectedFilters(event.target.value);
    console.log(selectedFilters);
  };

  const addFilters = () => {
    if (sdrtype == "") warning("Please specify SDR Type");
    setFilterModalOpen(true);
  };

  return (
    <div className={`h-full ${!query.data && "flex flex-col"}`}>
      {contextHolder}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex item-center">
            <img className="w-7" src={FilterLogoCyan} alt="Filter_Logo" />
            <p className="font-bold text-3xl ml-3">Search and filter SDR</p>
          </div>
          <div className="flex flex-col gap-5 mt-7">
            <div className="flex items-center">
              <label className="text-black w-24 text-sm font-bold">
                SDR Type
              </label>
              <FormControl className="w-32">
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  className="bg-white"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sdrtype}
                  label="Type"
                  onChange={handleChange}
                >
                  <MenuItem value={"SIP"}>SIP</MenuItem>
                  <MenuItem value={"SM"}>SM</MenuItem>
                  <MenuItem value={"MAP"}>MAP</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex items-center">
              <label className="text-black w-24 text-sm font-bold">
                My Filters
              </label>
              <FormControl className="w-32">
                <InputLabel id="demo-simple-select-label">Filters</InputLabel>
                <Select
                  className="bg-white"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filters.name}
                  label="Filter"
                  onChange={handleFilterChange}
                >
                  {filterQuery.data?.map((filter) => (
                    <MenuItem className="" value={filter.filters}>
                      {filter.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <button
                onClick={handleApplyFilter}
                className="py-4 px-6 gap-2 bg-cyan-600 rounded-md ml-2 text-sm text-white flex items-center justify-center hover:opacity-80"
              >
                <UploadIcon className="w-4"></UploadIcon>
                Appliquer
              </button>
            </div>
            <div className="flex items-center">
              <label className="text-black text-sm font-bold w-24">
                Add Filters
              </label>

              <button
                onClick={msgIdsQuery.refetch}
                className="py-4 px-6 gap-2 bg-cyan-600 rounded-md  text-sm text-white flex items-center justify-center hover:opacity-80"
              >
                <img className="w-4" src={Filterlogo} alt="" />
                Fetch
              </button>
            </div>
          </div>
        </div>
        <div className="border flex flex-col justify-between border-zinc-200 rounded-md bg-white p-5 w-64">
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-2xl">Filters</p>
              <div className="flex items-center">
                <button
                  onClick={() => setSaveFilterModal(true)}
                  className="w-10 h-10 bg-zinc-100 border border-gray-300 rounded-md ml-2"
                >
                  <img className="p-3" src={Save} alt="" />
                </button>
                <button
                  onClick={addFilters}
                  className="w-10 h-10 bg-zinc-100 border border-gray-300 rounded-md ml-2"
                >
                  <img className="p-3" src={Plus} alt="" />
                </button>
              </div>
            </div>
            <div className="mt-4 overflow-scroll">
              {Object.keys(filters).map((key) => (
                <div className="flex items-center" key={key}>
                  <label className="text-xs w-32">{key}:</label>
                  <input
                    className="p-3 border w-10 h-10 rounded-md outline-none"
                    type="text"
                    value={filters[key]}
                    onChange={(e) => handleValueChange(e, key)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border flex flex-col justify-between border-zinc-200 rounded-md bg-white p-5 w-96">
          <div>
            <p className="font-bold text-2xl">MSG ID's with</p>
            <div className="mt-2 overflow-scroll">
              {msgIdsQuery.data?.message && <p>{msgIdsQuery.data?.message}</p>}
              {msgIdsQuery.data?.message_ids?.map((id) => (
                <p className="text-black text-sm" key={id}>
                  {id}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-3">
              <button className="border p-3 w-16 flex justify-center items-center rounded-md focus:border-cyan-600 focus:shadow-md">
                <p className="font-bold">SM</p>
              </button>
              <button className="border p-3 w-16 flex justify-center items-center rounded-md focus:border-cyan-600 focus:shadow-md">
                <p className="font-bold">SIP</p>
              </button>
              <button className="border p-3 w-16 flex justify-center items-center rounded-md focus:border-cyan-600 focus:shadow-md">
                <p className="font-bold">MAP</p>
              </button>
            </div>
            <button
              onClick={query.refetch}
              className="w-14 h-14 rounded-md bg-cyan-500 flex items-center justify-center hover:opacity-85"
            >
              <img className="w-6" src={Done} alt="" />
            </button>
          </div>
        </div>
      </div>

      {query.isLoading && (
        <div className="mt-5 h-full flex items-center justify-center">
          <CircularProgress></CircularProgress>
        </div>
      )}
      {query.data && (
        <div className="flex justify-end gap-2 py-5">
          <button
            onClick={handleDownload}
            className="py-3 px-4 text-sm font-bold text-white rounded-md bg-cyan-600 flex gap-2 items-center hover:opacity-80"
          >
            Download <img className="w-10" src={Csvlogo} alt="" />
          </button>
          <button
            onClick={generateReport}
            className="py-3 px-4 text-sm font-bold text-white rounded-md bg-cyan-600 flex gap-2 items-center hover:opacity-80"
          >
            Report <img className="w-8" src={Report} alt="" />
          </button>
        </div>
      )}
      {query.data && (
        <Table
          style={{ width: "1250px" }}
          className="text-xs overflow-scroll bg-white rounded-md"
          columns={columnsName}
          dataSource={query.data?.SMResults}
        />
      )}

      {filterModalOpen && (
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
                  onClick={() => setFilterModalOpen(false)}
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
                <div onClick={() => handleFilterClick(field.title)}>
                  <OneFilter title={field.title} />
                </div>
              ))}
            </div>
          </animated.div>
        </div>
      )}
      <SaveModal
        saveFilters={handleSaveFilter}
        show={SaveFilterModal}
        setShow={setSaveFilterModal}
      />
    </div>
  );
};

export default Filter;
