import React, { useState, useEffect } from "react";
import { fetchProfile } from "../api/auth";
import { fetchBudget } from "../api/budget";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import { useAuth } from "../store/AuthStore";
import Name from "../components/Name";
import Password from "../components/Password";
import Budget from "../components/Budget";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { data: budget } = useQuery({ queryKey: ['budget'], queryFn: fetchBudget });
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, logout, authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && isLoggedIn) {
      loadProfile();
    }
  }, [isLoggedIn, authChecked]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileData, budgetData] = await Promise.all([
        fetchProfile(),
        fetchBudget().catch(() => null) 
      ]);
      setUser(profileData.data);
    } catch (error) {
      if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) return null;
  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="text-center">
          <div className="h-8 bg-gray-500 rounded w-1/3 mx-auto animate-pulse mb-2"></div>
          <div className="h-6 bg-gray-500 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full px-2 sm:px-6">
      <div className="max-w-7xl w-full mx-auto">
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
              <Name user={user} reloadProfile={loadProfile} />
              <div>
                <div className="text-sm text-gray-300 font-semibold mb-2">Email</div>
                <div className="text-lg font-bold text-white">{user?.email || ""}</div>
              </div>
              <Password user={user} />
              <Budget budget={budget} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;