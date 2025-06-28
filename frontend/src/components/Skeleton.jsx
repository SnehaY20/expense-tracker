import React from "react";

// Skeleton for table rows
export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border border-gray-400/20">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="py-3 px-4 border border-gray-400/30">
              <div className="h-4 bg-gray-500 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

// Skeleton for cards
export const CardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`bg-white/5 border border-gray-400/30 rounded-lg p-4 ${className}`}
    >
      <div className="space-y-3">
        <div className="h-4 bg-gray-500 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-500 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-500 rounded w-2/3 animate-pulse"></div>
      </div>
    </div>
  );
};

// Skeleton for category list
export const CategoryListSkeleton = ({ items = 5 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="h-12 bg-gray-500 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  );
};

// Skeleton for profile cards
export const ProfileCardSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white/5 border border-gray-400/30 rounded-lg p-4"
        >
          <div className="space-y-2">
            <div className="h-3 bg-gray-500 rounded w-1/4 animate-pulse"></div>
            <div className="h-6 bg-gray-500 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for expense table
export const ExpenseTableSkeleton = ({ showCategory = true }) => {
  const columns = showCategory ? 6 : 5;

  return (
    <div className="relative w-full">
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight: "450px" }}
      >
        <table className="w-full min-w-[900px] text-left text-white border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="py-3 px-2 w-16 border border-gray-400/30 bg-white/10 text-purple-300 font-semibold">
                Sr. no
              </th>
              {showCategory && (
                <th className="py-3 px-4 border border-gray-400/30 bg-white/10 text-purple-300 font-semibold">
                  Category
                </th>
              )}
              <th className="py-3 px-4 border border-gray-400/30 bg-white/10 text-purple-300 font-semibold">
                Title
              </th>
              <th className="py-3 px-4 border border-gray-400/30 bg-white/10 text-purple-300 font-semibold">
                Note
              </th>
              <th className="py-3 px-2 w-24 border border-gray-400/30 bg-white/10 text-purple-300 font-semibold">
                Amount
              </th>
              <th className="py-3 px-4 border border-gray-400/30 bg-white/10 text-purple-300 font-semibold">
                Created at
              </th>
            </tr>
          </thead>
          <TableSkeleton rows={5} columns={columns} />
        </table>
      </div>
    </div>
  );
};

// Main Skeleton component
const Skeleton = ({ type = "card", ...props }) => {
  switch (type) {
    case "table":
      return <TableSkeleton {...props} />;
    case "card":
      return <CardSkeleton {...props} />;
    case "categoryList":
      return <CategoryListSkeleton {...props} />;
    case "profileCard":
      return <ProfileCardSkeleton {...props} />;
    case "expenseTable":
      return <ExpenseTableSkeleton {...props} />;
    default:
      return <CardSkeleton {...props} />;
  }
};

export default Skeleton;
