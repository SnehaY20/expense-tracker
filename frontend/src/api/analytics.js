import { getAuthHeaders } from "../utils/AuthHeaders.js";

// Get summary statistics
export const getSummaryStats = async (period = "month") => {
  try {
    const response = await fetch(`/api/v1/analytics/summary?period=${period}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch summary stats");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Get top spending categories
export const getTopCategories = async (limit = 5, period = "month") => {
  try {
    const response = await fetch(
      `/api/v1/analytics/top-categories?limit=${limit}&period=${period}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch top categories");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Get expense distribution for pie chart
export const getExpenseDistribution = async (period = "month") => {
  try {
    const response = await fetch(
      `/api/v1/analytics/expense-distribution?period=${period}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch expense distribution");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Get monthly trend data
export const getMonthlyTrend = async (months = 6) => {
  try {
    const response = await fetch(
      `/api/v1/analytics/monthly-trend?months=${months}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch monthly trend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
