import React, { useState } from "react";

function App() {
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDescription("Loading...");

    try {
      const response = await fetch("http://localhost:5000/api/description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      const data = await response.json();
      setDescription(data.explanation || data.error || "No explanation found.");
    } catch (error) {
      setDescription("Error connecting to server.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Description Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "0.5rem" }}>
          Get Description
        </button>
      </form>

      {description && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Explanation:</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
