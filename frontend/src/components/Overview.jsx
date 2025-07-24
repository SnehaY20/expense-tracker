import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import SummaryCard from "./SummaryCard";
import TopCategories from "./TopCategories";
import ExpensePieChart from "./ExpensePieChart";
import MonthlyTrendChart from "./MonthlyTrendChart";
import BudgetStatus from "./BudgetStatus";
import Spinner from "./Spinner";
import { fetchTopCategories } from "../api/category";
import { fetchBudget } from "../api/budget";
import { fetchTotalExpenses, fetchDailyExpenses } from "../api/expense";

const Overview = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [budget, setBudget] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [highestCategory, setHighestCategory] = useState({ name: "None", amount: 0 });
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [totalExpensesLoading, setTotalExpensesLoading] = useState(true);
  const [dailyExpensesLoading, setDailyExpensesLoading] = useState(true);

  useEffect(() => {
    const loadTopCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchTopCategories();
        setTopCategories(data);
        if (data && data.length > 0) {
          setHighestCategory({
            name: data[0].name,
            amount: data[0].totalAmount || data[0].amount
          });
        }
      } catch (error) {
        console.error("Failed to load top categories:", error);
        setTopCategories([]);
      } finally {
        setLoading(false);
      }
    };

    const loadBudget = async () => {
      try {
        setBudgetLoading(true);
        const data = await fetchBudget();
        setBudget(data);
      } catch (error) {
        console.error("Failed to load budget:", error);
        setBudget(null);
      } finally {
        setBudgetLoading(false);
      }
    };

    const loadTotalExpenses = async () => {
      try {
        setTotalExpensesLoading(true);
        const data = await fetchTotalExpenses();
        setTotalExpenses(data);
      } catch (error) {
        console.error("Failed to load total expenses:", error);
        setTotalExpenses(0);
      } finally {
        setTotalExpensesLoading(false);
      }
    };

    const loadDailyExpenses = async () => {
      try {
        setDailyExpensesLoading(true);
        const data = await fetchDailyExpenses();
        setDailyExpenses(data);
      } catch (error) {
        console.error("Failed to load daily expenses:", error);
        setDailyExpenses([]);
      } finally {
        setDailyExpensesLoading(false);
      }
    };

    loadTopCategories();
    loadBudget();
    loadTotalExpenses();
    loadDailyExpenses();
  }, []);

  const pieChartData = topCategories.map(category => ({
    name: category.name,
    value: category.totalAmount || category.amount || 0
  }));

  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="space-y-4 p-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          <SummaryCard
            title={`Total Expenses (${new Date().toLocaleString('default', { month: 'long' })})`}
            value={totalExpensesLoading ? <Spinner /> : `₹${totalExpenses.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-blue-400"
            className="h-24"
          />
          <SummaryCard
            title="Highest Spent Category"
            value={loading ? <Spinner /> : highestCategory.name}
            subtitle={loading ? "" : (
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
              loading={budgetLoading || totalExpensesLoading}
              className="h-24"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <ExpensePieChart data={loading ? [] : pieChartData} className="w-full h-64" />
          </div>
          
          <div className="lg:col-span-2 h-67">
            <MonthlyTrendChart 
              data={dailyExpenses} 
              budget={budget?.amount || 0}
              loading={dailyExpensesLoading}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="mt-2">
          <div className="h-64">
            <TopCategories
              categories={topCategories}
              currencySymbol="₹"
              loading={loading}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;