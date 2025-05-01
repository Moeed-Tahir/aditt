"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Sample data (shortened for clarity)
const chartData = [
  {
    x: "0",
    "18_24_male": 40,
    "18_24_female": 40,
    "18_24_prefer": 40,
    "25_34_male": 20,
    "25_34_female": 20,
    "25_34_prefer": 20,
    // "35_44_male": 10,
    // "35_44_female": 10,
    // "35_44_prefer": 10,
    // "45_plus_male": 40,
    // "45_plus_female": 30,
    // "45_plus_prefer": 30,
  },
  {
    x: "10k",
    "18_24_male": 30,
    "18_24_female": 20,
    "18_24_prefer": 10,
    "25_34_male": 40,
    "25_34_female": 30,
    "25_34_prefer": 20,
    // "35_44_male": 10,
    // "35_44_female": 15,
    // "35_44_prefer": 18,
    // "45_plus_male": 30,
    // "45_plus_female": 30,
    // "45_plus_prefer": 30,
  },
  {
    x: "20k",
    "18_24_male": 40,
    "18_24_female": 35,
    "18_24_prefer": 0,
    "25_34_male": 20,
    "25_34_female": 10,
    "25_34_prefer": 25,
    // "35_44_male": 35,
    // "35_44_female": 32,
    // "35_44_prefer": 38,
    // "45_plus_male": 38,
    // "45_plus_female": 40,
    // "45_plus_prefer": 30,
  },
  // Add more x values up to 500k
]

const colorMap = {
  "18_24_male": "#3a0ca3",
  "18_24_female": "#f72585",
  "18_24_prefer": "#4cc9f0",

  "25_34_male": "#3a0ca3",
  "25_34_female": "#f72585",
  "25_34_prefer": "#4cc9f0",

  "35_44_male": "#3a0ca3",
  "35_44_female": "#f72585",
  "35_44_prefer": "#4cc9f0",

  "45_plus_male": "#3a0ca3",
  "45_plus_female": "#f72585",
  "45_plus_prefer": "#4cc9f0",
}

const lineNames = {
  "18_24_male": "18–24 Male",
  "18_24_female": "18–24 Female",
  "18_24_prefer": "18–24 Prefer not to say",

  "25_34_male": "25–34 Male",
  "25_34_female": "25–34 Female",
  "25_34_prefer": "25–34 Prefer not to say",

  "35_44_male": "35–44 Male",
  "35_44_female": "35–44 Female",
  "35_44_prefer": "35–44 Prefer not to say",

  "45_plus_male": "45+ Male",
  "45_plus_female": "45+ Female",
  "45_plus_prefer": "45+ Prefer not to say",
}

export function LineBarsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-light">Impressions</CardTitle>
        <CardDescription className="font-light">
          Overall campaigns impressions by age & gender
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="x" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <Tooltip />
            {Object.keys(lineNames).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colorMap[key]}
                strokeWidth={2}
                dot={false}
                name={lineNames[key]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
