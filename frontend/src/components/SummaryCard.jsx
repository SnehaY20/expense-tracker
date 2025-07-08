import React from "react";
import Card from "./Card";

const SummaryCard = ({ title, value, subtitle, icon: Icon, iconColor }) => (
  <Card className="p-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] font-medium text-gray-300">{title}</p>
        <div className="text-lg font-bold text-gray-100">
          {typeof value === 'string' ? value : value}
        </div>
        {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
      </div>
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </div>
  </Card>
);

export default SummaryCard;
