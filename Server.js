import express from "express";
import multer from "multer";
import { createReadStream } from "fs";
import { promises as fsPromises, existsSync, mkdirSync } from "fs";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const server = express();
const port = 3000;

if (!existsSync("uploads")) {
  mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio files are allowed"), false);
    }
    cb(null, true);
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

server.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const audioPath = req.file.path;

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(audioPath),
      model: "whisper-1",
    });

    await fsPromises.unlink(audioPath);

    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

server.get("/", (req, res) => res.send("Hello World!"));

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));

export default server;
