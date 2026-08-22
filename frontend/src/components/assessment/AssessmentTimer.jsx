export default function AssessmentTimer({ secondsLeft }) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return (
    <div aria-live="polite" style={{ fontWeight: 600 }}>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
