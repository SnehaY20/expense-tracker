// Get current month expenses
export const getCurrentMonthExpenses = (expenses) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.createdAt);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
};

// Get category total from expenses
export const getCategoryTotals = (expenses) => {
  const totals = {};
  expenses.forEach((expense) => {
    const categoryName = expense.category?.name || "Unknown";
    totals[categoryName] = (totals[categoryName] || 0) + expense.amount;
  });
  return totals;
};

// Get monthly data for trend chart
export const getMonthlyData = (expenses) => {
  const monthlyData = {};
  const now = new Date();

  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    monthlyData[monthKey] = 0;
  }

  // Calculate expenses for each month
  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.createdAt);
    const monthKey = expenseDate.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    if (monthlyData.hasOwnProperty(monthKey)) {
      monthlyData[monthKey] += expense.amount;
    }
  });

  return Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount: parseFloat(amount.toFixed(2)),
  }));
};

// Get top categories by spending
export const getTopCategories = (categoryTotals, limit = 5) => {
  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

// Get recent expenses
export const getRecentExpenses = (expenses, limit = 10) => {
  return expenses
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

// Get highest spent category
export const getHighestSpentCategory = (categoryTotals) => {
  return Object.entries(categoryTotals).reduce(
    (max, [name, amount]) => (amount > max.amount ? { name, amount } : max),
    { name: "None", amount: 0 }
  );
};

// total expenses
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// Prepare pie chart data
export const preparePieChartData = (categoryTotals) => {
  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));
};
