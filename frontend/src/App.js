import React, { useState } from "react";
import jsPDF from "jspdf";

function App() {
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [topics, setTopics] = useState([]);
  const [promptStyle, setPromptStyle] = useState("descriptive");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setDescription("Loading...");
    setSummary("");
    setTopics([]);

    try {
      const response = await fetch("http://localhost:5000/api/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      const data = await response.json();
      const explanation = data.explanation || data.error || "No explanation found.";
      setDescription(explanation);

      // Automatically fetch related topics
      const topicRes = await fetch("http://localhost:5000/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      const topicData = await topicRes.json();
      setTopics(topicData.topics || ["No topics found."]);
    } catch {
      setDescription("Error connecting to server.");
      setTopics(["Error fetching topics."]);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description1: description }),
      });

      const data = await response.json();
      setSummary(data.description2 || data.error || "No summary returned.");
    } catch {
      setSummary("Error fetching summary.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(14);
    doc.text("AI Description Generator", 10, y);
    y += 10;

    if (description) {
      doc.setFontSize(12);
      doc.text("Explanation:", 10, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(description, 180), 10, y);
      y += description.length / 2;
    }

    if (summary) {
      doc.setFontSize(12);
      doc.text("Summary:", 10, y + 10);
      y += 20;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(summary, 180), 10, y);
    }

    doc.save("description_summary.pdf");
  };

  return (
    <div style={{ paddingTop: "4rem", fontFamily: "Arial", maxWidth: "600px", margin: "auto", textAlign: "center", color: "white" }}>
      <h1>AI Description Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          style={{ padding: "0.4rem", width: "200px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "0.4rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}>
          Search
        </button>
        <button type="button" onClick={handleSummarize} style={{ marginLeft: "10px", padding: "0.4rem", backgroundColor: "gray", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}>
          Summarize
        </button>
        <select
          value={promptStyle}
          onChange={(e) => setPromptStyle(e.target.value)}
          style={{ marginLeft: "10px", padding: "0.4rem", borderRadius: "4px" }}
        >
          <option value="short">Short</option>
          <option value="descriptive">Descriptive</option>
          <option value="long">Long</option>
        </select>

      </form>

      {description && description !== "Loading..." && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", fontSize: "16px", textAlign: "justify" }}>
          <h3>Explanation:</h3>
          <p>{description}</p>
          <button
            onClick={handleDownloadPDF}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
          >
            Download
          </button>
        </div>
      )}

      {summary && (
        <div style={{ marginTop: "1rem", padding: "1rem", fontSize: "16px", textAlign: "justify" }}>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {topics.length > 0 && topics[0] !== "" && (
        <div style={{ marginTop: "1rem", textAlign: "left", fontSize: "16px" }}>
          <h3>Related Topics:</h3>
          <ul>
            {topics.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;