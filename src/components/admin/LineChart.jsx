"use client";

import {
  ChartPie,
  ChevronDown,
  CircleDollarSign,
  DollarSignIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mo", earnings: 100, fill: "rgba(19, 91, 232, 0.16)" },
  { name: "Tu", earnings: 180, fill: "rgba(19, 91, 232, 0.16)" },
  { name: "We", earnings: 170, fill: "rgba(19, 91, 232, 0.16)" },
  { name: "Th", earnings: 120, fill: "rgba(19, 91, 232, 0.16)" },
  { name: "Fr", earnings: 200, fill: "#135BE8" },
  { name: "Sa", earnings: 150, fill: "rgba(19, 91, 232, 0.16)" },
  { name: "Su", earnings: 160, fill: "rgba(19, 91, 232, 0.16)" },
];

export function LineChart() {
  return (
    <div className="p-4 bg-white rounded-2xl w-full h-full">
      {/* Top Section: Title and Select */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-medium">Earning Reports</h2>
          <p className="text-gray-500 text-sm">Weekly Earnings Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 border px-2 py-1 text-sm rounded-md text-blue-600 border-blue-600">
            Weekly
            <ChevronDown className="w-4 h-4" />
          </button>
          <EllipsisVerticalIcon className="w-4 h-4 text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Middle Section: $468 and Chart */}
      <div className="flex flex-wrap justify-between gap-6 items-center">
        {/* Left - Amount */}
        <div className="flex flex-col gap-2 w-full sm:w-[35%]">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-medium">$468</span>
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
              +4.2%
            </span>
          </div>
          <p className="text-sm text-gray-500 w-full sm:w-[200px]">
            You informed of this week compared to last week
          </p>
        </div>

        {/* Right - Chart */}
        <div className="w-full sm:w-[60%]">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  border: "none",
                  boxShadow: "none",
                }}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="earnings"
                radius={[6, 6, 6, 6]}
                fill={({ payload }) => payload.fill}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Earnings / Profit / Withdraw */}
      <div className="mt-6 border rounded-md p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Earnings */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-md">
              <DollarSignIcon className="text-blue-600 w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">Earnings</p>
          </div>
          <p className="font-md text-lg">$545.69</p>
          <div className="h-1 bg-blue-500 w-full rounded-full" />
        </div>

        {/* Profit */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-100 p-2 rounded-md">
              <ChartPie className="text-cyan-600 w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">Profit</p>
          </div>
          <p className="font-md text-lg">$256.34</p>
          <div className="h-1 bg-cyan-400 w-full rounded-full" />
        </div>

        {/* Withdraw */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-md">
              <CircleDollarSign className="text-red-600 w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">Withdraw</p>
          </div>
          <p className="font-md text-lg">$274.19</p>
          <div className="h-1 bg-red-500 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
