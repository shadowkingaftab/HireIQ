import { useState } from "react";

export default function CandidateSearch() {
  const [query, setQuery] = useState("");
  return (
    <div className="container">
      <h1>Candidate Search</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search candidates..." />
    </div>
  );
}
