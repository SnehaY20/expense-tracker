import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchTotalExpenseByCategory } from "../api/category";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

const Category = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);
  const categoryListRef = useRef(null);
  const [categoryTotal, setCategoryTotal] = useState(0);

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

  // Fetch total expense for selected category
  useEffect(() => {
    const getTotal = async () => {
      if (selectedCategoryId) {
        try {
          const total = await fetchTotalExpenseByCategory(selectedCategoryId);
          setCategoryTotal(total || 0);
        } catch {
          setCategoryTotal(0);
        }
      } else {
        setCategoryTotal(0);
      }
    };
    getTotal();
  }, [selectedCategoryId]);

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category._id);
    setSelectedCategoryName(category.name);
  };

  const scrollCategoryList = (direction) => {
    const container = categoryListRef.current;
    if (!container) return;
    const scrollAmount = 200;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    const container = categoryListRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftChevron(scrollLeft > 0);
    setShowRightChevron(scrollLeft < scrollWidth - clientWidth - 5);
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      setTimeout(checkScrollPosition, 100);
    }
  }, [categories]);

  return (
    <BackgroundLayout>
      <div className="fixed top-16 left-14 right-0 z-40 backdrop-blur-sm">
        <div className="flex items-center h-16 gap-2 px-8">
          {showLeftChevron && (
            <button 
              onClick={() => scrollCategoryList("left")}
              className="text-white hover:text-pink-400 transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
          )}
          <div className="flex-1 overflow-hidden">
            <ul 
              ref={categoryListRef} 
              className="flex gap-2 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={checkScrollPosition}
            >
              {categoriesLoading ? (
                <CategoryListSkeleton items={5} />
              ) : categories.length === 0 ? (
                <p className="text-gray-300 text-center py-4">No categories found</p>
              ) : (
                categories.map((category) => (
                  <CategoryItem 
                    key={category._id} 
                    category={category}
                    isSelected={selectedCategoryId === category._id}
                    onClick={() => handleCategoryClick(category)}
                    horizontal
                  />
                ))
              )}
            </ul>
          </div>
          {/* Right Chevron */}
          {showRightChevron && (
            <button 
              onClick={() => scrollCategoryList("right")}
              className="text-white hover:text-pink-400 transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      </div>
      <div className="pt-32 mb-8 max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            {selectedCategoryId && (
              <ExpenseTable
                expenses={expenses}
                isLoading={expensesLoading}
                isError={expensesError}
                error={expensesErrorMessage}
                categories={categories}
                showTotal={false}
                showCategory={false}
                showTotalBelow={true}
                columnsDropdownNextToSearch={false}
                showAddCategoryButton={true}
                onAddCategory={() => setShowAddForm(true)}
                customTotal={categoryTotal}
                maxVisibleRows={3}
              />
            )}
          </div>
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
      </div>
    </BackgroundLayout>
  );
};

export default Category;