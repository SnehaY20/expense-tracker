import {getAuthHeaders} from "../utils/AuthHeaders"

// Get all categories
export const fetchCategories = async () => {
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
    // return response.json();
  };
  
  
  // Get category by ID
  export const fetchCategoryById = async (id) => {
    const response = await fetch(`/api/v1/category/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch category");
    }
  
    return response.json();
  };
  
  // Create category
  export const createCategory = async ({ name }) => {
    const response = await fetch("/api/v1/category", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create category");
    }
  
    return response.json();
  };
  
  // Update category
  export const updateCategory = async ({ id, name }) => {
    const response = await fetch(`/api/v1/category/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update category");
    }
  
    return response.json();
  };
  
  // Delete category
  export const deleteCategory = async (id) => {
    const response = await fetch(`/api/v1/category/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete category");
    }
  
    return response.json();
  };
  