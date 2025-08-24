import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

export const useApiGet = (queryKey, queryFn, options = {}) => {
  const { isLoggedIn, authChecked, logout } = useAuth();
  const navigate = useNavigate();
  
  return useQuery({
    queryKey,
    queryFn,
    enabled: isLoggedIn && authChecked && (options.enabled !== false),
    staleTime: options.staleTime || 5 * 60 * 1000, 
    retry: options.retry !== undefined ? options.retry : 1,
    onError: (error) => {
      if (error.status === 401) {
        logout(navigate);
      }
    
      if (options.onError) {
        options.onError(error);
      }
    },
    ...options,
  });
};

export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn,
    retry: options.retry !== undefined ? options.retry : 1, 
    retryDelay: options.retryDelay || 1000,
    onSuccess: (data, variables, context) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (error.status === 401) {
        logout(navigate);
        return;
      }
      
      console.error('API Mutation Error:', {
        error: error.message,
        status: error.status,
        endpoint: error.endpoint,
        timestamp: error.timestamp,
        details: error.details,
      });
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useBudget = () => {
  const { fetchBudget } = require("../api/budget");
  return useApiGet(['budget'], fetchBudget);
};



export const useTopCategories = () => {
  const { fetchTopCategories } = require("../api/category");
  return useApiGet(['top-categories'], fetchTopCategories);
};

export const useTotalExpenses = () => {
  const { fetchTotalExpenses } = require("../api/expense");
  return useApiGet(['total-expenses'], fetchTotalExpenses);
};

export const useDailyExpenses = () => {
  const { fetchDailyExpenses } = require("../api/expense");
  return useApiGet(['daily-expenses'], fetchDailyExpenses);
};

export const useProfile = () => {
  const { fetchProfile } = require("../api/auth");
  return useApiGet(['profile'], fetchProfile);
};

export const useCategories = () => {
  const { fetchCategories } = require("../api/category");
  return useApiGet(['categories'], fetchCategories);
};

export const useExpenses = () => {
  const { fetchExpenses } = require("../api/expense");
  return useApiGet(['expenses'], fetchExpenses);
};

export const useCreateExpense = () => {
  const { createExpense } = require("../api/expense");
  return useApiMutation(createExpense, {
    invalidateQueries: [['expenses'], ['total-expenses'], ['daily-expenses'], ['top-categories']],
  });
};

export const useUpdateExpense = () => {
  const { updateExpense } = require("../api/expense");
  return useApiMutation(updateExpense, {
    invalidateQueries: [['expenses'], ['total-expenses'], ['daily-expenses'], ['top-categories']],
  });
};

export const useDeleteExpense = () => {
  const { deleteExpense } = require("../api/expense");
  return useApiMutation(deleteExpense, {
    invalidateQueries: [['expenses'], ['total-expenses'], ['daily-expenses'], ['top-categories']],
  });
};

export const useCreateBudget = () => {
  const { createBudget } = require("../api/budget");
  return useApiMutation(createBudget, {
    invalidateQueries: [['budget']],
  });
};

export const useUpdateBudget = () => {
  const { updateBudget } = require("../api/budget");
  return useApiMutation(updateBudget, {
    invalidateQueries: [['budget']], 
  });
};

export const useUpdateProfile = () => {
  const { updateProfile } = require("../api/auth");
  return useApiMutation(updateProfile, {
    invalidateQueries: [['profile']],
  });
};
