"use client";

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Calendars from "./Calendars";

export default function BarChartComponent({ campaignData }) {
  const [formData, setFormData] = useState({
    startDate: null,
  }); 

  const transformCampaignData = () => {
    if (!campaignData || campaignData.length === 0) return [];

    return campaignData
      .filter((campaign) => {
        if (!formData.startDate) return true;
        
        const campaignDate = new Date(campaign.date);
        const selectedDate = new Date(formData.startDate);
        
        const campaignUTCDate = Date.UTC(
          campaignDate.getUTCFullYear(), 
          campaignDate.getUTCMonth(), 
          campaignDate.getUTCDate()
        );
        
        const selectedUTCDate = Date.UTC(
          selectedDate.getUTCFullYear(),
          selectedDate.getUTCMonth(),
          selectedDate.getUTCDate()
        );
        
        return campaignUTCDate >= selectedUTCDate;
      })
      .map((campaign) => ({
        name: campaign.title || "Untitled Campaign",
        clicks: campaign.views,
      }))
      .sort((a, b) => b.clicks - a.clicks);
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
          <p className="text-sm">Clicks: {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
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
          <div className="relative">
            <div className="flex justify-end">
              <Calendars
                className="w-full sm:w-auto"
                selected={formData.startDate}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, startDate: date }))
                }
                fromDate={new Date()}
                popperPlacement="bottom-end"
                popperModifiers={[
                  {
                    name: 'flip',
                    options: {
                      fallbackPlacements: ['top-end', 'bottom-start'],
                    },
                  },
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: 'viewport',
                      padding: 10,
                    },
                  },
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 10],
                    },
                  },
                ]}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>No campaigns found for the selected date range.</p>
            <p>Try selecting a different date.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="flex flex-row items-start justify-between w-full gap-4">
        <div>
          <CardTitle className="text-xl font-light">
            Most efficient campaigns
          </CardTitle>
          <CardDescription className="font-light">
            Rank based on Click through rate
          </CardDescription>
        </div>
        <div className="relative">
          <Calendars
            className="w-full sm:w-auto"
            selected={formData.startDate}
            onSelect={(date) =>
              setFormData((prev) => ({ ...prev, startDate: date }))
            }
            fromDate={new Date()}
            popperPlacement="bottom-end"
            popperModifiers={[
              {
                name: 'flip',
                options: {
                  fallbackPlacements: ['top-end', 'bottom-start'],
                },
              },
              {
                name: 'preventOverflow',
                options: {
                  rootBoundary: 'viewport',
                  tether: false,
                  altAxis: true,
                },
              },
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ]}
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}