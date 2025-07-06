import React, { useEffect, useState } from "react";
import Card from "./Card";
import { CheckCircle, AlertTriangle, ThumbsUp } from "lucide-react";
import Spinner from "./Spinner";

const BudgetStatus = ({ spent = 500, limit = 2000, loading = false }) => {
  const percent = (spent / limit) * 100;
  const [animatedPercent, setAnimatedPercent] = useState(0);
  let barColor = "bg-green-400";
  let icon = (
    <CheckCircle className="w-5 h-5 text-green-400" title="On track" />
  );
  let statusText = (
    <span className="text-sm text-green-400 font-semibold">On track</span>
  );

  if (percent >= 100) {
    barColor = "bg-red-500";
    icon = (
      <AlertTriangle
        className="w-5 h-5 text-red-400 animate-pulse"
        title="Limit exceeded"
      />
    );
    statusText = (
      <span className="text-sm text-red-400 font-semibold">
        {spent === limit ? "Reached limit" : "Limit exceeded"}
      </span>
    );
  } else if (percent >= 90) {
    barColor = "bg-orange-400";
    icon = (
      <AlertTriangle
        className="w-5 h-5 text-orange-400 animate-pulse"
        title="Reaching limit"
      />
    );
    statusText = (
      <span className="text-sm text-orange-400 font-semibold">
        Reaching limit
      </span>
    );
  } else if (percent >= 50) {
    barColor = "gradient";
    icon = (
      <ThumbsUp className="w-5 h-5 text-purple-400" title="Within limit" />
    );
    statusText = (
      <span className="text-sm text-purple-300 font-semibold">
        Within limit
      </span>
    );
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedPercent(Math.min(percent, 100));
    }, 200);
    return () => clearTimeout(timeout);
  }, [percent]);

  if (loading) {
    return (
      <Card className="w-full h-full bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 flex flex-col justify-between border border-white/20">
        <div className="flex items-center justify-center h-32">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 flex flex-col justify-between border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-300 font-medium">Spent</span>
          <span
            className={`text-2xl font-extrabold ${
              percent >= 100
                ? "text-red-400"
                : percent >= 90
                ? "text-orange-400"
                : percent >= 50
                ? "text-purple-400"
                : "text-green-400"
            }`}
          >
            ₹{spent.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-300 font-medium">
            Current Limit
          </span>
          <span className="text-2xl font-extrabold text-gray-100">
            ₹{limit.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-2500 ease-out ${
            barColor === "gradient" ? "" : barColor
          }`}
          style={
            barColor === "gradient"
              ? {
                  width: `${animatedPercent}%`,
                  background:
                    "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)",
                }
              : { width: `${animatedPercent}%` }
          }
        ></div>
      </div>
      <div className="flex items-center justify-center mt-3">
        {icon}
        <span className="ml-2">{statusText}</span>
      </div>
    </Card>
  );
};

export default BudgetStatus;
