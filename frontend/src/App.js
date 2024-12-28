import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login"; // Import Login component
import RoomMap from "./RoomMap"; // Import RoomMap component

export default function App() {
  const [user, setUser] = useState(null);

  // Handle logout by clearing the user state
  const handleLogout = () => {
    setUser(null); // Simply clear the user state
  };

  return (
    <Router>
      <Routes>
        {/* Redirect root (/) to /roommap */}
        <Route path="/" element={<Navigate to="/roommap" />} />

        {/* Protect the /roommap route */}
        <Route
          path="/roommap"
          element={
            !user ? (
              <Login setUser={setUser} /> // Show login if no user is set
            ) : (
              <RoomMap user={user} handleLogout={handleLogout} /> // Show RoomMap if user is logged in
            )
          }
        />
      </Routes>
    </Router>
  );
}
