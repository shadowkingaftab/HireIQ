export default function Assessment({ assessment, onStart }) {
  return (
    <div>
      <h2>{assessment?.title || "Assessment"}</h2>
      <p>{assessment?.description}</p>
      <button onClick={onStart}>Start</button>
    </div>
  );
}
