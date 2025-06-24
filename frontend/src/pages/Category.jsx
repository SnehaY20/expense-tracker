import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/category.js";
import { fetchExpensesByCategory } from "../api/expense.js";
import BackgroundLayout from "../components/BackgroundLayout";
import CategoryForm from "../components/CategoryForm";
import ExpenseTable from "../components/ExpenseTable";

const Category = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Get all categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorMessage,
  } = useQuery({
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

 

  if (categoriesLoading)
    return (
      <div className="text-center mt-4 text-white">Loading categories...</div>
    );
  if (categoriesError)
    return (
      <div className="text-center mt-4 text-red-500">
        Error: {categoriesErrorMessage.message}
      </div>
    );

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
                + Add Category
              </button>
            </div>

            {showAddForm && (
              <CategoryForm
                categories={categories}
                onClose={() => setShowAddForm(false)}
              />
            )}

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
              {categories.length === 0 ? (
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
            </div>
          </div>

          {/* Expenses Table */}
          <div className="lg:col-span-2">
            {selectedCategoryName && (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedCategoryName} Expenses
                </h2>
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
                  <ExpenseTable
                    expenses={expenses}
                    isLoading={expensesLoading}
                    isError={expensesError}
                    error={expensesErrorMessage}
                    categories={categories}
                    showTotal={true}
                    showCategory={false}
                  />
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
