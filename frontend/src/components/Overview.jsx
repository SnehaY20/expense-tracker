import React from "react";
import { DollarSign, Tag, TrendingUp, Clock } from "lucide-react";
import SummaryCard from "./SummaryCard";
import TopCategories from "./TopCategories";
import ExpensePieChart from "./ExpensePieChart";
import MonthlyTrendChart from "./MonthlyTrendChart";
import RecentExpenses from "./RecentExpenses";
import BudgetStatus from "./BudgetStatus";
import Spinner from "./Spinner";
import { useOverviewData } from "../hooks/useOverviewData";

const Overview = () => {
  const { data, categories, loading, error, refetch } = useOverviewData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    summaryStats,
    topCategories,
    pieChartData,
    monthlyData,
    recentExpenses,
    budgetStatus,
  } = data;

  return (
    <div className="space-y-4">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Expenses (This Month)"
          value={`₹${summaryStats.totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-blue-400"
        />
        <SummaryCard
          title="Total Categories"
          value={data.pieChartData.length}
          icon={Tag}
          iconColor="text-green-400"
        />
        <SummaryCard
          title="Highest Spent Category"
          value={topCategories[0]?.name || "No expenses"}
          subtitle={
            topCategories[0]
              ? `₹${topCategories[0].amount.toLocaleString()}`
              : ""
          }
          icon={TrendingUp}
          iconColor="text-orange-400"
        />
        <SummaryCard
          title="Recent Expenses"
          value={recentExpenses.length}
          icon={Clock}
          iconColor="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpensePieChart data={pieChartData} />
        <MonthlyTrendChart data={monthlyData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <RecentExpenses
          expenses={recentExpenses}
          categories={categories}
          onRefresh={refetch}
        />
        <div className="lg:col-span-1 w-full flex flex-col gap-4">
          <BudgetStatus
            spent={budgetStatus.spent}
            limit={budgetStatus.budget}
          />
          <TopCategories categories={topCategories} currencySymbol="₹" />
        </div>
      </div>
    </div>
  );
};

export default Overview;
