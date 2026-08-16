import { useState } from "react";

export default function AdaptiveAssessment({ onComplete }) {
  const [ difficulty, setDifficulty ] = useState("medium");
  return (
    <div>
      <h3>Adaptive Assessment</h3>
      <p>Difficulty: {difficulty}</p>
      <button onClick={() => setDifficulty("hard")}>Increase</button>
      <button onClick={() => setDifficulty("easy")}>Decrease</button>
    </div>
  );
}
