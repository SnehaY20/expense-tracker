import React from "react";
import Card from "./Card";
import Spinner from "./Spinner";

const COLORS = [
  "#0088FE",
  "#00C49F", 
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const TopCategories = ({ categories = [], currencySymbol = "₹", loading = false, className = "" }) => {
  // CSS for hiding webkit scrollbar
  const scrollbarStyle = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar:hover::-webkit-scrollbar {
      display: block;
      width: 6px;
    }
    .hide-scrollbar:hover::-webkit-scrollbar-track {
      background: transparent;
    }
    .hide-scrollbar:hover::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }
    .hide-scrollbar:hover::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;
  if (loading) {
    return (
      <Card className={className}>
        <div className="h-full flex flex-col">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">
            Top Categories This Month
          </h3>
          <div className="flex-1 flex justify-center items-center">
            <Spinner />
          </div>
        </div>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className={className}>
        <div className="h-full flex flex-col">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">
            Top Categories This Month
          </h3>
          <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500 dark:text-gray-400">
              No categories found
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <style>{scrollbarStyle}</style>
      <div className="h-full flex flex-col">
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Top Categories This Month
          </h3>
        </div>
        <div 
          className="flex-1 overflow-y-auto hide-scrollbar" 
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }} 
          onMouseEnter={(e) => {
            e.target.style.scrollbarWidth = 'thin';
            e.target.style.msOverflowStyle = 'auto';
          }}
          onMouseLeave={(e) => {
            e.target.style.scrollbarWidth = 'none';
            e.target.style.msOverflowStyle = 'none';
          }}
        >
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={category.id || index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate text-sm">
                    {category.name}
                  </span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-gray-900 dark:text-white font-semibold text-sm">
                    {currencySymbol}
                    {(category.totalAmount || category.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TopCategories;