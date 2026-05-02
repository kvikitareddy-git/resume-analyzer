const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// create uploads folder if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

/* 🔥 NORMALIZATION FUNCTION */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/node\.js/g, "node")
    .replace(/express\.js/g, "express")
    .replace(/react\.js/g, "react")
    .replace(/mongo(db)?/g, "mongodb")
    .replace(/rest api/g, "api");
}

/* 🚀 MAIN API */
app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const file = fs.readFileSync(req.file.path);
    const data = await pdfParse(file);

    // ✅ normalize both texts
    const resumeText = normalize(data.text);
    const jdText = normalize(req.body.jd);

    // 🎯 skill list
    const skillsList = [
      "javascript", "react", "node", "express", "mongodb",
      "html", "css", "api", "git", "sql", "python",
      "java", "c++", "aws", "docker"
    ];

    // ✅ extract only skills from JD
    const keywords = skillsList.filter(skill => jdText.includes(skill));

    let matched = [];
    let missing = [];

    keywords.forEach(skill => {
      if (resumeText.includes(skill)) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    // ✅ calculate score
    const score =
      keywords.length === 0
        ? 0
        : ((matched.length / keywords.length) * 100).toFixed(2);

    // 💡 suggestions (limit 5 for clean UI)
    const suggestions = missing.slice(0, 5).map(skill =>
      `Consider adding ${skill} experience or projects`
    );

    res.json({
      score,
      matched,
      missing,
      suggestions
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/* 🚀 START SERVER */
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});