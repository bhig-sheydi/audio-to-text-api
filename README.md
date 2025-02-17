# Audio Transcription API

This is a simple Node.js API that allows users to upload an audio file and get a transcription using OpenAI's Whisper model.

## Features
- Upload an audio file via an API endpoint.
- Uses OpenAI's Whisper model to transcribe audio.
- Deletes the uploaded file after transcription.

## Prerequisites
Before running this project, ensure you have the following:
- Node.js installed
- An OpenAI API key
- `dotenv`, `express`, `multer`, `fs`, and `openai` packages installed

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/audio-transcription-api.git
   cd audio-transcription-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Create an `uploads` directory in the root folder:
   ```bash
   mkdir uploads
   ```

## Usage

### Start the Server
Run the server using:
```bash
node index.js
```
The server will start on `http://localhost:3000`.

### Transcribe an Audio File
Send a `POST` request to `/transcribe` with an audio file using Postman or cURL:

#### Example cURL Request:
```bash
curl -X POST http://localhost:3000/transcribe \
     -F "audio=@path/to/audio/file.mp3"
```

#### Example Response:
```json
{
  "transcription": "This is an example transcription of the uploaded audio file."
}
```

## Error Handling
- If no file is uploaded:
  ```json
  { "error": "No file uploaded" }
  ```
- If an internal server error occurs:
  ```json
  { "error": "Internal server error" }
  ```

## Technologies Used
- Node.js
- Express
- Multer (for file uploads)
- OpenAI API (Whisper model)

## License
This project is licensed under the MIT License.

## Author
Your Name - [Your GitHub](https://github.com/your-username)

