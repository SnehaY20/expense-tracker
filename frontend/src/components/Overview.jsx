import React from "react";
import { DollarSign, Tag, TrendingUp, Clock } from "lucide-react";
import SummaryCard from "./SummaryCard";
import TopCategories from "./TopCategories";
import ExpensePieChart from "./ExpensePieChart";
import MonthlyTrendChart from "./MonthlyTrendChart";
import RecentExpenses from "./RecentExpenses";
import BudgetStatus from "./BudgetStatus";

const Overview = () => {
  const mockData = {
    totalThisMonth: 2450.75,
    categoriesCount: 8,
    highestCategory: { name: "Food & Dining", amount: 850.5 },
    recentExpensesCount: 12,
    topCategories: [
      { name: "Food & Dining", amount: 850.5 },
      { name: "Transportation", amount: 420.25 },
      { name: "Shopping", amount: 380.0 },
      { name: "Entertainment", amount: 320.0 },
      { name: "Utilities", amount: 280.0 },
    ],
    pieChartData: [
      { name: "Food & Dining", value: 850.5 },
      { name: "Transportation", value: 420.25 },
      { name: "Shopping", value: 380.0 },
      { name: "Entertainment", value: 320.0 },
      { name: "Utilities", value: 280.0 },
      { name: "Healthcare", value: 200.0 },
    ],
    monthlyData: [
      { month: "Aug 23", amount: 2100.0 },
      { month: "Sep 23", amount: 1850.5 },
      { month: "Oct 23", amount: 2200.75 },
      { month: "Nov 23", amount: 1950.25 },
      { month: "Dec 23", amount: 2800.0 },
      { month: "Jan 24", amount: 2450.75 },
    ],
    recentExpenses: [],
  };

  return (
    <div className="space-y-4">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Expenses (This Month)"
          value={`₹${mockData.totalThisMonth.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-blue-400"
        />
        <SummaryCard
          title="Total Categories"
          value={mockData.categoriesCount}
          icon={Tag}
          iconColor="text-green-400"
        />
        <SummaryCard
          title="Highest Spent Category"
          value={mockData.highestCategory.name}
          subtitle={`₹${mockData.highestCategory.amount.toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-orange-400"
        />
        <SummaryCard
          title="Recent Expenses"
          value={mockData.recentExpensesCount}
          icon={Clock}
          iconColor="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpensePieChart data={mockData.pieChartData} />
        <MonthlyTrendChart data={mockData.monthlyData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <RecentExpenses />
        <div className="lg:col-span-1 w-full flex flex-col gap-4">
          <BudgetStatus spent={1950} limit={2000} />
          <TopCategories
            categories={mockData.topCategories}
            currencySymbol="₹"
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
