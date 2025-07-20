import React from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import Card from "./Card";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const ExpensePieChart = ({ data, className = "" }) => {
  // Calculate total for percentage
  const total = data ? data.reduce((sum, item) => sum + item.value, 0) : 0;

  return (
    <Card className={`${className} flex flex-col overflow-hidden`}>
      <div className="p-4 pb-2 flex-shrink-0">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white text-center">
          Expenses by Category
        </h3>
      </div>
      <div className="flex-1 flex justify-center items-center p-2 sm:p-4 min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex justify-center items-center w-full h-full">
            <span className="text-gray-500 dark:text-gray-400 text-sm text-center">
              No categories to display
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <PieChart
              series={[{
                data: data.map((item, idx) => ({
                  id: idx,
                  value: item.value,
                  label: item.name,
                  color: COLORS[idx % COLORS.length],
                })),
                innerRadius: 0,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 3,
              }]}
              colors={COLORS}
              width={200}
              height={180}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: 0,
                  itemMarkWidth: 8,
                  itemMarkHeight: 8,
                  markGap: 4,
                  itemGap: 8,
                  labelStyle: {
                    fontSize: 10,
                    fill: '#666',
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExpensePieChart;