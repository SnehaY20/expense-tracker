import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/category";
import { fetchExpenses } from "../api/expense";
import BackgroundLayout from "../components/BackgroundLayout";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseTable from "../components/ExpenseTable";
import { ExpenseTableSkeleton } from "../components/Skeleton";
import { useAuth } from "../store/AuthStore";

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: isLoggedIn,
  });

  // Fetch expenses
  const {
    data: expenses = [],
    isLoading: isExpensesLoading,
    isError: isExpensesError,
    error: expensesError,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) return null;

  return (
    <BackgroundLayout>
      <div className="w-full px-2 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ExpenseModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            isCategoriesError={isCategoriesError}
            categoriesError={categoriesError}
            onSuccess={refetchExpenses}
          />
          <div className="text-white w-full">
            {isExpensesLoading ? (
              <ExpenseTableSkeleton showCategory={true} />
            ) : (
              <ExpenseTable
                expenses={expenses}
                isLoading={isExpensesLoading}
                isError={isExpensesError}
                error={expensesError}
                categories={categories}
                showTotal={false}
                showTotalBelow={true}
                showAddExpenseButton={true}
                onAddExpense={() => setShowModal(true)}
                maxVisibleRows={5}
              />
            )}
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Expenses;
