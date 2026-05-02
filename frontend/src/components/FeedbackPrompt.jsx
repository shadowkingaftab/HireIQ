import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function FeedbackPrompt() {
  const [showPrompt, setShowPrompt] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/feedback/survey",
        {
          rating,
          feedback,
          user_id: currentUser?.uid
        }
      );
      setSubmitted(true);
      setTimeout(() => setShowPrompt(false), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  if (!showPrompt) return null;

  if (submitted) return (
    <div className="fixed bottom-6 right-6 bg-white p-6 rounded-[24px] shadow-2xl border border-indigo-100 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Thank You!</h3>
        <p className="text-sm text-gray-500 mt-1">Your feedback helps us evolve the network.</p>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 bg-white p-6 rounded-[32px] shadow-2xl border border-indigo-100 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500 group">
      <button 
        onClick={() => setShowPrompt(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="mb-4 pr-6">
        <h3 className="text-lg font-black text-gray-900 leading-tight">How’s your ProofHire experience?</h3>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">We value your input</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            onClick={() => setRating(star)}
            className={`text-3xl transition-transform hover:scale-125 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea 
        value={feedback} 
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="What can we improve in the Intelligence Network?"
        className="w-full p-4 border border-gray-100 bg-gray-50 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition h-24 mb-4 resize-none"
      />

      <button 
        onClick={handleSubmit}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
      >
        Submit Feedback
      </button>
    </div>
  );
}
