"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const engagementData = [
  { month: "Jan", engagements: 0, clicks: 120 },
  { month: "Feb", engagements: 0, clicks: 90 },
  { month: "Mar", engagements: 0, clicks: 70 },
  { month: "Apr", engagements: 0, clicks: 60 },
  { month: "May", engagements: 0, clicks: 40 },
  { month: "Jun", engagements: 0, clicks: 20 },
];

const chartConfig = {
  engagements: {
    label: "Engagements",
    color: "#6297FF",
  },
  clicks: {
    label: "Clicks",
    color: "#6297FF",
  },
};

export default function EngagementChart() {
  const engagements = engagementData.reduce((sum, item) => sum + item.engagements, 0);
  const clicks = engagementData.reduce((sum, item) => sum + item.clicks, 0);

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <CardDescription className="text-[20px] font-md text-gray-600">
              Retention Chart
            </CardDescription>
            <CardDescription className="text-[16px]">
              The total number of views and clicks for your campaign over time.
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[16px] font-md">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-2"></span>
                Clicks
              </span>
              <span className="text-[14px] text-gray-500">{clicks}</span>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[16px] font-md">
                <span className="w-3 h-3 rounded-full bg-blue-100 inline-block mr-2"></span>
                Engagements
              </span>
              <span className="text-[14px] text-gray-500">{engagements}</span>
            </div>
          </div>
        </div>
        <hr className="border-t border-gray-300 mt-4" />
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={engagementData}
            margin={{
              top: 10,
              left: 12,
              right: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} horizontal={true} />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              width={35}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />

            <Area
              dataKey="engagements"
              type="monotone"
              fill="var(--color-engagements)"
              fillOpacity={0.4}
              stroke="var(--color-engagements)"
            />
            <Area
              dataKey="clicks"
              type="monotone"
              fill="var(--color-clicks)"
              fillOpacity={0.8}
              stroke="var(--color-clicks)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}