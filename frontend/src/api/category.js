import { getAuthHeaders } from "../utils/AuthHeaders";
import { showSuccessToast, showErrorToast } from "../utils/toast";

// Get all categories
export const fetchCategories = async () => {
  try {
    const response = await fetch("/api/v1/category", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch categories");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};

// Get category by ID
export const fetchCategoryById = async (id) => {
  try {
    const response = await fetch(`/api/v1/category/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch category");
    }

    return response.json();
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};

// Create category
export const createCategory = async ({ name }) => {
  try {
    const response = await fetch("/api/v1/category", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create category");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};

// Update category
export const updateCategory = async ({ id, name }) => {
  try {
    const response = await fetch(`/api/v1/category/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update category");
    }

    const data = await response.json();
    showSuccessToast("Category updated successfully!");
    return data;
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`/api/v1/category/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete category");
    }

    const data = await response.json();
    showSuccessToast("Category deleted successfully!");
    return data;
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};
