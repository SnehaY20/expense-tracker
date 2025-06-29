import { useState, useEffect } from "react";
import { getOverviewData } from "../api/overview";
import { fetchCategories } from "../api/category";
import { showErrorToast } from "../utils/toast";

export const useOverviewData = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewResponse, categoriesResponse] = await Promise.all([
        getOverviewData("month"),
        fetchCategories(),
      ]);
      setData(overviewResponse.data);
      setCategories(categoriesResponse);
    } catch (err) {
      console.error("Error fetching overview data:", err);
      setError(err.message || "Failed to fetch overview data");
      showErrorToast("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transform data for components
  const transformedData = data
    ? {
        summaryStats: data.summaryStats,
        topCategories: data.topCategories.map((item) => ({
          name: item.categoryName,
          amount: item.amount,
        })),
        pieChartData: data.expenseDistribution.map((item) => ({
          name: item.categoryName,
          value: item.amount,
        })),
        monthlyData: data.monthlyTrend.map((item) => ({
          month: item.month,
          amount: item.amount,
        })),
        recentExpenses: data.recentExpenses.map((expense) => ({
          ...expense,
          category: expense.category._id || expense.category,
        })),
        budgetStatus: data.budgetStatus,
      }
    : null;

  return {
    data: transformedData,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
};
