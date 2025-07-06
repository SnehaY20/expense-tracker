import React, { useState, useEffect } from "react";
import { DollarSign, Tag, TrendingUp, Clock } from "lucide-react";
import SummaryCard from "./SummaryCard";
import TopCategories from "./TopCategories";
import ExpensePieChart from "./ExpensePieChart";
import MonthlyTrendChart from "./MonthlyTrendChart";
import RecentExpenses from "./RecentExpenses";
import BudgetStatus from "./BudgetStatus";
import Spinner from "./Spinner";
import { fetchTopCategories } from "../api/category";
import { fetchBudget } from "../api/budget";
import { fetchTotalExpenses, fetchRecentExpenses, fetchDailyExpenses } from "../api/expense";

const Overview = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [budget, setBudget] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [highestCategory, setHighestCategory] = useState({ name: "None", amount: 0 });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [totalExpensesLoading, setTotalExpensesLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [recentExpensesLoading, setRecentExpensesLoading] = useState(true);
  const [dailyExpensesLoading, setDailyExpensesLoading] = useState(true);

  useEffect(() => {
    const loadTopCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchTopCategories();
        setTopCategories(data);
        
        // Get highest category from top categories
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
        setCategoriesLoading(false);
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

    const loadCategoriesCount = async () => {
      try {
        setCategoriesLoading(true);
        const { fetchCategories } = await import("../api/category");
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        setCategoriesCount(categoriesData.length);
      } catch (error) {
        console.error("Failed to load categories count:", error);
        setCategories([]);
        setCategoriesCount(0);
      } finally {
        setCategoriesLoading(false);
      }
    };

    const loadRecentExpenses = async () => {
      try {
        setRecentExpensesLoading(true);
        const data = await fetchRecentExpenses(5); // Get 5 recent expenses
        setRecentExpenses(data);
      } catch (error) {
        console.error("Failed to load recent expenses:", error);
        setRecentExpenses([]);
      } finally {
        setRecentExpensesLoading(false);
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
    loadCategoriesCount();
    loadRecentExpenses();
    loadDailyExpenses();
  }, []);

  // Convert top categories to pie chart format
  const pieChartData = topCategories.map(category => ({
    name: category.name,
    value: category.totalAmount || category.amount || 0
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Expenses (This Month)"
          value={totalExpensesLoading ? <Spinner /> : `₹${totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-blue-400"
        />
        <SummaryCard
          title="Total Categories"
          value={categoriesLoading ? <Spinner /> : categoriesCount}
          icon={Tag}
          iconColor="text-green-400"
        />
        <SummaryCard
          title="Highest Spent Category"
          value={loading ? <Spinner /> : highestCategory.name}
          subtitle={loading ? "" : `₹${highestCategory.amount.toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-orange-400"
        />
        <SummaryCard
          title="Recent Expenses"
          value={recentExpensesLoading ? <Spinner /> : recentExpenses.length}
          icon={Clock}
          iconColor="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ExpensePieChart data={loading ? [] : pieChartData} />
        </div>
        <div className="col-span-3">
          <MonthlyTrendChart 
            data={dailyExpenses} 
            budget={budget?.amount || 0}
            loading={dailyExpensesLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <RecentExpenses 
          expenses={recentExpenses}
          loading={recentExpensesLoading}
          categories={categories}
        />
        <div className="lg:col-span-1 w-full flex flex-col gap-4">
          <BudgetStatus 
            spent={totalExpenses} 
            limit={budget?.amount || 0} 
            loading={budgetLoading || totalExpensesLoading}
          />
          <TopCategories
            categories={topCategories}
            currencySymbol="₹"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
