module.exports = {
  AUTH: {
    NO_TOKEN: "No token provided. Authorization denied.",
    INVALID_TOKEN: "Token is not valid or has expired.",
    USER_NOT_FOUND: "User not found.",
    INVALID_CREDENTIALS: "Invalid credentials",
    MISSING_FIELDS: "Please provide all required fields",
  },
  CATEGORY: {
    EXISTS: "Category already exists",
    NOT_FOUND: "Category does not exist",
    DUPLICATE: "Another category with the same name exists",
  },
  EXPENSE: {
    NOT_FOUND: "Expense doesn't exist",
    CREATED: "Expense created successfully",
    UPDATED: "Expense updated successfully",
    DELETED: "Expense deleted successfully",
  },
  PASSWORD: {
    INCORRECT: "Password is incorrect",
    UPDATED: "Password updated successfully",
  },
  BUDGET: {
    UPDATED: "Budget updated successfully",
    INVALID_AMOUNT: "Budget amount must be a positive number",
  },
  INSIGHTS: {
    NO_DATA: "No data available for insights",
    INVALID_PERIOD: "Invalid time period specified",
  },
  SERVER_ERROR: "Server Error",
};
