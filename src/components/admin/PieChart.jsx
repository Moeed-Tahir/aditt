"use client";

import {
  ChevronDown,
  EllipsisVerticalIcon,
  ChartPie,
  BarChart2,
  PauseCircle,
  Megaphone,
  CheckCircleIcon,
  Clock,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  {
    name: "Total Ads",
    value: 100,
    color: "rgba(19, 91, 232, 1)",
    icon: <Megaphone className="text-blue-600 w-6 h-6" />,
    bgColor: "bg-blue-100",
  },
  {
    name: "Active Ads",
    value: 100,
    color: "rgba(19, 91, 232, 0.6)",
    icon: <CheckCircleIcon className="text-cyan-600 w-6 h-6" />,
    bgColor: "bg-cyan-100",
  },
  {
    name: "Paused Ads",
    value: 100,
    color: "rgba(19, 91, 232, 0.16)",
    icon: <Clock className="text-orange-500 w-6 h-6" />,
    bgColor: "bg-orange-200",
  },
];

export function PieChartBox() {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-4 bg-white rounded-2xl w-full h-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-medium">Activity Tracker</h2>
          <p className="text-gray-500 text-sm">Last 7 Days</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 border px-2 py-1 text-sm rounded-md text-blue-600 border-blue-600">
            Weekly
            <ChevronDown className="w-4 h-4" />
          </button>
          <EllipsisVerticalIcon className="w-4 h-4 text-gray-600 cursor-pointer" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-6 items-center">
        <div className="flex flex-col justify-between min-h-[300px] w-full sm:w-[45%]">
          <div className="pt-6">
            <div className="text-3xl font-md mb-2">{total}</div>
            <div className="text-gray-600 font-medium">Total Campaigns</div>
          </div>

          <div className="mt-6 space-y-6 text-sm flex flex-col justify-end flex-grow">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className={`p-2 rounded-md ${entry.bgColor}`}>
                  {entry.icon}
                </div>
                <div className="flex flex-col">
                  <span>{entry.name}</span>
                  <span className="text-gray-600">{entry.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Pie Chart */}
        <div className="w-full sm:w-[50%] flex justify-center items-center">
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={0}
              labelLine={false}
              isAnimationActive
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {/* Centered Number */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              dy="-0.3em"
              className="text-4xl fill-gray-800 font-md"
            >
              {total}
            </text>

            {/* Centered Label */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              dy="1.0em"
              className="text-3xl fill-blue-500"
            >
              Total
            </text>

            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
