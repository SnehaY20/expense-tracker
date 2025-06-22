import React from "react";
import { TrendingUp, PieChart, CreditCard, Bell } from "lucide-react";

const AppInterface = ({ isVisible }) => (
  <div
    className={`relative w-full max-w-4xl h-full mx-auto mt-20 lg:mt-0 transition-all duration-1000 delay-500 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
  >
    <div className="relative w-full h-full">
      {/* Subtle decorative elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 border border-purple-400/30 transform rotate-45"></div>
      <div className="absolute -bottom-4 -right-4 w-6 h-6 border border-pink-400/30 transform rotate-45"></div>
      {/* Main Interface */}
      <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl flex flex-col justify-between hover:scale-105 transition-all duration-500">
        <div className="space-y-6 flex-1 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Monthly Overview
              </h3>
              <p className="text-gray-400 text-sm">June 2025</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          {/* Balance Card */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="text-sm text-white/80 mb-1">Total Balance</div>
              <div className="text-3xl font-bold text-white mb-2">
                $12,847.60
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-sm text-green-300">
                  +12.5% from last month
                </span>
              </div>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-gray-400 text-sm">Expenses</span>
              </div>
              <div className="text-xl font-semibold text-red-400">$3,247</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-400 text-sm">Income</span>
              </div>
              <div className="text-xl font-semibold text-green-400">$8,450</div>
            </div>
          </div>
          {/* Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Spending Categories</span>
              <PieChart className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between group hover:bg-white/5 -mx-2 px-2 py-1 rounded-lg transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Food & Dining
                  </span>
                </div>
                <span className="text-sm font-medium text-white">$892</span>
              </div>
              <div className="flex items-center justify-between group hover:bg-white/5 -mx-2 px-2 py-1 rounded-lg transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Transportation
                  </span>
                </div>
                <span className="text-sm font-medium text-white">$456</span>
              </div>
              <div className="flex items-center justify-between group hover:bg-white/5 -mx-2 px-2 py-1 rounded-lg transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Entertainment
                  </span>
                </div>
                <span className="text-sm font-medium text-white">$234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AppInterface;
