import React from "react";
import { Search, ChevronDown } from "lucide-react";

const ExpenseTableControls = ({
  searchTerm,
  setSearchTerm,
  isColumnsDropdownOpen,
  setIsColumnsDropdownOpen,
  visibleColumns,
  handleColumnToggle,
  showTotalBelow,
  filteredExpenses,
  isLoading,
  isError,
  customTotal,
  showAddExpenseButton,
  showAddCategoryButton,
  onAddExpense,
  onAddCategory
}) => (
  <div className="flex items-center gap-4 justify-between">
    <div className="flex gap-2 items-center">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Filter expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div className="relative">
        <button
          onClick={() => setIsColumnsDropdownOpen(!isColumnsDropdownOpen)}
          className="flex items-center justify-between gap-2 px-4 py-2 w-32 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
        >
          Columns
          <ChevronDown className={`h-4 w-4 transition-transform ${isColumnsDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isColumnsDropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
            <div className="p-2">
              {Object.entries({
                category: "Category",
                title: "Title",
                note: "Note",
                amount: "Amount",
                createdAt: "Created at"
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns[key]}
                    onChange={() => handleColumnToggle(key)}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      {showTotalBelow && filteredExpenses && filteredExpenses.length > 0 && !isLoading && !isError && (
        <div className="py-1 w-full rounded-lg bg-white/10 border border-green-400 text-green-400 font-bold text-lg flex items-center justify-center">
          <>Total: {(typeof customTotal === 'number' ? customTotal : filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</>
        </div>
      )}
    </div>
    <div className="flex gap-2 items-center">
      {showAddExpenseButton && (
        <button
          onClick={onAddExpense}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
        >
          Add Expense
        </button>
      )}
      {showAddCategoryButton && (
        <button
          onClick={onAddCategory}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
        >
          Add Category
        </button>
      )}
    </div>
  </div>
);

export default ExpenseTableControls; 