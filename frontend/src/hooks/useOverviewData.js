import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
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

  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const fetchData = async () => {
    if (!isLoggedIn || (!localStorage.getItem('token') && !sessionStorage.getItem('token'))) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [expensesData, categoriesData] = await Promise.all([
        fetchExpenses(),
        fetchCategories(),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      const isAuthError = error.status === 401 ||
        error.message?.includes('401') ||
        error.message?.includes('Token expired') ||
        error.message?.includes('Unauthorized');
      if (isAuthError) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (formData) => {
    if (!isLoggedIn || (!localStorage.getItem('token') && !sessionStorage.getItem('token'))) {
      logout();
      navigate("/login", { replace: true });
      return;
    }
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
      const isAuthError = error.status === 401 ||
        error.message?.includes('401') ||
        error.message?.includes('Token expired') ||
        error.message?.includes('Unauthorized');
      if (isAuthError) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      showErrorToast("Failed to add expense");
    }
  };

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