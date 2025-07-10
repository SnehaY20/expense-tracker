import { getAuthHeaders } from "../utils/AuthHeaders";
import { showSuccessToast, showErrorToast } from "../utils/toast";

// Get budget
export const fetchBudget = async () => {
  try {
    const response = await fetch("/api/v1/budget", {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch budget");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    if (!error.message.includes("not found")) {
      showErrorToast(error.message);
    }
    throw error;
  }
};

// Create  budget
export const createBudget = async ({ amount }) => {
  try {
    const response = await fetch("/api/v1/budget", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create budget");
    }
    const data = await response.json();
    showSuccessToast("Budget created successfully!");
    return data;
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};

// Update budget 
export const updateBudget = async ({ id, amount }) => {
  try {
    const response = await fetch(`/api/v1/budget/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update budget");
    }
    const data = await response.json();
    showSuccessToast("Budget updated successfully!");
    return data;
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};

// Delete budget 
export const deleteBudget = async (id) => {
  try {
    const response = await fetch(`/api/v1/budget/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete budget");
    }
    const data = await response.json();
    showSuccessToast("Budget deleted successfully!");
    return data;
  } catch (error) {
    showErrorToast(error.message);
    throw error;
  }
};
