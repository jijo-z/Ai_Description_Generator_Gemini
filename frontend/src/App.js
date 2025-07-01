import React, { useState } from "react";

function App() {
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDescription("Loading...");
    setSummary("");
    
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

    const handleSummarize = async (e) => {
    e.preventDefault();

    if (!description || description === "Loading...") {
      setSummary("Please search and wait for the description first.");
      return;
    }

    setSummary("Summarizing...");
    try {
      const response = await fetch("http://localhost:5000/api/summarize-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description1: description }),
      });

      const data = await response.json();
      setSummary(data.description2 || data.error || "No summary returned.");
    } catch (error) {
      setSummary("Error fetching summary.");
    }
  };
  
  return (
    <div style={{ paddingTop: "4rem", fontFamily: "Arial" , maxWidth: "600px", margin: "auto", boxShadow: "0 10px 10px rgba(0,0,0,0.1)" , textAlign: "center" , color: "white" , fontSize: "24px" , lineHeight: "1.5"}}>
      <h1>AI Description Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          style={{ padding: "0.4rem", width: "200px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "0.4rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" , cursor: "pointer" , fontSize: "14px" }}>
         Search
        </button>
        <button type="button" onClick={handleSummarize} style={{ marginLeft: "10px", padding: "0.4rem", backgroundColor: "gray", color: "white", border: "none", borderRadius: "4px" , cursor: "pointer" , fontSize: "14px" }}>
         Summarize
        </button>
      </form>

      {description && (
        <div style={{ marginTop: "1.5rem" , padding: "1rem", borderRadius: "4px", fontSize: "16px",textAlign:"justify"}}>
          <h3>Explanation:</h3>
          <p>{description}</p>
        </div>
      )}
      {summary && (
        <div
          style={{
            textAlign:"justify",
            margin: "2rem auto",
            maxWidth: "600px",
            padding: "1rem",
            padding: "0.5rem",
            marginBottom: "5rem",
            borderRadius: "8px",
            backgroundColor: "black",
            color: "white",
            fontSize: "16px",
          }}
        >
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
