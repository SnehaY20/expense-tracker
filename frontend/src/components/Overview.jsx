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
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        <SummaryCard
          title="Total Expenses (This Month)"
          value={totalExpensesLoading ? <Spinner /> : `₹${totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-blue-400"
          className="h-24"
        />
        <SummaryCard
          title="Highest Spent Category"
          value={loading ? <Spinner /> : highestCategory.name}
          subtitle={loading ? "" : `₹${highestCategory.amount.toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-orange-400"
          className="h-24"
        />
        <div className="col-span-2">
          <BudgetStatus 
            spent={totalExpenses} 
            limit={budget?.amount || 0} 
            loading={budgetLoading || totalExpensesLoading}
            className="h-24"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-2 space-y-3">
          <div className="h-[200px]">
            <ExpensePieChart data={loading ? [] : pieChartData} />
          </div>
          <div className="h-[159px]">
            <TopCategories
              categories={topCategories}
              currencySymbol="₹"
              loading={loading}
              className="h-full"
            />
          </div>
        </div>
        <div className="col-span-2">
          <div className="h-[370px]">
            <MonthlyTrendChart 
              data={dailyExpenses} 
              budget={budget?.amount || 0}
              loading={dailyExpensesLoading}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;