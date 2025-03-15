import express from 'express';
import { Groq } from 'groq-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

// Initialize Groq API with the key from the environment variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json()); // Use express's built-in JSON parser

// Chat route to handle interaction with the Groq API
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || '';
      res.write(content);
    }

    res.end();
  } catch (error) {
    console.error('Error with Groq API:', error);
    res.status(500).json({ error: 'Error communicating with the Groq API.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
