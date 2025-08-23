import React, { useMemo } from "react";
import { useBudget, useTopCategories, useTotalExpenses, useDailyExpenses } from "./useApi";

export const useOverviewData = () => {
  const { data: topCategories = [], isLoading: isTopCategoriesLoading } = useTopCategories();
  const { data: budget, isLoading: isBudgetLoading } = useBudget();
  const { data: totalExpenses = 0, isLoading: isTotalExpensesLoading } = useTotalExpenses();
  const { data: dailyExpenses = [], isLoading: isDailyExpensesLoading } = useDailyExpenses();

  const highestCategory = useMemo(() => {
    if (topCategories.length === 0) return { name: "None", amount: 0 };
    return {
      name: topCategories[0].name,
      amount: topCategories[0].totalAmount || topCategories[0].amount || 0
    };
  }, [topCategories]);

  const pieChartData = useMemo(() => {
    return topCategories.map(category => ({
      name: category.name,
      value: category.totalAmount || category.amount || 0
    }));
  }, [topCategories]);

  const isLoading = useMemo(() => {
    return isTopCategoriesLoading || isBudgetLoading || isTotalExpensesLoading || isDailyExpensesLoading;
  }, [isTopCategoriesLoading, isBudgetLoading, isTotalExpensesLoading, isDailyExpensesLoading]);

  return {
    topCategories,
    budget,
    totalExpenses,
    dailyExpenses,
    highestCategory,
    pieChartData,

    isLoading,
    isTopCategoriesLoading,
    isBudgetLoading,
    isTotalExpensesLoading,
    isDailyExpensesLoading,
  };
};