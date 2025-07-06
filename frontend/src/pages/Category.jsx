import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/category";
import { fetchExpensesByCategory } from "../api/expense";
import BackgroundLayout from "../components/BackgroundLayout";
import CategoryForm from "../components/CategoryForm";
import CategoryItem from "../components/CategoryItem";
import ExpenseTable from "../components/ExpenseTable";
import Card from "../components/Card";
import {
  CategoryListSkeleton,
  ExpenseTableSkeleton,
} from "../components/Skeleton";

const Category = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Get all categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Get expenses for selected category
  const {
    data: expenses = [],
    isLoading: expensesLoading,
    isError: expensesError,
    error: expensesErrorMessage,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ["expenses", selectedCategoryId],
    queryFn: () => fetchExpensesByCategory(selectedCategoryId),
    enabled: !!selectedCategoryId,
    staleTime: 0, 
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category._id);
    setSelectedCategoryName(category.name);
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <BackgroundLayout>
      <div className="pt-28 mb-8 max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
              >
                Add Category
              </button>
            </div>

            {showAddForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Card className="relative w-full max-w-md mx-4 p-8 mb-4">
                  <button
                    className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
                    onClick={() => setShowAddForm(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <CategoryForm
                    categories={categories}
                    onClose={() => setShowAddForm(false)}
                  />
                </Card>
              </div>
            )}

            <Card>
              {categoriesLoading ? (
                <CategoryListSkeleton items={5} />
              ) : categories.length === 0 ? (
                <p className="text-gray-300 text-center py-4">
                  No categories found
                </p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <CategoryItem 
                      key={category._id} 
                      category={category}
                      isSelected={selectedCategoryId === category._id}
                      onClick={() => handleCategoryClick(category)}
                    />
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Expenses Table */}
          <div className="lg:col-span-2">
            {selectedCategoryName && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCategoryName} Expenses
                  </h2>
                  <button
                    onClick={() => refetchExpenses()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                <Card className="overflow-x-auto">
                  {expensesLoading ? (
                    <ExpenseTableSkeleton showCategory={false} />
                  ) : (
                    <ExpenseTable
                      expenses={expenses}
                      isLoading={expensesLoading}
                      isError={expensesError}
                      error={expensesErrorMessage}
                      categories={categories}
                      showTotal={false}
                      showCategory={false}
                      showTotalBelow={false}
                    />
                  )}
                </Card>
                <div className="flex justify-end mt-4">
                  <span className="text-3xl font-bold text-green-400">
                    Total: ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Category;
