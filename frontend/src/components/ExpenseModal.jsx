import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createExpense } from "../api/expense";

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

  // expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      setTitle("");
      setAmount("");
      setNote("");
      setCategoryId("");
      onClose();
      if (onSuccess) onSuccess();
    },
  });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || !categoryId) return;
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/10 border border-gray-400/30 rounded-2xl p-8 w-full max-w-xl mx-4 relative shadow-2xl">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-blue-300 mb-6 text-center">
          Add Expense
        </h2>
        <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-4">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-white/20 border border-gray-400/30 outline-none rounded-lg px-6 py-3 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition"
            required
          >
            <option value="">Category</option>
            {isCategoriesLoading ? (
              <option disabled>Loading...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/20 border border-gray-400/30 outline-none rounded-lg px-6 py-3 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-white/20 border border-gray-400/30 outline-none rounded-lg px-6 py-3 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white/20 border border-gray-400/30 outline-none rounded-lg px-6 py-3 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition appearance-auto"
            min="0"
            step="0.01"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow transition border border-gray-400/30 mt-2"
            disabled={createExpenseMutation.isLoading || !categoryId}
          >
            {createExpenseMutation.isLoading ? "Adding..." : "Add expense"}
          </button>
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
          {createExpenseMutation.isSuccess && (
            <div className="text-green-400 mb-2">
              Expense added successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
