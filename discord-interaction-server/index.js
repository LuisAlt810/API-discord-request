const express = require('express');
const { verifyKeyMiddleware } = require('discord-interactions');

const app = express();
app.use(express.json());

// Load public key from environment
const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

if (!DISCORD_PUBLIC_KEY) {
  console.error('Missing DISCORD_PUBLIC_KEY in environment');
  process.exit(1);
}

// Middleware to verify incoming request is from Discord
app.post(
  '/interactions',
  verifyKeyMiddleware(DISCORD_PUBLIC_KEY),
  (req, res) => {
    const { type, data } = req.body;

    if (type === 1) {
      // PING request, respond with PONG
      return res.json({ type: 1 });
    }

    if (type === 2) {
      // ApplicationCommand interaction
      if (data.name === 'ping') {
        return res.json({
          type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
          data: {
            content: 'Pong!',
          },
        });
      }
    }

    res.status(400).send('Bad request');
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
