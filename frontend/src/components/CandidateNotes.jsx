import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CandidateNotes({ candidateId, teamId }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!candidateId || !teamId || !currentUser) return;
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          `http://localhost:8000/teams/${teamId}/candidates/${candidateId}/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setNotes(response.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [candidateId, teamId, currentUser]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.post(
        `http://localhost:8000/teams/${teamId}/candidates/${candidateId}/notes`,
        { note: newNote },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNotes([...notes, response.data]);
      setNewNote('');
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note");
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Team Collaboration Notes
      </h3>
      
      <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <p className="text-gray-400 italic text-sm">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-400 italic text-sm">No team notes yet. Be the first to comment!</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 truncate max-w-[150px]">User {note.user_id.slice(0,8)}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {new Date(note.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{note.note}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddNote} className="relative">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Share your thoughts with the team..."
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium text-sm min-h-[100px] resize-none"
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="absolute bottom-3 right-3 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:shadow-none shadow-lg shadow-indigo-100"
        >
          Post Note
        </button>
      </form>
    </div>
  );
}
