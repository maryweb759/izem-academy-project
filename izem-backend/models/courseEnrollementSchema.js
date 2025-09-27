
// 1. Create CourseEnrollment Model
const mongoose = require("mongoose");

const courseEnrollmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  }],
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  requestedAt: { 
    type: Date, 
    default: Date.now 
  },
  processedAt: { 
    type: Date 
  },
  processedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" // admin who processed the request
  },
  rejectionReason: { 
    type: String 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  }
});

module.exports = mongoose.model("CourseEnrollment", courseEnrollmentSchema);
