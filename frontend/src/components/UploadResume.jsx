import { useState } from "react";

export default function UploadResume({ onUpload }) {
  const [file, setFile] = useState(null);
  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={() => onUpload?.(file)} disabled={!file}>Upload</button>
    </div>
  );
}
