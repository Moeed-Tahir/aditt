"use client"

import { TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Custom color added to each data object
const chartData = [
  { month: "January", desktop: 186, fill: "#E670C7" }, // Indigo
  { month: "February", desktop: 305, fill: "#3653F7" }, // Emerald
  { month: "March", desktop: 237, fill: "#E670C7" }, // Amber
  { month: "April", desktop: 73, fill: "#3653F7" }, // Red
  { month: "May", desktop: 209, fill: "#E670C7" }, // Purple
  { month: "June", desktop: 214, fill: "#3653F7" }, // Sky Blue
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
}

export default function BarCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-gray-600">Demographic Insights</CardTitle>
        <CardDescription>Audience demographics by Age and Gender.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 16, bottom: 10, left: 30 }} // Adjusted margin
            width={400} // Decreased width
            height={250} // Decreased height
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="desktop" layout="vertical" radius={4}>
              {/* Custom color for each bar */}
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
