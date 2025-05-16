"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 180 },
  { month: "March", desktop: 237, mobile: 150 },
  { month: "April", desktop: 73, mobile: 90 },
  { month: "May", desktop: 209, mobile: 160 },
  { month: "June", desktop: 214, mobile: 180 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#E8F0FF",
  },
  mobile: {
    label: "Mobile",
    color: "#6297FF",
  },
};

export default function AreaCharts() {
  return (
    <Card className="shadow-none border-none">
     <CardHeader>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
    {/* Title and Description on the left */}
    <div>
      <CardDescription className="text-[20px] font-md text-gray-600">
        Retention Chart
      </CardDescription>
      <CardDescription className="text-[16px]">
        The total number of views and clicks for your campaign over time.
      </CardDescription>
    </div>

    {/* Right-side Stats */}
    <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
      <div className="flex flex-col items-start sm:items-end">
        <span className="text-[16px] font-md "><span className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-2"></span>
        Clicks</span>
        <span className="text-[14px] text-gray-500">0</span>
      </div>
      <div className="flex flex-col items-start sm:items-end">
        <span className="text-[16px] font-md"><span className="w-3 h-3 rounded-full bg-blue-100 inline-block mr-2"></span>
        Engagements</span>
        <span className="text-[14px] text-gray-500">0</span>
      </div>
    </div>
  </div>
  <hr className="border-t border-gray-300 mt-4" />
</CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              left: 12,
              right: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={true} horizontal={false} />

            {/* ✅ Add vertical line (Y-axis) */}
            <YAxis
              axisLine={true}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }} // style ticks
              width={35}
            />

            {/* ✅ Horizontal months at the bottom */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />

            <Area
              dataKey="desktop"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
            <Area
              dataKey="mobile"
              type="linear"
              fill="#6297FF"
              fillOpacity={1}
              stroke="var(--color-mobile)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
