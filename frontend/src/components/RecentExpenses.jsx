import React, { useState } from "react";
import Card from "./Card";
import ExpenseModal from "./ExpenseModal";
import ExpenseTable from "./ExpenseTable";
import Spinner from "./Spinner";

const RecentExpenses = ({ expenses = [], loading = false, categories = [] }) => {
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <Card className="p-6 flex flex-col gap-2 h-full min-h-[420px] lg:col-span-2 w-full">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-100">
            Recent Expenses
          </h3>
          <button
            className="group px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-medium text-base transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2 text-white"
            onClick={() => setShowModal(true)}
          >
            <span className="text-lg font-bold">+</span>
            <span>Add Expense</span>
          </button>
        </div>
        <div className="flex-1 min-h-[220px] max-h-[400px] overflow-auto flex items-center justify-center">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 flex flex-col gap-2 h-full min-h-[420px] lg:col-span-2 w-full">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-100">
            Recent Expenses
          </h3>
          <button
            className="group px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-medium text-base transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2 text-white"
            onClick={() => setShowModal(true)}
          >
            <span className="text-lg font-bold">+</span>
            <span>Add Expense</span>
          </button>
        </div>
        <div className="flex-1 min-h-[220px] max-h-[400px] overflow-auto">
          <ExpenseTable
            expenses={expenses}
            categories={categories}
            showCategory={true}
            showTotal={false}
            showTotalBelow={false}
          />
        </div>
      </Card>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <ExpenseModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            categories={categories}
            isCategoriesLoading={false}
            isCategoriesError={false}
            categoriesError={null}
            onSuccess={() => setShowModal(false)}
          />
        </div>
      )}
    </>
  );
};

export default RecentExpenses;
