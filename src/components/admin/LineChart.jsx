"use client";

import {
  ChartPie,
  CircleDollarSign,
  DollarSignIcon,
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

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function LineChart({ adminDashboardData }) {
  const chartData = daysOfWeek.map(day => {
    const dayData = adminDashboardData?.dailyEarnings?.find(d => d.day === day) || { amount: 0 };
    return {
      name: day,
      earnings: dayData.amount,
      fill: day === "Fr" ? "#135BE8" : "rgba(19, 91, 232, 0.16)"
    };
  });

  return (
    <div className="p-4 bg-white rounded-2xl w-full h-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-medium">Earning Reports</h2>
          <p className="text-gray-500 text-sm">Weekly Earnings Overview</p>
        </div>
       
      </div>

      <div className="flex flex-wrap justify-between gap-6 items-center">
        <div className="flex flex-col gap-2 w-full sm:w-[35%]">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-medium">${adminDashboardData?.currentWeekEarnings?.toFixed(2) || '0.00'}</span>
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
              {adminDashboardData?.lastWeekEarnings === 0 ? 
                '+0%' : 
                `+${((adminDashboardData.currentWeekEarnings - adminDashboardData.lastWeekEarnings) / adminDashboardData.lastWeekEarnings * 100).toFixed(1)}%`}
            </span>
          </div>
          <p className="text-sm text-gray-500 w-full sm:w-[200px]">
            You informed of this week compared to last week
          </p>
        </div>

        <div className="w-full sm:w-[60%]">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
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

      <div className="mt-6 border rounded-md p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-md">
              <DollarSignIcon className="text-blue-600 w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">Earnings</p>
          </div>
          <p className="font-md text-lg">${adminDashboardData?.totalEarnings?.toFixed(2) || '0.00'}</p>
          <div className="h-1 bg-blue-500 w-full rounded-full" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-100 p-2 rounded-md">
              <ChartPie className="text-cyan-600 w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">Profit</p>
          </div>
          <p className="font-md text-lg">${(adminDashboardData?.totalEarnings * 0.6).toFixed(2) || '0.00'}</p>
          <div className="h-1 bg-cyan-400 w-full rounded-full" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-md">
              <CircleDollarSign className="text-red-600 w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">Withdraw</p>
          </div>
          <p className="font-md text-lg">${(adminDashboardData?.totalEarnings * 0.4).toFixed(2) || '0.00'}</p>
          <div className="h-1 bg-red-500 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}