import React from "react";
import Card from "./Card";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const TopCategories = ({ categories, currencySymbol = "₹" }) => (
  <Card className="w-full h-full bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 flex flex-col justify-between border border-white/20">
    <h3 className="text-base font-semibold mb-2 text-gray-100">
      Top Categories This Month
    </h3>
    <div className="space-y-2">
      {categories.slice(0, 5).map((category, index) => (
        <div
          key={category.name}
          className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            >
              {index + 1}
            </div>
            <span className="font-medium text-gray-200 text-sm">
              {category.name}
            </span>
          </div>
          <span className="font-bold text-gray-100 text-sm">
            {currencySymbol}
            {category.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

export default TopCategories;
