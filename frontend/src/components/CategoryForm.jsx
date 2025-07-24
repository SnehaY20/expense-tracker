import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/category.js";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import Button from "./Button";
import Input from "./Input";
import Spinner from "./Spinner";

const CategoryForm = ({ categories = [], onClose }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const queryClient = useQueryClient();

  // category mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setNewCategoryName("");
      showSuccessToast("Category added successfully!");
      if (onClose) onClose();
    },
    onError: (error) => {
      showErrorToast(error.message || "Failed to add category");
    },
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      showErrorToast("Please enter a category name");
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      showErrorToast("Category already exists.");
      return;
    }

    createMutation.mutate({ name: trimmedName });
  };

  const handleCancel = () => {
    setNewCategoryName("");
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleAddCategory} className="space-y-3">
      <Input
        type="text"
        placeholder="Enter category name"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="px-4 py-2 disabled:opacity-50 flex items-center justify-center"
        >
          {createMutation.isPending && <Spinner size="sm" className="mr-2" />}
          {createMutation.isPending ? "Adding..." : "Add"}
        </Button>
        <Button
          type="button"
          onClick={handleCancel}
          variant="gray"
          className="px-4 py-2"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;