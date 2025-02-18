import express from "express";
import multer from "multer";
import { createReadStream, unlinkSync } from "fs"; 
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const server = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

server.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const audioPath = req.file.path;

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(audioPath),
      model: "whisper-1", 
    });

    unlinkSync(audioPath);

    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
server.get("/", (req, res) => {
  res.send("Hello World!");
});
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default server; 
