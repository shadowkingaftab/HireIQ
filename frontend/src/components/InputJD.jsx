import { useState } from "react";
import { parseJD } from "../services/api";

export default function InputJD({ onParse, setLoading }) {
  const [text, setText] = useState("");

  const handleParse = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const data = await parseJD(text);
      onParse(data);
    } catch (error) {
      console.error("Error parsing JD:", error);
      alert("Failed to parse job description.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Job Description
      </label>
      <textarea
        rows="6"
        placeholder="Paste the job description here to analyze requirements..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition mb-4"
      ></textarea>
      <button
        onClick={handleParse}
        type="button"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        Extract Requirements
      </button>
    </div>
  );
}
