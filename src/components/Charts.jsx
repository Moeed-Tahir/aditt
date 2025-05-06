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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data
const chartData = [
  { month: "Puma Promotion", desktop: 186000, mobile: 80000 },
  { month: "Skechers Promotion", desktop: 305000, mobile: 200000 },
  { month: "Timberland Promotion", desktop: 237000, mobile: 120000 },
  { month: "Skechers Promotion", desktop: 73000, mobile: 190000 },
  { month: "Converse Promotion", desktop: 209000, mobile: 130000 },
  { month: "Vans ad Campaign", desktop: 214000, mobile: 140000 },
  { month: "Reebok Promotion", desktop: 186000, mobile: 80000 },
  { month: "Puma Promotion", desktop: 305000, mobile: 200000 },
  { month: "New Balance ad", desktop: 237000, mobile: 120000 },
  { month: "Adidas Campaign", desktop: 73000, mobile: 190000 },
  { month: "Nike Campaign", desktop: 209000, mobile: 130000 },
];

// Y-axis formatter
const formatYAxis = (value) => `${value / 1000}K`;

export default function BarChartComponent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-light">
          Most efficient campaigns
        </CardTitle>
        <CardDescription className="font-light">
          Rank based on Click through rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px]">
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
              
                formatter={(value) => `${(value / 1000).toFixed(1)}K`}
                labelFormatter={(label) => `Campaign: ${label}`}
              />
              <Bar dataKey="desktop" fill="#6297FF" radius={4} />
              {/* <Bar dataKey="mobile" fill="#FF7F50" radius={4} /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
