import { useState, useEffect } from "react";
import API from "../../api/API"; 

export default function CommentsList({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/${taskId}`, { withCredentials: true });
        setComments(res.data);
      } catch (err) {
        console.error("Could not fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [taskId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await API.post(
        `/comments/${taskId}`,
        { text: newComment },
        { withCredentials: true }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Could not add comment:", err);
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <section>
      <h2>Comments</h2>

      {/* Input for new comment */}
      <div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add</button>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c._id}>
              <strong>{c.author?.name || "Unknown"}:</strong> {c.text} <em>({new Date(c.createdAt).toLocaleString()})</em>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
