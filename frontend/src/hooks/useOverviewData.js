import { useState } from "react";
import { fetchExpenses, createExpense } from "../api/expense";
import { fetchCategories } from "../api/category";
import {
  getCurrentMonthExpenses,
  getCategoryTotals,
  getMonthlyData,
  getTopCategories,
  getRecentExpenses,
  getHighestSpentCategory,
  calculateTotalExpenses,
  preparePieChartData,
} from "../utils/OverviewFunctions";

export const useOverviewData = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesData, categoriesData] = await Promise.all([
        fetchExpenses(),
        fetchCategories(),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (formData) => {
    try {
      await createExpense({
        categoryId: formData.categoryId,
        title: formData.title,
        amount: parseFloat(formData.amount),
        note: formData.note,
      });
      setShowQuickAdd(false);
      fetchData();
    } catch (error) {
       showErrorToast("Failed to add expense");
    }
  };

  // Process data
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const categoryTotals = getCategoryTotals(currentMonthExpenses);
  const totalThisMonth = calculateTotalExpenses(currentMonthExpenses);
  const highestCategory = getHighestSpentCategory(categoryTotals);
  const topCategories = getTopCategories(categoryTotals);
  const recentExpenses = getRecentExpenses(expenses);
  const pieChartData = preparePieChartData(categoryTotals);
  const monthlyData = getMonthlyData(expenses);

  return {
    // State
    loading,
    showQuickAdd,
    setShowQuickAdd,

    // Data
    categories,
    totalThisMonth,
    highestCategory,
    topCategories,
    recentExpenses,
    pieChartData,
    monthlyData,

    // Actions
    fetchData,
    handleQuickAdd,
  };
};
