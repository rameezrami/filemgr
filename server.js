const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Folder browsing
app.get("/files", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads"); // Folder where files are stored
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send("Unable to scan directory: " + err);
    }
    res.json(files);
  });
});

// File download
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);
  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(500).send("Could not download the file: " + err.message);
    }
  });
});

// File upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send("File uploaded successfully.");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
