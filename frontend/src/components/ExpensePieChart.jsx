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

const ExpensePieChart = ({ data }) => {
  const total = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded px-2 py-1 shadow-sm text-xs">
          <p className="text-gray-800">{`${payload[0].name}: ₹${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
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
          <div className="flex items-center justify-center gap-6 w-full">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex flex-col gap-2">
              {data.map((entry, index) => {
                const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
                return (
                  <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-300 whitespace-nowrap">
                      {entry.name} {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExpensePieChart;