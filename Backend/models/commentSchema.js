import mongoose from "mongoose";
const { Schema, model, models, SchemaTypes } = mongoose;

const commentSchema= new Schema ({
  task: { type:SchemaTypes.ObjectId, ref: "Task", required: true },
  author: { type:SchemaTypes.ObjectId, ref: "User", required: true },
  text: { type: String, required: true }
}, { timestamps: true });

const Comment =model("Comment", commentSchema);
export default Comment
