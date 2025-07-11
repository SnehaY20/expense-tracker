import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Spinner from "./Spinner";
import Card from "./Card";
import { showSuccessToast, showErrorToast, showWarningToast } from "../utils/toast";
import { updatePassword } from "../api/auth";

const Password = ({ user }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

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
      await updatePassword({ userId: user.id, currentPassword, newPassword });
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

  return (
    <div className="flex items-center">
      <div>
        <div className="text-sm text-gray-300 font-semibold mb-2">Password</div>
        <div className="text-lg font-bold text-white">{"***********************"}</div>
      </div>
      <Button
        type="button"
        className="ml-4 px-4 py-2"
        onClick={() => setShowPasswordModal(true)}
      >
        Edit
      </Button>
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Card className="relative w-full max-w-md mx-4 p-8 mb-4 bg-gray-900/90 border border-gray-700">
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
                  placeholder="Type your current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password (min 6 characters)
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Type your new password"
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
                  placeholder="Retype your new password"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2 px-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating && <Spinner size="md" className="mr-2 text-white" />}
                  {updating ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  type="button"
                  onClick={cancelPasswordChange}
                  disabled={updating}
                  variant="gray"
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

export default Password; 