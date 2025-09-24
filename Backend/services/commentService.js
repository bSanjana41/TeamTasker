import Comment from "../models/CommentSchema.js";
import ActivityLog from "../models/ActivityLogSchema.js";

export const addComment = async (taskId, userId, text) => {
  const comment = new Comment({ task: taskId, author: userId, text });
  await comment.save();

  await ActivityLog.create({
    user: userId,
    action: "comment_added",
    metadata: { taskId, commentId: comment._id }
  });

  return comment;
};

export const getCommentsByTask = async (taskId) => {
  return Comment.find({ task: taskId }).populate("author", "name email").sort({ createdAt: 1 });
};
