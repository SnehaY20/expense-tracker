import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/category";
import { fetchExpensesByCategory } from "../api/expense";
import BackgroundLayout from "../components/BackgroundLayout";
import CategoryForm from "../components/CategoryForm";
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
  } = useQuery({
    queryKey: ["expenses", selectedCategoryId],
    queryFn: () => fetchExpensesByCategory(selectedCategoryId),
    enabled: !!selectedCategoryId,
  });

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category._id);
    setSelectedCategoryName(category.name);
  };

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
                    <li key={category._id}>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          selectedCategoryId === category._id
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                            : "bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Expenses Table */}
          <div className="lg:col-span-2">
            {selectedCategoryName && (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedCategoryName} Expenses
                </h2>
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
                      showTotalBelow={true}
                    />
                  )}
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Category;
