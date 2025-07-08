import React, { useEffect, useState } from "react";
import Card from "./Card";
import { CheckCircle, AlertTriangle, ThumbsUp } from "lucide-react";
import Spinner from "./Spinner";

const BudgetStatus = ({ spent = 0, limit = 0, loading = false, className = "" }) => {
  const percent = limit > 0 ? (spent / limit) * 100 : 0;
  const [animatedPercent, setAnimatedPercent] = useState(0);
  let barColor = "bg-green-400";
  let icon = (
    <CheckCircle className="w-5 h-5 text-green-400" title="On track" />
  );
  let statusText = (
    <span className="text-sm text-green-400 font-semibold">On track</span>
  );

  if (limit === 0) {
    barColor = "bg-gray-400";
    icon = (
      <CheckCircle className="w-5 h-5 text-gray-400" title="No budget set" />
    );
    statusText = (
      <span className="text-sm text-gray-400 font-semibold">No budget set</span>
    );
  } else if (percent >= 100) {
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
      <Card className={`w-full h-full bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-1 flex flex-col justify-between border border-white/20 ${className}`}>
        <div className="flex items-center justify-center h-12">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`w-full h-full bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-1 flex flex-col justify-between border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-1 px-2">
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-gray-300 font-medium">Spent</span>
          <span
            className={`text-xs font-extrabold ${
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
          <span className="text-[10px] text-gray-300 font-medium">
            Current Limit
          </span>
          <span className="text-xs font-extrabold text-gray-100">
            ₹{limit.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="px-6 w-full">
        <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
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
      </div>
      <div className="flex items-center justify-center mt-1">
        {icon && React.isValidElement(icon)
          ? React.cloneElement(icon, {
              className: `${icon.props.className || ''} w-3 h-3 ${icon.props.className && icon.props.className.includes('animate-pulse') ? 'animate-pulse' : ''}`.trim(),
              style: { color: icon.props.color || undefined, ...icon.props.style }
            })
          : icon}
        <span className={`ml-1 text-[8px] ${icon && icon.props && icon.props.className && icon.props.className.includes('text-red-400') ? 'text-red-400' : icon && icon.props && icon.props.className && icon.props.className.includes('text-orange-400') ? 'text-orange-400' : icon && icon.props && icon.props.className && icon.props.className.includes('text-purple-400') ? 'text-purple-400' : icon && icon.props && icon.props.className && icon.props.className.includes('text-green-400') ? 'text-green-400' : 'text-gray-400'} ${icon && icon.props && icon.props.className && icon.props.className.includes('animate-pulse') ? 'animate-pulse' : ''}`}>{statusText}</span>
      </div>
    </Card>
  );
};

export default BudgetStatus;
