import { getAuthHeaders } from "../utils/AuthHeaders";
import { showSuccessToast } from "../utils/toast";

// Get budget
export const fetchBudget = async () => {
  const response = await fetch("/api/v1/budget", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const result = await response.json();
  return result.data;
};

// Create  budget
export const createBudget = async ({ amount }) => {
  const response = await fetch("/api/v1/budget", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const data = await response.json();
  showSuccessToast("Budget created successfully!");
  return data;
};

// Update budget 
export const updateBudget = async ({ id, amount }) => {
  const response = await fetch(`/api/v1/budget/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const data = await response.json();
  showSuccessToast("Budget updated successfully!");
  return data;
};

// Delete budget 
export const deleteBudget = async (id) => {
  const response = await fetch(`/api/v1/budget/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const data = await response.json();
  showSuccessToast("Budget deleted successfully!");
  return data;
};
