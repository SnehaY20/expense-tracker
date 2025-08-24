import React, { memo } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import SummaryCard from "./SummaryCard";
import TopCategories from "./TopCategories";
import ExpensePieChart from "./ExpensePieChart";
import MonthlyTrendChart from "./MonthlyTrendChart";
import BudgetStatus from "./BudgetStatus";
import Spinner from "./Spinner";
import { useOverviewData } from "../hooks/useOverviewData";

const Overview = memo(() => {
  const {
    topCategories,
    budget,
    totalExpenses,
    dailyExpenses,
    highestCategory,
    pieChartData,
    isTopCategoriesLoading,
    isBudgetLoading,
    isTotalExpensesLoading,
    isDailyExpensesLoading,
  } = useOverviewData();

  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="space-y-4 p-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          <SummaryCard
            title={`Total Expenses (${new Date().toLocaleString('default', { month: 'long' })})`}
            value={isTotalExpensesLoading ? <Spinner /> : `₹${totalExpenses.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-blue-400"
            className="h-24"
          />
          <SummaryCard
            title="Highest Spent Category"
            value={isTopCategoriesLoading ? <Spinner /> : highestCategory.name}
            subtitle={isTopCategoriesLoading ? "" : (
              <span className="text-lg font-semibold">₹{highestCategory.amount.toLocaleString()}</span>
            )}
            icon={TrendingUp}
            iconColor="text-orange-400"
            className="h-24"
          />
          <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2">
            <BudgetStatus 
              spent={totalExpenses} 
              limit={budget?.amount || 0} 
              loading={isBudgetLoading || isTotalExpensesLoading}
              className="h-24"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <ExpensePieChart data={isTopCategoriesLoading ? [] : pieChartData} className="w-full h-64" />
          </div>
          
          <div className="lg:col-span-2 h-67">
            <MonthlyTrendChart 
              data={dailyExpenses} 
              budget={budget?.amount || 0}
              loading={isDailyExpensesLoading}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="mt-2">
          <div className="h-64">
            <TopCategories
              categories={topCategories}
              currencySymbol="₹"
              loading={isTopCategoriesLoading}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

Overview.displayName = 'Overview';

export default Overview;