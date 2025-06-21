const Category = require("../models/category");

const defaultCategory = async (userId) => {
  const existing = await Category.findOne({ user: userId });
  if (!existing) {
    await Category.create({
      user: userId,
      category: ["Others"],
    });
  }
};

module.exports = defaultCategory;
