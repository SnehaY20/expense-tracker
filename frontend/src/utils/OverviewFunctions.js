// Get recent expenses 
export const getRecentExpenses = (expenses, limit = 10) => {
  return expenses
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};
