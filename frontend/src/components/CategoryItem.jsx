import React from "react";

const CategoryItem = ({ category, isSelected, onClick, horizontal }) => {
  return (
    <li
      className={horizontal ? "inline-block min-w-[150px] max-w-[150px] scroll-snap-align-start" : "w-full"}
    >
      <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
          isSelected
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
            : "bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white hover:scale-102"
        }`}
      >
        <span className="font-medium text-sm">{category.name}</span>
      </button>
    </li>
  );
};

export default CategoryItem;