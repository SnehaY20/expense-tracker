import React from "react";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

const ExpenseTable = ({
  expenses = [],
  isLoading = false,
  isError = false,
  error = null,
  categories = [],
  showTotal = false,
  showCategory = true,
  showTotalBelow = false,
}) => {
  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : "Unknown";
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="relative w-full">
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight: "450px" }}
      >
        <table
          className="w-full min-w-[900px] text-left text-white border-separate border-spacing-0"
          style={{ borderCollapse: "separate" }}
        >
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
                <br />
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={showCategory ? 6 : 5}
                  className="text-center py-6 text-gray-400"
                >
                  Loading expenses...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={showCategory ? 6 : 5}
                  className="text-center py-6 text-red-400"
                >
                  Error: {error?.message || "Error loading expenses"}
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={showCategory ? 6 : 5}
                  className="text-center py-6 text-gray-400"
                >
                  No expenses found.
                </td>
              </tr>
            ) : (
              sortedExpenses.map((exp, idx) => (
                <tr
                  key={exp._id}
                  className="border border-gray-400/20 hover:bg-white/5 transition"
                >
                  <td className="py-3 px-2 w-16 border border-gray-400/30 text-purple-100">
                    {idx + 1}
                  </td>
                  {showCategory && (
                    <td className="py-3 px-4 border border-gray-400/30">
                      {getCategoryName(exp.category)}
                    </td>
                  )}
                  <td className="py-3 px-4 border border-gray-400/30">
                    {exp.title}
                  </td>
                  <td className="py-3 px-4 border border-gray-400/30">
                    {exp.note}
                  </td>
                  <td className="py-3 px-2 w-24 border border-gray-400/30">
                    {formatAmount(exp.amount)}
                  </td>
                  <td className="py-3 px-4 border border-gray-400/30">
                    {formatDate(exp.createdAt)}
                    <br />
                    <span className="text-xs text-gray-400">
                      {formatTime(exp.createdAt)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showTotalBelow &&
        expenses &&
        expenses.length > 0 &&
        !isLoading &&
        !isError && (
          <div className="text-right text-2xl font-bold text-green-400 px-4 py-2 mt-2">
            Total:{" "}
            {totalAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </div>
        )}
    </div>
  );
};

export default ExpenseTable;
