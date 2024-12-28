import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons for toggling password visibility

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Track password visibility

  const handleLogin = () => {
    const adminUsername = process.env.REACT_APP_ADMIN;
    const adminPassword = process.env.REACT_APP_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      setUser({ username }); // Set the user object
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Room Map Upload Portal
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the Room Map Upload Portal of the TimeTable Division, BPHC.{" "}
          <br />
          Please log in with your admin credentials to continue.
        </p>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown} // Trigger login on Enter key
            />
            <button
              type="button"
              className="absolute top-2 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Toggle eye icon */}
            </button>
          </div>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
}
