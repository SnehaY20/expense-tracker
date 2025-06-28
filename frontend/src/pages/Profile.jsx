import React, { useState, useEffect } from "react";
import { fetchProfile, updatePassword } from "../api/auth";
import BackgroundLayout from "../components/BackgroundLayout";
import { useAuth } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updating, setUpdating] = useState(false);

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <BackgroundLayout>
        <div className="min-h-screen flex flex-col items-center justify-center py-8 relative">
          <div className="absolute top-8 right-8 z-10">
            {isLoggedIn ? (
              <Button onClick={handleLogout} className="px-6 py-2">
                Logout
              </Button>
            ) : (
              <Button onClick={handleLogin} className="px-6 py-2">
                Login
              </Button>
            )}
          </div>
          <div className="w-full max-w-lg mx-auto space-y-6 px-4">
            <div className="text-center mb-6 mt-20">
              <div className="h-8 bg-gray-500 rounded w-1/3 mx-auto animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-500 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
            <ProfileCardSkeleton />
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <div className="min-h-screen flex flex-col items-center justify-center py-8 relative">
        <div className="absolute top-8 right-8 z-10">
          {isLoggedIn ? (
            <Button onClick={handleLogout} className="px-6 py-2">
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} className="px-6 py-2">
              Login
            </Button>
          )}
        </div>
        <div className="w-full max-w-lg mx-auto space-y-6 px-4">
          <Card>
            <div className="text-sm text-gray-300 font-semibold mb-1">
              Your Name
            </div>
            <div className="text-lg font-bold text-white bg-transparent outline-none border-none p-0 m-0">
              {user?.name || ""}
            </div>
          </Card>

          <Card>
            <div className="text-sm text-gray-300 font-semibold mb-1">
              Email
            </div>
            <div className="text-lg font-bold text-white bg-transparent outline-none border-none p-0 m-0">
              {user?.email || ""}
            </div>
          </Card>

          <Card className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-300 font-semibold mb-1">
                Password
              </div>
              <div className="text-lg font-bold text-white bg-transparent outline-none border-none p-0 m-0">
                {"********"}
              </div>
            </div>
            <Button
              className="ml-4 px-4 py-2"
              onClick={() => setShowPasswordModal(true)}
            >
              Edit
            </Button>
          </Card>

          {/* Password */}
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
                          <Spinner size="sm" className="mr-2" />
                          Updating...
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
      </div>
    </BackgroundLayout>
  );
};

export default Profile;
