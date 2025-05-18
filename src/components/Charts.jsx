"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Text,
} from "recharts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Calendars from "./Calendars";

export default function BarChartComponent({ campaignData }) {

  const [formData, setFormData] = useState({
    startDate: new Date(),
  });

  const transformCampaignData = () => {
    if (!campaignData || campaignData.length === 0) return [];

    return campaignData.map(campaign => ({
      name: campaign.title || "Untitled Campaign",
      clicks: campaign.views || 40,
      budget: parseFloat(campaign.amount) || 0,
      minVisibleValue:campaign.amount,
    }));
  };

  const chartData = transformCampaignData();

  const formatYAxis = (value) => {
    if (value >= 1000) return `${value / 1000}k`;
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Clicks: {payload[0].value}</p>
          <p className="text-sm">Budget: ${payload[1].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0 || chartData.every(item => item.clicks === 0)) {
    return (
      <Card className="w-full shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-xl font-light">
            Most efficient campaigns
          </CardTitle>
          <CardDescription className="font-light">
            No click data available yet
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Your campaigns haven't received any clicks yet.</p>
            <p>Check back later when your campaigns are running.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div>
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
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  domain={[0, 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="clicks"
                  name="Clicks"
                  fill="#6297FF"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="minVisibleValue"
                  name="Minimum"
                  fill="#e2e8f0"
                  radius={[4, 4, 0, 0]}
                  opacity={0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}