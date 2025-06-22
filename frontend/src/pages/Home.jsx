import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import AnimatedBackground from "./components/AnimatedBackground";
import AppInterface from "./components/AppInterface";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <AnimatedBackground />
     


      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-light leading-tight tracking-tight">
                Track Your{" "}
                <span className="font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  Expenses
                </span>
                <br />
                <span className="text-4xl lg:text-5xl text-gray-400">
                  Like Never Before
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Take control of your finances with our intelligent expense
                tracking app. Visualize spending patterns, set budgets, and
                achieve your financial goals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <button
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl font-medium text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                onClick={() => (window.location.href = "/register")}
              >
                <span>Start Tracking Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <AppInterface isVisible={isVisible} />
        </div>
      </section>
    </div>
  );
}
