import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/category";
import { updateExpense } from "../api/expense";
import Spinner from "./Spinner";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const ExpenseEditModal = ({ show, onClose, expense, onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [form, setForm] = useState({
    category: "",
    title: "",
    amount: "",
    note: ""
  });
  const [updating, setUpdating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [original, setOriginal] = useState({ category: '', title: '', amount: '', note: '' });

  useEffect(() => {
    if (show) {
      setLoadingCategories(true);
      fetchCategories()
        .then((cats) => setCategories(cats))
        .catch(() => setCategories([]))
        .finally(() => setLoadingCategories(false));
      if (expense) {
        setForm({
          category: expense.category,
          title: expense.title,
          amount: expense.amount,
          note: expense.note || ""
        });
        setOriginal({
          category: expense.category,
          title: expense.title,
          amount: expense.amount,
          note: expense.note || ""
        });
      }
    }
  }, [show, expense]);

  useEffect(() => {
    if (expense && categories.length > 0) {
      const cat = categories.find(c => c._id === expense.category);
      setSelectedCategory(cat || null);
    }
  }, [expense, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateExpense({
        id: expense._id,
        title: form.title,
        amount: Number(form.amount),
        note: form.note,
        category: form.category
      });
      showSuccessToast("Expense updated successfully!");
      onUpdate && onUpdate();
      onClose();
    } catch (err) {
      showErrorToast(err.message || "Failed to update expense");
    } finally {
      setUpdating(false);
    }
  };

  const isUnchanged =
    form.category === original.category &&
    form.title === original.title &&
    String(form.amount) === String(original.amount) &&
    form.note === original.note;

  if (!show || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-purple-200 mb-6 text-center">Edit Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
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
                {loadingCategories ? (
                  <div className="px-4 py-3 flex justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, category: cat._id }));
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-blue-600 transition-colors border-b border-gray-600/30 last:border-b-0"
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
              required
              placeholder="Expense title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
              required
              placeholder="Amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Note</label>
            <input
              name="note"
              type="text"
              value={form.note}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
              placeholder="Note (optional)"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updating || !form.title || !form.amount || !form.category || isUnchanged}
            >
              {updating && <Spinner size="sm" className="mr-2" />}
              {updating ? "Updating..." : "Update Expense"}
            </button>
            <button
              type="button"
              className="flex-1 py-2 px-4 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={updating}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseEditModal; 