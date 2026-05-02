import { useState } from "react";
import { getGithubData } from "../services/api";

export default function InputGitHub({ onFetch, setLoading }) {
  const [username, setUsername] = useState("");

  const handleFetch = async () => {
    if (!username.strip) return;
    const cleanUsername = username.trim();
    if (!cleanUsername) return;
    
    setLoading(true);
    try {
      const data = await getGithubData(cleanUsername);
      onFetch(data);
    } catch (error) {
      console.error("Error fetching GitHub:", error);
      alert("Failed to fetch GitHub data. Please check the username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        GitHub Username
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. octocat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <button
          onClick={handleFetch}
          type="button"
          className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition"
        >
          Fetch
        </button>
      </div>
    </div>
  );
}
