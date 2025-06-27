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

  const calculatePercentages = (ageGroup) => {
    const total = ageGroup.male + ageGroup.female + ageGroup.other;
    if (total === 0) {
      return {
        male: 0,
        female: 0,
        preferNotToSay: 0,
      };
    }
    return {
      male: (ageGroup.male / total) * 100,
      female: (ageGroup.female / total) * 100,
      preferNotToSay: (ageGroup.other / total) * 100,
    };
  };

  const chartData = [
    {
      month: "45+",
      ...calculatePercentages(demographicStats.ageGroups.age45Plus),
      total: demographicStats.ageGroups.age45Plus.male + 
            demographicStats.ageGroups.age45Plus.female + 
            demographicStats.ageGroups.age45Plus.other
    },
    {
      month: "35-44",
      ...calculatePercentages(demographicStats.ageGroups.age35_44),
      total: demographicStats.ageGroups.age35_44.male + 
            demographicStats.ageGroups.age35_44.female + 
            demographicStats.ageGroups.age35_44.other
    },
    {
      month: "25-33",
      ...calculatePercentages(demographicStats.ageGroups.age25_33),
      total: demographicStats.ageGroups.age25_33.male + 
            demographicStats.ageGroups.age25_33.female + 
            demographicStats.ageGroups.age25_33.other
    },
    {
      month: "18-24",
      ...calculatePercentages(demographicStats.ageGroups.age18_24),
      total: demographicStats.ageGroups.age18_24.male + 
            demographicStats.ageGroups.age18_24.female + 
            demographicStats.ageGroups.age18_24.other
    },
  ];

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl text-gray-600">
          Demographic Insights
        </CardTitle>
        <CardDescription>
          Audience demographics by Age and Gender (percentage distribution).
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
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border border-gray-200 rounded shadow">
                        <p className="font-semibold">{data.month}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {`${chartConfig[entry.dataKey].label}: ${entry.value.toFixed(1)}% (${data[entry.dataKey] === 'male' ? data.male : entry.dataKey === 'female' ? data.female : data.preferNotToSay})`}
                          </p>
                        ))}
                        <p>Total: {data.total}</p>
                      </div>
                    );
                  }
                  return null;
                }}
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
                  formatter={(value) => (value > 0 ? `${Math.round(value)}%` : '')}
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
                  formatter={(value) => (value > 0 ? `${Math.round(value)}%` : '')}
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
                  formatter={(value) => (value > 0 ? `${Math.round(value)}%` : '')}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}