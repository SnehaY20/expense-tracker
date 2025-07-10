import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createExpense } from "../api/expense";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import Button from "./Button";
import Input from "./Input";
import Spinner from "./Spinner";

const ExpenseModal = ({
  isOpen,
  onClose,
  categories = [],
  isCategoriesLoading = false,
  isCategoriesError = false,
  categoriesError = null,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      setTitle("");
      setAmount("");
      setNote("");
      setCategoryId("");
      setSelectedCategory(null);
      setIsDropdownOpen(false);
      showSuccessToast("Expense added successfully!");
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      showErrorToast(error.message || "Failed to add expense");
    },
  });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || !categoryId) {
      showErrorToast("Please fill in all required fields");
      return;
    }
    createExpenseMutation.mutate({
      categoryId,
      title: title.trim(),
      amount: parseFloat(amount),
      note: note.trim(),
    });
  };

  const handleClose = () => {
    setTitle("");
    setAmount("");
    setNote("");
    setCategoryId("");
    setSelectedCategory(null);
    setIsDropdownOpen(false);
    onClose();
  };

  const handleCategorySelect = (category) => {
    setCategoryId(category._id);
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/10 border border-gray-400/30 rounded-2xl p-8 w-full max-w-xl mx-4 relative shadow-2xl">
        <h2 className="text-xl font-semibold text-purple-300 mb-6 text-center">
          Add Expense
        </h2>
        <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white/20 border border-gray-400/30 outline-none rounded-lg px-3 py-3 pr-12 text-base text-gray-400 focus:ring-2 focus:ring-purple-400 transition w-full appearance-none text-left"
            >
              {selectedCategory ? (
                <span className="text-white">{selectedCategory.name}</span>
              ) : (
                "Category"
              )}
            </button>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 border border-gray-400/30 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {isCategoriesLoading ? (
                  <div className="px-4 py-3 flex justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-blue-600 transition-colors border-b border-gray-600/30 last:border-b-0"
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="relative">
            <Input
              // type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
              step={0.01}
              required
              className="pr-12 appearance-none"
              style={{ MozAppearance: "textfield" }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
              <button
                type="button"
                className="w-6 h-3 bg-white/20 hover:bg-white/30 border border-gray-400/30 text-white text-xs flex items-center justify-center rounded-t transition"
                onClick={() =>
                  setAmount((prev) =>
                    prev ? (parseFloat(prev) + 1).toString() : "1"
                  )
                }
              >
                ▲
              </button>
              <button
                type="button"
                className="w-6 h-3 bg-white/20 hover:bg-white/30 border border-gray-400/30 text-white text-xs flex items-center justify-center rounded-b transition"
                onClick={() =>
                  setAmount((prev) =>
                    prev && parseFloat(prev) > 0
                      ? (parseFloat(prev) - 1).toString()
                      : "0"
                  )
                }
              >
                ▼
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              className="px-8 py-3 shadow transition border border-gray-400/30 flex items-center justify-center"
              disabled={createExpenseMutation.isPending || !categoryId}
            >
              {createExpenseMutation.isPending && <Spinner size="sm" className="mr-2" />}
              {createExpenseMutation.isPending ? "Adding..." : "Add expense"}
            </Button>
            <Button
              type="button"
              variant="gray"
              className="px-8 py-3"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
          {isCategoriesError && (
            <div className="text-red-400 mb-2">
              Error: {categoriesError.message}
            </div>
          )}
          {createExpenseMutation.isError && (
            <div className="text-red-400 mb-2">
              Error: {createExpenseMutation.error.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
