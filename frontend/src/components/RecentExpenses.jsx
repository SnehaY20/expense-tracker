import React, { useState } from "react";
import Card from "./Card";
import ExpenseModal from "./ExpenseModal";
import ExpenseTable from "./ExpenseTable";

const mockCategories = [
  { _id: "1", name: "Food & Dining" },
  { _id: "2", name: "Transportation" },
  { _id: "3", name: "Shopping" },
  { _id: "4", name: "Entertainment" },
  { _id: "5", name: "Utilities" },
  { _id: "6", name: "Healthcare" },
  { _id: "7", name: "Education" },
  { _id: "8", name: "Other" },
];

const mockExpenses = [
  {
    _id: "1",
    title: "Grocery Shopping",
    amount: 85.5,
    note: "",
    category: "1",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    title: "Gas Station",
    amount: 45,
    note: "",
    category: "2",
    createdAt: "2024-01-14T16:20:00Z",
  },
  {
    _id: "3",
    title: "Movie Tickets",
    amount: 32,
    note: "",
    category: "4",
    createdAt: "2024-01-13T19:15:00Z",
  },
  {
    _id: "4",
    title: "Restaurant Dinner",
    amount: 65.75,
    note: "",
    category: "1",
    createdAt: "2024-01-12T20:45:00Z",
  },
  {
    _id: "5",
    title: "Online Shopping",
    amount: 120,
    note: "",
    category: "3",
    createdAt: "2024-01-11T14:30:00Z",
  },
  {
    _id: "6",
    title: "Electricity Bill",
    amount: 95.5,
    note: "",
    category: "5",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    _id: "7",
    title: "Coffee Shop",
    amount: 12.5,
    note: "",
    category: "1",
    createdAt: "2024-01-09T08:15:00Z",
  },
  {
    _id: "8",
    title: "Bus Fare",
    amount: 8,
    note: "",
    category: "2",
    createdAt: "2024-01-08T07:30:00Z",
  },
  {
    _id: "9",
    title: "Pharmacy",
    amount: 28.75,
    note: "",
    category: "6",
    createdAt: "2024-01-07T15:45:00Z",
  },
  {
    _id: "10",
    title: "Books",
    amount: 45,
    note: "",
    category: "7",
    createdAt: "2024-01-06T11:20:00Z",
  },
];

const RecentExpenses = () => {
  const [showModal, setShowModal] = useState(false);

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
            expenses={mockExpenses.slice(0, 5)}
            categories={mockCategories}
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
            categories={mockCategories}
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
