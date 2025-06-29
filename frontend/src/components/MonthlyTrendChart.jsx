import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "./Card";

const axisStyle = {
  fontWeight: 600,
  fill: "#fff",
  fontSize: 14,
};

const MonthlyTrendChart = ({ data }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4 text-gray-100">
      Monthly Trend (Last 6 Months)
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
        <XAxis
          dataKey="month"
          tick={axisStyle}
          axisLine={{ stroke: "#fff" }}
          tickLine={{ stroke: "#fff" }}
        />
        <YAxis
          tick={axisStyle}
          axisLine={{ stroke: "#fff" }}
          tickLine={{ stroke: "#fff" }}
        />
        <Tooltip formatter={(value) => `₹${value}`} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export default MonthlyTrendChart;
