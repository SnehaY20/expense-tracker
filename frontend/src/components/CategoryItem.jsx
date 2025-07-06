import React from "react";

const CategoryItem = ({ category, isSelected, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
          isSelected
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
            : "bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span className="font-medium">{category.name}</span>
      </button>
    </li>
  );
};

export default CategoryItem; 