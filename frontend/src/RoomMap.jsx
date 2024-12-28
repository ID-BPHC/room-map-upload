import React, { useState } from "react";
import axios from "axios";

const RoomMap = ({ user, handleLogout }) => {
  const [file, setFile] = useState(null);
  const [pageRanges, setPageRanges] = useState([{ start: "", end: "" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultMessage, setResultMessage] = useState(null);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // Handle adding a new page range field
  const handleAddPageRange = () => {
    setPageRanges([...pageRanges, { start: "", end: "" }]);
  };

  // Handle removing a page range field
  const handleRemovePageRange = (index) => {
    const newPageRanges = pageRanges.filter((_, i) => i !== index);
    setPageRanges(newPageRanges);
  };

  // Validate the page ranges
  const validatePageRanges = () => {
    for (let i = 0; i < pageRanges.length; i++) {
      const { start, end } = pageRanges[i];
      if (!start || !end) {
        setErrorMessage(
          "Both start and end page must be provided for each range."
        );
        return false;
      }
      if (isNaN(start) || isNaN(end)) {
        setErrorMessage("Start and end pages must be valid numbers.");
        return false;
      }
      if (parseInt(start) > parseInt(end)) {
        setErrorMessage("Start page cannot be greater than end page.");
        return false;
      }
    }
    setErrorMessage(""); // Clear any previous error messages
    return true;
  };

  // Handle form submission to FastAPI
  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    if (!validatePageRanges()) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await axios.post(
        "http://localhost:8000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (uploadResponse.data.message === "File uploaded successfully") {
        // Ensure the page ranges are correctly formatted before sending
        const pageRangeData = pageRanges.map((range) => ({
          start: parseInt(range.start),
          end: parseInt(range.end),
        }));

        const extractResponse = await axios.post(
          "http://localhost:8000/api/extractRooms",
          {
            filename: uploadResponse.data.filename, // Ensure filename is included here
            page_ranges: pageRangeData, // Ensure page ranges are correctly formatted
          }
        );

        if (extractResponse.data.status === "completed successfully") {
          setResultMessage("Rooms extracted successfully!");
        } else {
          setResultMessage("Rooms extraction completed with errors.");
        }
      }
    } catch (error) {
      console.error("Error uploading or processing file:", error);
      alert("An error occurred while uploading or processing the file.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-200 p-4">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome, {user.displayName}!
      </h1>
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 text-white bg-red-500 rounded"
      >
        Logout
      </button>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Upload PDF and Select Page Ranges
        </h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />

        {pageRanges.map((range, index) => (
          <div className="flex gap-4 items-center mb-4" key={index}>
            <input
              type="number"
              placeholder="Start Page"
              value={range.start}
              onChange={(e) =>
                setPageRanges(
                  pageRanges.map((r, i) =>
                    i === index ? { ...r, start: e.target.value } : r
                  )
                )
              }
              className="p-2 border border-gray-300 rounded w-24"
            />
            <input
              type="number"
              placeholder="End Page"
              value={range.end}
              onChange={(e) =>
                setPageRanges(
                  pageRanges.map((r, i) =>
                    i === index ? { ...r, end: e.target.value } : r
                  )
                )
              }
              className="p-2 border border-gray-300 rounded w-24"
            />
            <button
              onClick={() => handleRemovePageRange(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddPageRange}
          className="mb-4 px-4 py-2 text-white bg-blue-500 rounded"
        >
          Add Page Range
        </button>

        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        {resultMessage && (
          <div className="text-green-500 mb-4">{resultMessage}</div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 text-white bg-green-500 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RoomMap;
