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

const MonthlyTrendChart = ({ data = [], budget = 0, loading = false }) => {
  if (loading) {
    return (
      <Card className="w-full h-[408px] bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20 flex flex-col">
        <h3 className="text-base font-semibold mb-2 text-gray-100 p-4 pb-0">
          Daily Expenses Trend
        </h3>
        <div className="flex items-center justify-center flex-1">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20 flex flex-col">
      <h3 className="text-base font-semibold mb-2 text-gray-100 pb-0">
        Daily Expenses Trend
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fontWeight: 500, fill: '#fff' }}
              axisLine={{ stroke: "#fff" }}
              tickLine={{ stroke: "#fff" }}
              label={{ value: "Day", position: "insideBottom", offset: -2, style: { fill: "#E0E0E0", fontSize: 12, fontWeight: "bold" } }}
            />
            <YAxis
              tick={{ fontSize: 12, fontWeight: 500, fill: '#fff' }}
              axisLine={{ stroke: "#fff" }}
              tickLine={{ stroke: "#fff" }}
              label={{ value: "Amount (₹)", angle: -90, position: "insideLeft", offset: 2, style: { fill: "#E0E0E0", fontSize: 12, fontWeight: "bold" } }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, "Amount"]}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
                fontSize: 12
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FFA500"
              strokeWidth={2}
              dot={{ fill: "#FFA500", strokeWidth: 1.5, r: 3.5 }}
              activeDot={{ r: 5, stroke: "#FFA500", strokeWidth: 1.5, fill: "#fff" }}
            />
            {budget > 0 && (
              <ReferenceLine
                y={budget}
                stroke="#800000"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                label={{
                  value: `Budget: ₹${budget}`,
                  position: "top",
                  fill: "#800000",
                  fontSize: 12,
                  fontWeight: "bold"
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlyTrendChart;