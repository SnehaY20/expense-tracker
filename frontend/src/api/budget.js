import { apiCall } from "../utils/apiClient";

// Get budget
export const fetchBudget = async () => {
  const response = await apiCall("/budget", {
    method: "GET",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const result = await response.json();
  return result.data;
};

// Create budget
export const createBudget = async ({ amount }) => {
  const response = await apiCall("/budget", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const data = await response.json();
  return data;
};

// Update budget 
export const updateBudget = async ({ id, amount }) => {
  const response = await apiCall(`/budget/${id}`, {
    method: "PUT",
    body: JSON.stringify({ amount }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const data = await response.json();
  return data;
};

// Delete budget 
export const deleteBudget = async (id) => {
  const response = await apiCall(`/budget/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Unknown error");
  }
  const data = await response.json();
  return data;
};
