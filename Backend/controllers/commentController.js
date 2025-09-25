import * as commentService from "../services/commentService.js";

export const addComment = async (req, res) => {
  try {
    const comment = await commentService.addComment(
      req.params.taskId,
      req.user.id,
      req.body.text
    );
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCommentsByTask = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTask(req.params.taskId);
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
