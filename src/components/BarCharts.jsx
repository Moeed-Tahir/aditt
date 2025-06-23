"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  male: {
    label: "Male",
    color: "#3653F7",
  },
  female: {
    label: "Female",
    color: "#E670C7",
  },
  preferNotToSay: {
    label: "Prefer Not To Say",
    color: "#15B79E",
  },
};

export default function BarCharts({ quizQuestion }) {
  const demographicStats = quizQuestion?.demographicStats || {
    ageGroups: {
      age18_24: { male: 0, female: 0, other: 0 },
      age25_33: { male: 0, female: 0, other: 0 },
      age35_44: { male: 0, female: 0, other: 0 },
      age45Plus: { male: 0, female: 0, other: 0 },
    },
  };

  const chartData = [
    {
      month: "45+",
      male: demographicStats.ageGroups.age45Plus.male,
      female: demographicStats.ageGroups.age45Plus.female,
      preferNotToSay: demographicStats.ageGroups.age45Plus.other,
    },
    {
      month: "35-44",
      male: demographicStats.ageGroups.age35_44.male,
      female: demographicStats.ageGroups.age35_44.female,
      preferNotToSay: demographicStats.ageGroups.age35_44.other,
    },
    {
      month: "25-33",
      male: demographicStats.ageGroups.age25_33.male,
      female: demographicStats.ageGroups.age25_33.female,
      preferNotToSay: demographicStats.ageGroups.age25_33.other,
    },
    {
      month: "18-24",
      male: demographicStats.ageGroups.age18_24.male,
      female: demographicStats.ageGroups.age18_24.female,
      preferNotToSay: demographicStats.ageGroups.age18_24.other,
    },
  ];

  const maxValue = Math.max(
    ...chartData.map((item) => item.male + item.female + item.preferNotToSay)
  );

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
              <XAxis
                type="number"
                domain={[0, Math.ceil(maxValue * 1.1)]} // Add 10% padding
                tick={{ fontSize: 10 }}
              />
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
                  formatter={(value) => (value > 0 ? value : '')} // Only show label if value > 0
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
                  formatter={(value) => (value > 0 ? value : '')}
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
                  formatter={(value) => (value > 0 ? value : '')}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}