import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Your Discord public key from Developer Portal
const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

if (!DISCORD_PUBLIC_KEY) {
  console.error('Missing DISCORD_PUBLIC_KEY in .env');
  process.exit(1);
}

// Verify requests are from Discord
app.post(
  '/interactions',
  verifyKeyMiddleware(DISCORD_PUBLIC_KEY),
  (req, res) => {
    const { type, data } = req.body;

    if (type === 1) {
      // PING request
      return res.json({ type: 1 });
    }

    if (type === 2) {
      // Slash command interaction
      if (data.name === 'ping') {
        return res.json({
          type: 4,
          data: {
            content: 'Pong!',
          },
        });
      }
    }

    return res.status(400).send('Bad request');
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
