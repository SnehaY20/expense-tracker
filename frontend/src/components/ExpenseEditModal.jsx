import React, { useEffect, useState } from "react";
import { fetchCategories, updateCategory } from "../api/category";
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [original, setOriginal] = useState({ category: '', title: '', amount: '', note: '' });
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryName, setEditingCategoryName] = useState("");

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
      if (cat) {
        setEditingCategoryName(cat.name);
      }
    }
  }, [expense, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryEdit = () => {
    setIsEditingCategory(true);
  };

  const handleCategorySave = () => {
    if (!editingCategoryName.trim()) return;
    
    setSelectedCategory(prev => ({ ...prev, name: editingCategoryName.trim() }));
    setIsEditingCategory(false);
  };

  const handleCategoryCancel = () => {
    setIsEditingCategory(false);
    setEditingCategoryName(selectedCategory?.name || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      if (selectedCategory && editingCategoryName !== categories.find(c => c._id === selectedCategory._id)?.name) {
        try {
          await updateCategory({
            id: selectedCategory._id,
            name: editingCategoryName.trim()
          });
          
          setCategories(prev => 
            prev.map(cat => 
              cat._id === selectedCategory._id 
                ? { ...cat, name: editingCategoryName.trim() }
                : cat
            )
          );
        } catch (categoryError) {
          showErrorToast(categoryError.message || "Failed to update category");
          return;
        }
      }

      await updateExpense({
        id: expense._id,
        title: form.title,
        amount: Number(form.amount),
        note: form.note,
        category: form.category
      });
      
      showSuccessToast("Updated successfully!");
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

  const isCategoryChanged = selectedCategory && 
    editingCategoryName !== categories.find(c => c._id === selectedCategory._id)?.name;

  const hasChanges = !isUnchanged || isCategoryChanged;

  if (!show || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-purple-200 mb-6 text-center">Edit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            {loadingCategories ? (
              <div className="flex items-center justify-center py-3">
                <Spinner size="sm" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {isEditingCategory ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Category name"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleCategorySave}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!editingCategoryName.trim() || editingCategoryName === selectedCategory?.name}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCategoryCancel}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                    <span className="text-white font-medium">
                      {selectedCategory ? selectedCategory.name : "No category"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCategoryEdit}
                      className="ml-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                      disabled={!selectedCategory}
                    >
                      Edit
                    </button>
                  </div>
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
              disabled={updating || !form.title || !form.amount || !form.category || !hasChanges}
            >
              {updating && <Spinner size="sm" className="mr-2" />}
              {updating ? "Updating..." : "Update"}
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