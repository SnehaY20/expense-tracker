import React, { useState, useEffect } from "react";
import { fetchProfile, updatePassword } from "../api/auth";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toast";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import { ProfileCardSkeleton } from "../components/Skeleton";
import { fetchBudget, createBudget, updateBudget } from "../api/budget";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updating, setUpdating] = useState(false);

  const [budget, setBudget] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [budgetUpdating, setBudgetUpdating] = useState(false);

  useEffect(() => {
    loadProfile();
    loadBudget();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await fetchProfile();
      setUser(profileData.data);
    } catch (err) {
      showErrorToast("Failed to load profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBudget = async () => {
    setBudgetLoading(true);
    setBudgetError("");
    try {
      const data = await fetchBudget();
      setBudget(data);
      setBudgetInput(data?.amount || "");
    } catch (err) {
      setBudget(null);
      setBudgetInput("");
      if (err.message && !err.message.includes("not found")) {
        setBudgetError(err.message);
      }
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showErrorToast("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      showWarningToast("New password must be at least 6 characters long");
      return;
    }

    if (currentPassword === newPassword) {
      showWarningToast("Old password and new password cannot be the same.");
      return;
    }

    try {
      setUpdating(true);

      await updatePassword({
        userId: user.id,
        currentPassword,
        newPassword,
      });

      showSuccessToast("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      showErrorToast(err.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleAddBudget = async () => {
    setBudgetUpdating(true);
    setBudgetError("");
    try {
      const res = await createBudget({ amount: Number(budgetInput) });
      setBudget(res.data);
    } catch (err) {
      setBudgetError(err.message);
    } finally {
      setBudgetUpdating(false);
    }
  };

  const handleUpdateBudget = async () => {
    if (!budget) return;
    setBudgetUpdating(true);
    setBudgetError("");
    try {
      const res = await updateBudget({
        id: budget._id,
        amount: Number(budgetInput),
      });
      setBudget(res.data);
    } catch (err) {
      setBudgetError(err.message);
    } finally {
      setBudgetUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 px-4">
        <div className="text-center mb-6 mt-20">
          <div className="h-8 bg-gray-500 rounded w-1/3 mx-auto animate-pulse mb-2"></div>
          <div className="h-6 bg-gray-500 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <ProfileCardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
        </div>
        <div className="flex gap-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {/* Name Field */}
            <div>
              <div className="text-sm text-gray-300 font-semibold mb-2">
                Your Name
              </div>
              <div className="text-lg font-bold text-white">
                {user?.name || ""}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="text-sm text-gray-300 font-semibold mb-2">
                Email
              </div>
              <div className="text-lg font-bold text-white">
                {user?.email || ""}
              </div>
            </div>

            {/* Password Field */}
            <div className="flex items-center">
              <div>
                <div className="text-sm text-gray-300 font-semibold mb-2">
                  Password
                </div>
                <div className="text-lg font-bold text-white">
                  {"***********************"}
                </div>
              </div>
              <Button
                className="ml-4 px-4 py-2"
                onClick={() => setShowPasswordModal(true)}
              >
                Edit
              </Button>
            </div>

            {/* Budget Field */}
            <div className="mt-8">
              <div className="text-sm text-gray-300 font-semibold mb-2">
                Budget
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none border border-white/20 w-40"
                  placeholder="Enter budget"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  disabled={budgetLoading || budgetUpdating}
                />
                {budget ? (
                  <Button
                    className="px-4 py-2"
                    onClick={handleUpdateBudget}
                    disabled={budgetUpdating || budgetLoading}
                  >
                    {budgetUpdating ? "Updating..." : "Update Budget"}
                  </Button>
                ) : (
                  <Button
                    className="px-4 py-2"
                    onClick={handleAddBudget}
                    disabled={budgetUpdating || budgetLoading || !budgetInput}
                  >
                    {budgetUpdating ? "Adding..." : "Add Budget"}
                  </Button>
                )}
              </div>
              {budgetLoading && (
                <div className="text-xs text-gray-400 mt-2">
                  <Spinner size="sm" />
                </div>
              )}
              {budgetError && (
                <div className="text-xs text-red-400 mt-2">{budgetError}</div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Password Modal*/}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="relative w-full max-w-md mx-4 p-8 mb-4">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
              onClick={() => setShowPasswordModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-purple-200 mb-6 text-center">
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    cancelPasswordChange();
                  }}
                  disabled={updating}
                  className="flex-1 py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
              </div>
              {error && (
                <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
