export default function QuestionRenderer({ question, answer, onAnswer }) {
  return (
    <div>
      <p>{question.prompt}</p>
      {question.type === "multiple_choice" && question.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {question.options.map((option, index) => (
            <label key={index} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name={`question-${question.id}`} checked={answer === index} onChange={() => onAnswer?.(index)} />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
