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
  SERVER_ERROR: "Server Error",
  BUDGET: {
    NOT_FOUND: "Budget not found",
    CREATED: "Budget created successfully",
    UPDATED: "Budget updated successfully",
    DELETED: "Budget deleted successfully",
    ALREADY_SET:
      "Budget already set. Please update it if you want to change the amount.",
  },
};
