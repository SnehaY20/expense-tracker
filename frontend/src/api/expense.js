import { getAuthHeaders } from "../utils/AuthHeaders";

// Get all expenses
export const fetchExpenses = async () => {
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
};

// Get expenses by category ID
export const fetchExpensesByCategory = async (categoryId) => {
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
};

// Create expense (requires categoryId)
export const createExpense = async ({ categoryId, title, amount, note }) => {
  const response = await fetch(`/api/v1/expenses/${categoryId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, amount, note }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create expense");
  }
  return response.json();
};

// Update expense by expenseId
export const updateExpense = async ({ id, title, amount, note }) => {
  const response = await fetch(`/api/v1/expenses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, amount, note }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update expense");
  }
  return response.json();
};

// Delete expense by expenseId
export const deleteExpense = async (id) => {
  const response = await fetch(`/api/v1/expenses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete expense");
  }
  return response.json();
};
