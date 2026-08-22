import { useState } from "react";

export default function CandidateNotes({ notes = [], onAdd }) {
  const [text, setText] = useState("");
  return (
    <div>
      <h3>Notes</h3>
      <ul>
        {notes.map((note) => <li key={note.id}>{note.content}</li>)}
      </ul>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a note..." />
      <button onClick={() => { onAdd?.({ content: text }); setText(""); }}>Add</button>
    </div>
  );
}
