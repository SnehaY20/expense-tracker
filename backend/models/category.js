const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // unique: true,
  },
  category: {
    type: [String],
    default: ["Others"], 
  },
});

module.exports = mongoose.model("Category", categorySchema);
