import React from "react";

export default function RoomMap({ user, handleLogout }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome, {user.displayName}!
      </h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 font-semibold text-white bg-red-500 rounded"
      >
        Logout
      </button>
    </div>
  );
}
