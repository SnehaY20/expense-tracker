import { getAuthHeaders } from "../utils/AuthHeaders.js";


// Get budget status
export const getBudgetStatus = async (period = "month") => {
  try {
    const response = await fetch(`/api/v1/budget/status?period=${period}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch budget status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Update user budget
export const updateBudget = async (budgetData) => {
  try {
    const response = await fetch(`/api/v1/budget`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update budget");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Get user's current budget settings
export const getBudgetSettings = async () => {
  try {
    const response = await fetch(`/api/v1/budget/settings`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch budget settings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
