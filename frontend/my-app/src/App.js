import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [dark, setDark] = useState(false);

  const handleSubmit = async () => {
    if (!file || !jd) {
      alert("Upload resume + enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jd", jd);

    const res = await axios.post("http://localhost:5000/analyze", formData);
    setResult(res.data);
  };

  return (
    <div className={dark ? "container dark" : "container"}>
      <div className="card">

        {/* Toggle */}
        <div className="toggle">
          <button onClick={() => setDark(!dark)}>
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <h1>🚀 Resume Analyzer</h1>
        <p className="subtitle">Match your resume with job role</p>

        {/* Upload */}
        <label className="upload">
          📄 Upload Resume
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        {file && <p className="fileName">{file.name}</p>}

        {/* JD */}
        <textarea
          placeholder="Paste Job Description..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        {/* Button */}
        <button className="analyzeBtn" onClick={handleSubmit}>
          Analyze Resume
        </button>

        {/* RESULT */}
        {result && (
          <div className="result fade-in">

            <h2>{result.score}% Match</h2>

            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${result.score}%` }}
              ></div>
            </div>

            {/* Missing */}
            {result.missing.length > 0 && (
              <div className="box red">
                <h3>❌ Missing Skills</h3>
                <ul>
                  {result.missing.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="box green">
                <h3>💡 Suggestions</h3>
                <ul>
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default App;