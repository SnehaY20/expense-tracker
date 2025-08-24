import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createBudget } from "../api/budget";
import { useUpdateBudget } from "../hooks/useApi";
import Button from "./Button";
import Spinner from "./Spinner";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const Budget = ({ budget }) => {
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget?.amount?.toString() || "");
  const [budgetUpdating, setBudgetUpdating] = useState(false);
  
  const updateBudgetMutation = useUpdateBudget();

  const handleBudgetEdit = () => {
    setEditingBudget(true);
    setBudgetInput(budget?.amount?.toString() || "");
  };

  const handleCancel = () => {
    setEditingBudget(false);
    setBudgetInput(budget?.amount?.toString() || "");
  };

  const handleAddBudget = async () => {
    setBudgetUpdating(true);
    try {
      await createBudget({ amount: Number(budgetInput) });
      showSuccessToast("Budget added successfully!");
      setEditingBudget(false);

    } catch (err) {
      showErrorToast(err.message || "Failed to add budget");
    } finally {
      setBudgetUpdating(false);
    }
  };

  const handleUpdateBudget = async () => {
    if (!budget) return;
    setBudgetUpdating(true);
    try {
      await updateBudgetMutation.mutateAsync({ id: budget._id, amount: Number(budgetInput) });
      showSuccessToast("Budget updated successfully!");
      setEditingBudget(false);

    } catch (err) {
      showErrorToast(err.message || "Failed to update budget");
    } finally {
      setBudgetUpdating(false);
    }
  };

  return (
    <div>
      <div className="text-sm text-gray-300 font-semibold mb-2">Budget</div>
      {editingBudget ? (
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            step="0.01"
            className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none border border-white/20 w-40"
            placeholder="Enter budget"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            disabled={budgetUpdating}
          />
          {budget ? (
            <div
              className="px-4 py-2 flex items-center justify-center min-w-[90px] rounded-lg font-semibold transition bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 cursor-pointer"
              onClick={handleUpdateBudget}
              style={{ 
                opacity: (budgetUpdating || !budgetInput || Number(budgetInput) === budget?.amount) ? 0.5 : 1,
                cursor: (budgetUpdating || !budgetInput || Number(budgetInput) === budget?.amount) ? 'not-allowed' : 'pointer'
              }}
            >
              {budgetUpdating ? <Spinner size="sm" className="mr-2" /> : null}
              {budgetUpdating ? "Updating..." : "Update"}
            </div>
          ) : (
            <div
              className="px-4 py-2 flex items-center justify-center min-w-[90px] rounded-lg font-semibold transition bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 cursor-pointer"
              onClick={handleAddBudget}
              style={{ 
                opacity: (budgetUpdating || !budgetInput) ? 0.5 : 1,
                cursor: (budgetUpdating || !budgetInput) ? 'not-allowed' : 'pointer'
              }}
            >
              {budgetUpdating ? <Spinner size="sm" className="mr-2" /> : null}
              {budgetUpdating ? "Adding..." : "Add"}
            </div>
          )}
          <Button
            type="button"
            variant="gray"
            className="px-4 py-2"
            onClick={handleCancel}
            disabled={budgetUpdating}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-white">
            {budget?.amount ? `₹${budget.amount}` : "No budget set"}
          </div>
          <Button
            type="button"
            className="px-4 py-2"
            onClick={handleBudgetEdit}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Budget; 