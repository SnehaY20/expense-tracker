import React, { useState } from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseTable from "../components/ExpenseTable";
import { ExpenseTableSkeleton } from "../components/Skeleton";
import { useAuth } from "../store/AuthStore";
import { useSidebar } from "../components/Sidebar";
import { useCategories, useExpenses } from "../hooks/useApi";

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn, authChecked } = useAuth();
  const { open } = useSidebar();
  const sidebarWidth = open ? 190 : 80;

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const {
    data: expenses = [],
    isLoading: isExpensesLoading,
    isError: isExpensesError,
    error: expensesError,
    refetch: refetchExpenses,
  } = useExpenses();

  if (!authChecked) return null;
  if (!isLoggedIn) return null;

  return (
    <BackgroundLayout>
      <div className="w-full px-2 sm:px-4 md:px-6">
        <div
          className="w-2xl transition-all duration-300 mt-4 mb-6"
          style={{ marginLeft: sidebarWidth }}
        >
          <ExpenseModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            isCategoriesError={isCategoriesError}
            categoriesError={categoriesError}
            onSuccess={refetchExpenses}
          />
          <div className="text-white w-full min-h-screen">
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
                showAddCategoryButton={true}  
                onAddExpense={() => setShowModal(true)}
                maxVisibleRows={8}
              />
            )}
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Expenses;