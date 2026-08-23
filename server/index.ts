import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import { initDb } from './db.js';
import { initWebSocket } from './services/realtime.js';

// Import routers
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import circlesRouter from './routes/circles.js';
import invitesRouter from './routes/invites.js';
import outfitsRouter from './routes/outfits.js';
import feedbackRouter from './routes/feedback.js';
import wardrobeRouter from './routes/wardrobe.js';
import analyticsRouter from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// CORS config supporting Flutter web & local dev
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads (pointing to server/uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Initialization
initDb().then(() => {
  console.log('Database connected and initialized.');
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// WebSocket Server initialization
initWebSocket(wss);

// Mount API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/circles', circlesRouter);
app.use('/api/v1/invites', invitesRouter);
app.use('/api/v1/outfits', outfitsRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/wardrobe', wardrobeRouter);
app.use('/api/v1/analytics', analyticsRouter);

// Notification API stub
app.post('/api/v1/notify/circle', (req, res) => {
  const { circleId, title, body } = req.body;
  console.log(`Push notification request received for circle ${circleId}. Title: "${title}", Body: "${body}"`);
  return res.json({
    success: true,
    data: { message: 'Push notification triggered via mock FCM/APNs gateway.' },
    error: null
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: { name: 'FADE Backend API', version: '1.0.0' },
    error: null
  });
});

// Error handling middleware returning standard JSON envelope
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    data: null,
    error: err.message || 'An unexpected error occurred on the server.'
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`FADE Backend Server running on port ${PORT}`);
  console.log(`WebSocket server initialized on the same port.`);
});
