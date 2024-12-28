import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./Login"; // Import Login component
import RoomMap from "./RoomMap"; // Import RoomMap component

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
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
              <Login setUser={setUser} />
            ) : (
              <RoomMap user={user} handleLogout={handleLogout} />
            )
          }
        />
      </Routes>
    </Router>
  );
}
