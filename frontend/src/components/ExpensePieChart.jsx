import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Card from "./Card";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const ExpensePieChart = ({ data }) => (
  <Card className="p-4 flex flex-col items-center">
    <h3 className="text-base font-semibold text-gray-100 text-center w-full mb-4">
      Expenses by Category
    </h3>
    <div className="flex justify-center w-full">
      {(!data || data.length === 0) ? (
        <div className="flex justify-center items-center w-full">
          <span className="text-gray-400 text-center w-full">No categories to display</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  </Card>
);

export default ExpensePieChart;
