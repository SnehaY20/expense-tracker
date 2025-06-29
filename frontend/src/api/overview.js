import { getAuthHeaders } from "../utils/AuthHeaders.js";


// Get recent expenses
export const getRecentExpenses = async (limit = 10) => {
  try {
    const response = await fetch(
      `/api/v1/overview/recent-expenses?limit=${limit}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch recent expenses");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

// Get comprehensive overview data (all insights in one call)
export const getOverviewData = async (period = "month") => {
  try {
    const response = await fetch(`/api/v1/overview?period=${period}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch overview data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
