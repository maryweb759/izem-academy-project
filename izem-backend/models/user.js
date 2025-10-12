const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, minlength: 3, maxlength: 20 },
  phone: { type: String, required: true, unique: true, length: 10 },
  password: { type: String, required: true, minlength: 6 },
  city: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  isValidated: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
