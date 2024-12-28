import React from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

const allowedEmails = process.env.REACT_APP_ALLOWED_EMAILS?.split(",") || [];

export default function Login({ setUser }) {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (allowedEmails.includes(result.user.email)) {
        setUser(result.user);
      } else {
        alert("You are not allowed to access this application.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Room Map Upload Portal
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the Room Map Upload Portal of the TimeTable Division, BPHC. <br/>
          Please log in with your official BITS mail to continue.
        </p>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
