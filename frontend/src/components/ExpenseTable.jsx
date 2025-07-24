import React, { useState, useMemo } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import Spinner from "./Spinner";
import { deleteExpense } from "../api/expense";
import { formatDate, formatTime, formatAmount, getCategoryName } from "../utils/expenseTableUtils";
import ExpenseDeleteModal from "./ExpenseDeleteModal";
import ExpenseTableControls from "./ExpenseTableControls";
import ExpenseEditModal from "./ExpenseEditModal";
import { useQueryClient } from "@tanstack/react-query";
import CategoryForm from "./CategoryForm";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const queryClient = useQueryClient();

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

  const handleAddCategory = () => {
    setShowCategoryModal(true);
  };

  const handleCategoryModalClose = async () => {
    setShowCategoryModal(false);
    // Refresh categories after adding new one
    await queryClient.invalidateQueries(['categories']);
  };

  const rowHeight = 64;
  const headerHeight = 56;
  const maxHeight = maxVisibleRows ? `${headerHeight + maxVisibleRows * rowHeight + 12}px` : undefined;

  return (
    <div className="relative w-full">
      <ExpenseTableControls
        filteredExpenses={filteredExpenses}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deleting={deleting}
        setDeleting={setDeleting}
        onDelete={async () => {
          setDeleting(true);
          for (const id of selectedRows) {
            try { await deleteExpense(id); } catch {}
          }
          setDeleting(false);
          setShowDeleteModal(false);
          setSelectedRows(new Set());
          await queryClient.invalidateQueries(['expenses']);
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        visibleColumns={visibleColumns}
        handleColumnToggle={handleColumnToggle}
        showAddCategoryButton={showAddCategoryButton}
        onAddCategory={handleAddCategory}
        showAddExpenseButton={showAddExpenseButton}
        onAddExpense={onAddExpense}
        showTotalBelow={showTotalBelow}
        customTotal={customTotal}
        isColumnsDropdownOpen={isColumnsDropdownOpen}
        setIsColumnsDropdownOpen={setIsColumnsDropdownOpen}
      />
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
                <TableHead className="w-32 text-purple-300 font-semibold">
                  {selectedRows.size > 0 && (
                    <div className="flex items-center justify-start gap-1">
                      <button
                        className="p-1 rounded-full hover:bg-red-500/20 transition-colors flex-shrink-0"
                        onClick={() => setShowDeleteModal(true)}
                        title="Delete selected"
                      >
                        <Trash2 className="text-red-500 h-5 w-5" />
                      </button>
                      <span className="text-white text-xs font-semibold whitespace-nowrap">{selectedRows.size} selected</span>
                    </div>
                  )}
                </TableHead>
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
                    <TableCell className="w-32">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-white transition-colors" onClick={() => { setEditingExpense(exp); setShowEditModal(true); }}>
                          <SquarePen className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ExpenseDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          setDeleting(true);
          for (const id of selectedRows) {
            try { await deleteExpense(id); } catch {}
          }
          setDeleting(false);
          setShowDeleteModal(false);
          setSelectedRows(new Set());
          await queryClient.invalidateQueries(['expenses']);
        }}
        deleting={deleting}
        selectedCount={selectedRows.size}
      />
      <ExpenseEditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        expense={editingExpense}
        onUpdate={async () => {
          await queryClient.invalidateQueries(['expenses']);
          setShowEditModal(false);
        }}
      />
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/10 border border-gray-400/30 rounded-2xl p-8 w-full max-w-xl mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-purple-300 mb-6 text-center">Add New Category</h2>
            <CategoryForm
              categories={categories}
              onClose={handleCategoryModalClose}
            />
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