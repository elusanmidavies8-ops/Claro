require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please provide a message.",
      });
    }

    let response;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: message,
        });

        break;
      } catch (error) {
        const status = Number(error.status || error.code);
        const temporary = [429, 500, 502, 503, 504].includes(status);

        if (!temporary || attempt === 2) {
          throw error;
        }

        const delay = 1000 * (2 ** attempt);

        console.log(
         `Gemini temporarily unavailable. Retrying in ${delay / 1000}s...`
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    res.status(500).json({
      error: "Sorry, Claro could not generate a response.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Claro server running at http://localhost:${PORT}`);
});
