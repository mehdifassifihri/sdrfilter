import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

import { LineChart, CartesianGrid, Line } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const data2 = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const data1 = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    // More data...
  ];

  const demoUrl =
    "https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj";

  const [stats, setStats] = useState([]);
  const [msgStatus, setMsgStatus] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/message_type_distribution/")
      .then((response) => {
        setStats(response.data.sip);
      });

    axios
      .get("http://127.0.0.1:8000/msgstatus/")
      .then((response) => {
        const data = response.data.sip.map((item) => ({
          name: `MSG_STATUS ${item.MSG_STATUS}`,
          value: item.count,
        }));
        setMsgStatus(data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="h-full overflow-scroll">
      <p className="text-3xl font-bold">Dashboard</p>
      <div className="flex gap-3">
        <div>
          <p className="text-base mt-4 text-gray-400 ">
            Delivery - Submit Time Avg
          </p>
          <LineChart
            className=" bg-white mt-2 p-5 rounded-md"
            width={500}
            height={300}
            data={data2}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </div>
        <div>
          <p className="text-base mt-4 text-gray-400 ">
            SIP Response Code Distribution
          </p>
          <BarChart
            className="bg-white p-5 rounded-md mt-2"
            width={500}
            height={300}
            data={stats}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="SIP_RESP_CODE" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div className="flex gap-3 mt-7">
        <div className="flex flex-col gap-2">
          <p className="text-base text-gray-400 ">Delivery - Submit Time Avg</p>
          <BarChart
            className="bg-white rounded-md p-8"
            width={400}
            height={400}
            data={data1}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-base text-gray-400">
            SM Message Status Distribution
          </p>
          <PieChart className="bg-white rounded-md" width={600} height={400}>
            <Pie
              data={msgStatus}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {msgStatus.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
