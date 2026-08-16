import { useState } from "react";

export default function OnboardingTour({ steps = [] }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  return (
    <div>
      <h2>Welcome</h2>
      <p>{current?.title}</p>
      <button onClick={() => setStep((s) => s + 1)}>Next</button>
    </div>
  );
}
