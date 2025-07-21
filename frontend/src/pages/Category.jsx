import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchTotalExpenseByCategory } from "../api/category";
import { fetchExpensesByCategory } from "../api/expense";
import BackgroundLayout from "../components/BackgroundLayout";
import CategoryForm from "../components/CategoryForm";
import CategoryItem from "../components/CategoryItem";
import ExpenseTable from "../components/ExpenseTable";
import Card from "../components/Card";
import { CategoryListSkeleton } from "../components/Skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../store/AuthStore";
import { useSidebar } from "../components/Sidebar";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState({ left: false, right: false });
  const categoryListRef = useRef(null);
  const { isLoggedIn, authChecked } = useAuth();
  const { open } = useSidebar();
  const sidebarWidth = open ? 190 : 80;

  // Get all categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: isLoggedIn,
  });

  const {
    data: expenses = [],
    isLoading: expensesLoading,
    isError: expensesError,
    error: expensesErrorMessage,
  } = useQuery({
    queryKey: ["expenses", selectedCategory?._id],
    queryFn: () => fetchExpensesByCategory(selectedCategory._id),
    enabled: isLoggedIn && !!selectedCategory?._id,
  });
  const [categoryTotal, setCategoryTotal] = useState(0);
  useEffect(() => {
    const getTotal = async () => {
      if (selectedCategory?._id) {
        try {
          const total = await fetchTotalExpenseByCategory(selectedCategory._id);
          setCategoryTotal(total || 0);
        } catch {
          setCategoryTotal(0);
        }
      } else {
        setCategoryTotal(0);
      }
    };
    getTotal();
  }, [selectedCategory?._id]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const scrollCategoryList = (direction) => {
    const container = categoryListRef.current;
    if (!container) return;
    const scrollAmount = 600; 
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const checkScrollPosition = () => {
    const container = categoryListRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowScrollButtons({
      left: scrollLeft > 0,
      right: scrollLeft < scrollWidth - clientWidth - 5
    });
  };

  useEffect(() => {
    if (categories.length > 0) {
      setTimeout(checkScrollPosition, 100);
    }
  }, [categories]);

  if (!authChecked) return null;
  if (!isLoggedIn) return null;

  return (
    <BackgroundLayout>
      {/* Category Navigation */}
      <div
        className="fixed top-20 z-40 transition-all duration-300"
        style={{ left: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)`, right: 'auto', background: 'none' }}
      >
        <div className="flex items-center h-16 gap-2 px-8 justify-center">
          {categories.length > 4 && showScrollButtons.left && (
            <button
              onClick={() => scrollCategoryList("left")}
              className="text-white hover:text-pink-400 transition-colors"
              style={{ marginRight: 8 }}
            >
              <ChevronLeft size={28} />
            </button>
          )}
          <div
            className="custom-scrollbar-hide"
            style={{
              width: 624, 
              scrollSnapType: 'x mandatory',
              display: 'grid',
              gridAutoFlow: 'column',
              gridTemplateColumns: `repeat(${categories.length}, 150px)`,
              gap: '8px',
              alignItems: 'center',
              overflowX: 'auto',
            }}
            ref={categoryListRef}
            onScroll={checkScrollPosition}
          >
            {categoriesLoading ? (
              <CategoryListSkeleton items={4} />
            ) : categories.length === 0 ? (
              <p className="text-gray-300 text-center py-4">No categories found</p>
            ) : (
              categories.map((category) => (
                <CategoryItem
                  key={category._id}
                  category={category}
                  isSelected={selectedCategory?._id === category._id}
                  onClick={() => handleCategoryClick(category)}
                  horizontal
                />
              ))
            )}
          </div>
          {categories.length > 4 && showScrollButtons.right && (
            <button
              onClick={() => scrollCategoryList("right")}
              className="text-white hover:text-pink-400 transition-colors"
              style={{ marginLeft: 8 }}
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="pt-32 mb-8 max-w-7xl mx-auto p-4 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            {selectedCategory && (
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

        {/* Add Category Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Card className="relative w-full max-w-md mx-4 p-8 mb-4">
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