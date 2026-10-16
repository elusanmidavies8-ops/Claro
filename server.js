
require("dotenv").config();

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please provide a message.",
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "OpenRouter API key is not configured.",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-OpenRouter-Title": "Claro",
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content:
                "You are Claro, a friendly and practical personal guide. " +
                "Help users plan, learn, organize tasks, and make progress. " +
                "Be clear, supportive, and honest.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);

      return res.status(response.status).json({
        error:
          data.error?.message ||
          "OpenRouter could not generate a response.",
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "OpenRouter returned an empty response.",
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Claro server error:", error);

    res.status(500).json({
      error: "Sorry, Claro could not generate a response.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Claro server running at http://localhost:${PORT}`);
});

