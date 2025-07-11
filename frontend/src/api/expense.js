import { getAuthHeaders } from "../utils/AuthHeaders";
import { showSuccessToast } from "../utils/toast";

// Get all expenses
export const fetchExpenses = async () => {
  try {
    const response = await fetch("/api/v1/expenses", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch expenses");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get expenses by category ID
export const fetchExpensesByCategory = async (categoryId) => {
  try {
    const response = await fetch(`/api/v1/expenses/category/${categoryId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch expenses by category");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Create expense (requires categoryId)
export const createExpense = async ({ categoryId, title, amount, note }) => {
  try {
    const response = await fetch(`/api/v1/expenses/${categoryId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, amount, note }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create expense");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Update expense by expenseId
export const updateExpense = async ({ id, title, amount, note }) => {
  try {
    const response = await fetch(`/api/v1/expenses/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, amount, note }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update expense");
    }
    const data = await response.json();
    showSuccessToast("Expense updated successfully!");
    return data;
  } catch (error) {
    throw error;
  }
};

// Delete expense by expenseId
export const deleteExpense = async (id) => {
  try {
    const response = await fetch(`/api/v1/expenses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete expense");
    }
    const data = await response.json();
    showSuccessToast("Expense deleted successfully!");
    return data;
  } catch (error) {
    throw error;
  }
};

// Get total amount of all expenses
export const fetchTotalExpenses = async () => {
  try {
    const response = await fetch("/api/v1/expenses/total", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch total expenses");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get recent expenses (limit to 5)
export const fetchRecentExpenses = async (limit = 5) => {
  try {
    const response = await fetch(`/api/v1/expenses?limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch recent expenses");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get daily expenses for current month
export const fetchDailyExpenses = async () => {
  try {
    const response = await fetch("/api/v1/expenses/daily", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch daily expenses");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw error;
  }
};
