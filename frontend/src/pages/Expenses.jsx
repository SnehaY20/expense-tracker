import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/category";
import { fetchExpenses } from "../api/expense";
import BackgroundLayout from "../components/BackgroundLayout";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseTable from "../components/ExpenseTable";
import Button from "../components/Button";
import { ExpenseTableSkeleton } from "../components/Skeleton";

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
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
  });

  return (
    <BackgroundLayout>
      <div className="pt-28 mb-8 w-full px-2 sm:px-6">
        <div className="bg-white/5 rounded-2xl p-6 text-white shadow-lg border border-gray-700/30 w-full overflow-x-auto">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 shadow transition border border-gray-400/30"
            >
              Add Expense
            </Button>
          </div>

          <ExpenseModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            isCategoriesError={isCategoriesError}
            categoriesError={categoriesError}
            onSuccess={refetchExpenses}
          />

          <div className="text-center text-white text-xl font-semibold mb-4 mt-2 tracking-wide">
            Recent Expenses
          </div>

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
            />
          )}
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Expenses;
