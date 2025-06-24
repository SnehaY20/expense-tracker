import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/category.js";
import BackgroundLayout from "../components/BackgroundLayout";

const Category = () => {
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const queryClient = useQueryClient();

  // Get all categories
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Create
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setName("");
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditId(null);
      setEditName("");
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
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

  const handleEditClick = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const handleUpdate = (catId) => {
    const trimmedName = editName.trim();
    if (!trimmedName) return;

    const isDuplicate = categories.some(
      (cat) =>
        cat.name.toLowerCase() === trimmedName.toLowerCase() &&
        cat._id !== catId
    );
    if (isDuplicate) {
      alert("Category already exists.");
      return;
    }

    updateMutation.mutate({ id: catId, name: trimmedName });
  };

  if (isLoading) return <div className="text-center mt-4">Loading...</div>;
  if (isError)
    return (
      <div className="text-center mt-4 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <BackgroundLayout>
      <div className="pt-28 mb-8 max-w-md mx-auto p-4">
        <form onSubmit={handleCreateSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-3 py-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </form>

        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              {editId === cat._id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded w-full mr-2"
                />
              ) : (
                <span>{cat.name}</span>
              )}

              <div className="flex gap-2">
                {editId === cat._id ? (
                  <button
                    onClick={() => handleUpdate(cat._id)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(cat._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </BackgroundLayout>
  );
};

export default Category;
