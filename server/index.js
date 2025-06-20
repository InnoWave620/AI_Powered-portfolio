import express from 'express';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting server...');
console.log('API Key loaded:', process.env.VITE_GROQ_API_KEY ? 'Yes' : 'No');
console.log('API Key (first 10 chars):', process.env.VITE_GROQ_API_KEY ? process.env.VITE_GROQ_API_KEY.substring(0, 10) + '...' : 'Not found');

const app = express();
const port = 5000;

// Initialize Groq API with the key from the environment variable
try {
  const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY });
  console.log('Groq SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Groq SDK:', error);
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY });

app.use(express.json()); // Use express's built-in JSON parser

// Chat route to handle interaction with the Groq API
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  console.log('Received chat request with messages:', messages?.length || 0, 'messages');

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
    if (res.headersSent) {
      // If headers are already sent, we can't send a JSON error response.
      // We'll just end the response. The client will likely detect a prematurely closed stream.
      res.end();
    } else {
      // If headers haven't been sent, we can send a proper JSON error response.
      res.status(500).json({ error: 'Error communicating with the Groq API.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});