import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Card from "./Card";
import Spinner from "./Spinner";

const axisStyle = {
  fontWeight: 600,
  fill: "#fff",
  fontSize: 14,
};

const MonthlyTrendChart = ({ data = [], budget = 0, loading = false }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">
          Daily Expenses Trend
        </h3>
        <div className="flex items-center justify-center h-[300px]">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">
        Daily Expenses Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
            tick={axisStyle}
            axisLine={{ stroke: "#fff" }}
            tickLine={{ stroke: "#fff" }}
            label={{ value: "Day", position: "insideBottom", offset: -15, style: { fill: "#E0E0E0", fontSize: 20, fontWeight: "bold" } }}
          />
          <YAxis
            tick={axisStyle}
            axisLine={{ stroke: "#fff" }}
            tickLine={{ stroke: "#fff" }}
            label={{ value: "Amount (₹)", angle: -90, position: "insideLeft", offset:-30, style: { fill: "#E0E0E0", fontSize: 20, fontWeight: "bold" } }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            formatter={(value) => [`₹${value}`, "Amount"]}
            labelFormatter={(label) => `Day ${label}`}
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff"
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#FFA500"
            strokeWidth={3}
            dot={{ fill: "#FFA500", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#FFA500", strokeWidth: 2, fill: "#fff" }}
          />
          {budget > 0 && (
            <ReferenceLine
              y={budget}
              stroke="#800000"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Budget: ₹${budget}`,
                position: "top",
                fill: "#800000",
                fontSize: 18,
                fontWeight: "bold"
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MonthlyTrendChart;
