import React from "react";
import Card from "./Card";

const SummaryCard = ({ title, value, subtitle, icon: Icon, iconColor }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <div className="text-2xl font-bold text-gray-100">
          {typeof value === 'string' ? value : value}
        </div>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      <Icon className={`h-8 w-8 ${iconColor}`} />
    </div>
  </Card>
);

export default SummaryCard;
