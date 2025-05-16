"use client";

import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Calendars from "./Calendars";

// Sample data
const chartData = [
  { month: "Puma Promotion", views: 186000, mobile: 80000 },
  { month: "Skechers Promotion", views: 305000, mobile: 200000 },
  { month: "Timberland Promotion", views: 237000, mobile: 120000 },
  { month: "Skechers Promotion", views: 73000, mobile: 190000 },
  { month: "Converse Promotion", views: 209000, mobile: 130000 },
  { month: "Vans ad Campaign", views: 214000, mobile: 140000 },
  { month: "Reebok Promotion", views: 186000, mobile: 80000 },
  { month: "Puma Promotion", views: 305000, mobile: 200000 },
  { month: "New Balance ad", views: 237000, mobile: 120000 },
  { month: "Adidas Campaign", views: 73000, mobile: 190000 },
  { month: "Nike Campaign", views: 209000, mobile: 130000 },
];

// Y-axis formatter
const formatYAxis = (value) => `${value / 1000}K`;

export default function BarChartComponent() {
  const [formData, setFormData] = useState({
    startDate: new Date(),
  });

  return (
    <Card className="w-full shadow-none border-none">
    <CardHeader className="flex flex-wrap items-start justify-between gap-4">
  <div className="max-w-[300px]">
    <CardTitle className="text-xl font-light">
      Most efficient campaigns
    </CardTitle>
    <CardDescription className="font-light">
      Rank based on Click through rate
    </CardDescription>
  </div>

  <div className="w-full sm:w-auto sm:max-w-[250px] mr-20">
    <Calendars
      className="sm:max-w-[250px] w-full"
      selected={formData.endDate}
      onSelect={(date) =>
        setFormData((prev) => ({ ...prev, endDate: date }))
      }
      fromDate={formData.startDate ? formData.startDate : new Date()}
    />
  </div>
</CardHeader>



      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px] h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="0 0" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => value.slice(0, 3)}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0)" }}
                  formatter={(value) => `${(value / 1000).toFixed(1)}K`}
                  labelFormatter={(label) => `Campaign: ${label}`}
                />
                <Bar dataKey="views" fill="#6297FF" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
