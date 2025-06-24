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

const chartConfig = {
  videoWatchTime: {
    label: "Video Watch Time",
    color: "#6297FF",
  },
  clicks: {
    label: "Clicks",
    color: "#6297FF",
  },
};

export default function EngagementChart({ clicks, videoWatchTime }) {
  // Create engagement data based on daily counts if available
  const engagementData = [
    { 
      name: "Day 1", 
      videoWatchTime: 0, // Initial value
      clicks: 0 
    },
    { 
      name: "Current", 
      videoWatchTime: videoWatchTime || 0, 
      clicks: clicks || 0 
    },
  ];

  const totalVideoWatchTime = engagementData.reduce((sum, item) => sum + item.videoWatchTime, 0);
  const currentClicks = engagementData[engagementData.length - 1].clicks;

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
              <span className="text-[14px] text-gray-500">{currentClicks}</span>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[16px] font-md">
                <span className="w-3 h-3 rounded-full bg-blue-100 inline-block mr-2"></span>
                Video Watch Time
              </span>
              <span className="text-[14px] text-gray-500">{totalVideoWatchTime}</span>
            </div>
          </div>
        </div>
        <hr className="border-t border-gray-300 mt-4" />
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={engagementData}
            margin={{
              top: 10,
              left: 50,
              right: 12,
              bottom: 0,
            }}
            width={600}
            height={300}
          >
            <CartesianGrid vertical={false} horizontal={true} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              width={35}
              orientation="left"
              tickMargin={20}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />

            <Area
              dataKey="videoWatchTime"
              type="monotone"
              fill="var(--color-videoWatchTime)"
              fillOpacity={0.4}
              stroke="var(--color-videoWatchTime)"
              strokeWidth={2}
            />
            <Area
              dataKey="clicks"
              type="monotone"
              fill="var(--color-clicks)"
              fillOpacity={0.8}
              stroke="var(--color-clicks)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}