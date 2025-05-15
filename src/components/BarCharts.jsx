"use client";

import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Custom color added to each data object
const chartData = [
  { month: "45+", male: 120, female: 66 },
  { month: "35-44", male: 200, female: 105 },
  { month: "25-33", male: 140, female: 97, preferNotToSay: 30 },
  { month: "18-24", male: 50, female: 23, preferNotToSay: 50 },
];

const chartConfig = {
  male: {
    label: "Male",
    color: "#3653F7", // Blue
  },
  female: {
    label: "Female",
    color: "#E670C7", // Pink
  },
  preferNotToSay: {
    label: "Prefer Not To Say",
    color: "#15B79E",
  },
};

export default function BarCharts() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl text-gray-600">
          Demographic Insights
        </CardTitle>
        <CardDescription>
          Audience demographics by Age and Gender.
        </CardDescription>

        <hr className="border-t border-gray-300" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 16, bottom: 10, left: 30 }}
              barCategoryGap={10}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" domain={[0, 300]} tick={{ fontSize: 10 }} />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Bar
                dataKey="male"
                stackId="a"
                fill={chartConfig.male.color}
                radius={[4, 0, 0, 4]}
              >
                <LabelList
                  dataKey="male"
                  position="right"
                  offset={8}
                  fontSize={12}
                  className="fill-foreground"
                />
              </Bar>
              <Bar
                dataKey="preferNotToSay"
                stackId="a"
                fill={chartConfig.preferNotToSay.color}
              >
                <LabelList
                  dataKey="preferNotToSay"
                  position="right"
                  offset={8}
                  fontSize={12}
                  className="fill-foreground"
                />
              </Bar>
              <Bar
                dataKey="female"
                stackId="a"
                fill={chartConfig.female.color}
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="female"
                  position="right"
                  offset={8}
                  fontSize={12}
                  className="fill-foreground"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
