import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import axios from 'axios';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithEmail = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/token",
        `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const { access_token, user_id } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_id", user_id);
      
      // Simulate a user object for consistency
      const user = { uid: user_id, email, accessToken: access_token };
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw new Error("Login failed: " + (error.response?.data?.detail || error.message));
    }
  };

  const login = async (email, password) => {
    try {
      // Try Firebase first
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      console.warn("Firebase login failed, trying local fallback:", firebaseError.message);
      // Fallback to email/password on our own backend
      return await loginWithEmail(email, password);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw new Error("Google login failed: " + error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    return signOut(auth);
  };

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
