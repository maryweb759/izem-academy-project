
// 1. Create CourseEnrollment Model
const mongoose = require("mongoose");
const courseEnrollmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true // ✅ Add index for performance
  },
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  }],
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "cancelled"], // ✅ Add cancelled
    default: "pending",
    index: true // ✅ Add index for filtering
  },
  requestedAt: { 
    type: Date, 
    default: Date.now,
    index: true // ✅ Add index for sorting
  },
  processedAt: { type: Date },
  processedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },
  rejectionReason: { type: String },
  cancellationReason: { type: String }, // ✅ NEW
  cancelledAt: { type: Date }, // ✅ NEW
  totalAmount: { 
    type: Number, 
    required: true 
  },
 
});

// ✅ Compound index for common queries
courseEnrollmentSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("CourseEnrollment", courseEnrollmentSchema);
