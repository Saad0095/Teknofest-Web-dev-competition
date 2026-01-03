import mongoose, { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [3, "Subject must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      enum: ["Technical", "Billing", "General"],
      required: [true, "Category is required"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Priority is required"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "inProgress", "Resolved"],
      default: "Open",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ticketSchema.methods.isOverdue = function () {
  const now = new Date();
  const createdTime = new Date(this.createdAt);
  const hoursDiff = (now - createdTime) / (1000 * 60 * 60);
  return this.status === "Open" && hoursDiff > 24;
};

export default model("Ticket", ticketSchema);
