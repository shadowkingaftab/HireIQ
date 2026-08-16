import { useState } from "react";

export default function FeedbackForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.({ rating, comment }); }}>
      <label>Rating</label>
      <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min={1} max={5} />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" />
      <button type="submit">Submit Feedback</button>
    </form>
  );
}
