import React, { useState, useMemo } from "react";
import { Search, ChevronDown, SquarePen } from "lucide-react";
import Spinner from "./Spinner";

// Table components
const Table = ({ children, className = "" }) => (
  <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
);
const TableHeader = ({ children, className = "" }) => (
  <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>
);
const TableBody = ({ children, className = "" }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>
);
const TableRow = ({ children, className = "" }) => (
  <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>{children}</tr>
);
const TableHead = ({ children, className = "" }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>
);

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

const getCategoryName = (id, categories) => {
  const cat = categories.find((c) => c._id === id);
  return cat ? cat.name : "Unknown";
};

const ExpenseTable = ({
  expenses = [],
  categories = [],
  isLoading = false,
  isError = false,
  error = null,
  showCategory = true,
  showTotalBelow = false,
  showAddCategoryButton = false,
  showAddExpenseButton = false,
  onAddCategory = () => {},
  onAddExpense = () => {},
  customTotal = null,
  maxVisibleRows = null,
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    category: showCategory,
    title: true,
    note: true,
    amount: true,
    createdAt: true,
  });
  const [isColumnsDropdownOpen, setIsColumnsDropdownOpen] = useState(false);

  const sortedExpenses = useMemo(() =>
    [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    if (!searchTerm) return sortedExpenses;
    return sortedExpenses.filter(expense =>
      (expense.title && expense.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.note && expense.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (getCategoryName(expense.category, categories).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (formatAmount(expense.amount).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedExpenses, searchTerm, categories]);

  const handleRowSelect = (expenseId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId);
    } else {
      newSelected.add(expenseId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredExpenses.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredExpenses.map(exp => exp._id)));
    }
  };

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const rowHeight = 64;
  const headerHeight = 56;
  const maxHeight = maxVisibleRows ? `${headerHeight + maxVisibleRows * rowHeight + 12}px` : undefined;

  return (
    <div className="relative w-full">
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
      <div className="rounded-2xl overflow-hidden mt-4">
        <div
          className="overflow-auto border border-gray-400/30 bg-white/5 scrollbar-hide pb-4"
          style={maxHeight ? { maxHeight, overflowY: 'auto' } : {}}
        >
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <Table>
            <TableHeader className="sticky top-0 bg-white/10 backdrop-blur-sm">
              <TableRow className="border-gray-400/30 hover:bg-transparent">
                <TableHead className="w-12 text-purple-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={filteredExpenses.length > 0 && selectedRows.size === filteredExpenses.length}
                    onChange={handleSelectAll}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                </TableHead>
                {visibleColumns.category && (
                  <TableHead className="text-purple-300 font-semibold">
                  Category
                  </TableHead>
              )}
                {visibleColumns.title && (
                  <TableHead className="text-purple-300 font-semibold">
                Title
                  </TableHead>
                )}
                {visibleColumns.note && (
                  <TableHead className="text-purple-300 font-semibold">
                    Note
                  </TableHead>
                )}
                {visibleColumns.amount && (
                  <TableHead className="w-24 text-purple-300 font-semibold">
                Amount
                  </TableHead>
                )}
                {visibleColumns.createdAt && (
                  <TableHead className="text-purple-300 font-semibold">
                Created at
                  </TableHead>
                )}
                <TableHead className="w-12 text-purple-300 font-semibold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={Object.values(visibleColumns).filter(Boolean).length + 2}
                  className="text-center py-12"
                >
                    <div className="flex justify-center">
                  <Spinner size="lg" />
                    </div>
                  </TableCell>
                </TableRow>
            ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={Object.values(visibleColumns).filter(Boolean).length + 2}
                  className="text-center py-6 text-red-400"
                >
                  Error: {error?.message || "Error loading expenses"}
                  </TableCell>
                </TableRow>
              ) : filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={Object.values(visibleColumns).filter(Boolean).length + 2}
                    className="py-12 text-gray-400 text-center"
                    style={{ border: "none" }}
                  >
                    <span className="text-lg whitespace-nowrap">
                      {searchTerm ? "No expenses match your search." : "No expenses found."}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((exp) => (
                  <TableRow
                  key={exp._id}
                    className={`border-gray-400/20 hover:bg-white/5 transition-colors ${
                      selectedRows.has(exp._id) ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <TableCell className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(exp._id)}
                        onChange={() => handleRowSelect(exp._id)}
                        className="text-purple-500 focus:ring-purple-500"
                      />
                    </TableCell>
                    {visibleColumns.category && (
                      <TableCell className="text-white">
                      {getCategoryName(exp.category, categories)}
                      </TableCell>
                  )}
                    {visibleColumns.title && (
                      <TableCell className="text-white">
                    {exp.title}
                      </TableCell>
                    )}
                    {visibleColumns.note && (
                      <TableCell className="text-white">
                    {exp.note}
                      </TableCell>
                    )}
                    {visibleColumns.amount && (
                      <TableCell className="w-24 text-white">
                    {formatAmount(exp.amount)}
                      </TableCell>
                    )}
                    {visibleColumns.createdAt && (
                      <TableCell className="text-white">
                        <div>
                    {formatDate(exp.createdAt)}
                    <br />
                    <span className="text-xs text-gray-400">
                      {formatTime(exp.createdAt)}
                    </span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="w-12">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <SquarePen className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {selectedRows.size > 0 && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-white">
              {selectedRows.size} of {filteredExpenses.length} row(s) selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedRows(new Set())}
                className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Clear selection
              </button>
              <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                Export selected
              </button>
              </div>
          </div>
        </div>
      )}
      {isColumnsDropdownOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setIsColumnsDropdownOpen(false)}
        />
        )}
    </div>
  );
};

export default ExpenseTable;