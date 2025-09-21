const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // ex: "BAC2025"
  title: { type: String, required: true },
  subtitle: { type: String, required: true }, // ✅ new required field
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Course", courseSchema);
