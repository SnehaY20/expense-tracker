import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/category.js";

const CategoryForm = ({ categories = [], onClose }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const queryClient = useQueryClient();

  // category mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setNewCategoryName("");
      if (onClose) onClose();
    },
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      alert("Category already exists.");
      return;
    }

    createMutation.mutate({ name: trimmedName });
  };

  const handleCancel = () => {
    setNewCategoryName("");
    if (onClose) onClose();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 mb-4">
      <form onSubmit={handleAddCategory} className="space-y-3">
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            {createMutation.isLoading ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
