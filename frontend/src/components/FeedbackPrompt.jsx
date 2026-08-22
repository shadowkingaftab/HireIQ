import { useState } from "react";

export default function FeedbackPrompt({ onFeedback }) {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <h3>How was this result?</h3>
      <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min={1} max={5} />
      <button onClick={() => onFeedback?.({ rating })}>Submit</button>
    </div>
  );
}
