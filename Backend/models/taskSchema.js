import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const taskSchema= new Schema({
  project:{type:Schema.Types.ObjectId,ref:"Project",required:true},
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ["Todo", "In Progress", "Done"], default: "Todo" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  assignee: { type: Schema.Types.ObjectId, ref: "User" },
  dueDate: Date,
  completedAt: Date
}, { timestamps: true });

const Task =  model("Task", taskSchema);
export default Task




